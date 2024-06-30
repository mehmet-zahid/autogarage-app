<script setup lang="ts">
import type { Vehicle, Service, ServiceWithOperations } from '~/types/business';
import { ServiceModalCard } from '#components'
import { Back, Delete, SuccessFilled, ArrowRight, RefreshRight, Box } from '@element-plus/icons-vue';

const { getVehicleById, createService, updateService, getServicesWithOperationsByVehicleId } = useDatabase();
const modal = useModal()

const vehicle_id = parseInt(useRoute().params.vehicle_id);
console.log(vehicle_id)
const vehicle = ref(null as Vehicle | null);
vehicle.value = await getVehicleById(vehicle_id);
console.log(toRaw(vehicle.value))
const username = useLocalStorage('username', null);
const services = ref([] as ServiceWithOperations[]);
services.value = await getServicesWithOperationsByVehicleId(vehicle_id);
console.log(toRaw(services.value))

const filterText = useLocalStorage(`serviceFilterText_${vehicle_id}`, 'All');

const createNewService = async () => {
    // creating with default values
    const createdService: Service = await createService({
        vehicle_id: vehicle_id,
        total_cost: 0,
        note: '',
        createdBy: username.value,
        createdAt: new Date(),
    });

    services.value = await getServicesWithOperationsByVehicleId(vehicle_id);
    console.log(toRaw(services.value))
    useShowToast('Yeni servis oluşturuldu.', 'success', 2000);
}

const completeServiceHandler = async (service: ServiceWithOperations) => {
    const updateData: Service = {
        id: service.id,
        vehicle_id: service.vehicle_id,
        completedAt: new Date(),
        total_cost: service.total_cost,
        note: service.note,
        createdBy: service.createdBy,
        createdAt: service.createdAt,
        isDeleted: 0
    };
    await updateService(updateData);
    services.value = await getServicesWithOperationsByVehicleId(vehicle_id);
    useShowToast('Servis tamamlandı olarak işaretlendi.', 'success', 2000);

}

const deleteServiceHandler = async (service: ServiceWithOperations) => {
    const updateData: Service = {
        id: service.id,
        vehicle_id: service.vehicle_id,
        completedAt: service.completedAt,
        total_cost: service.total_cost,
        note: service.note,
        createdBy: service.createdBy,
        createdAt: service.createdAt,
        isDeleted: 1
    };
    await updateService(updateData);
    useShowToast('Servis silindi.', 'success', 2000);
    services.value = await getServicesWithOperationsByVehicleId(vehicle_id);
    
}

function capitalize(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

function formatDateTime(date) {
    if (!date) return '';
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const filteredServices = computed(() => {
    const filterLower = filterText.value.trim().toLowerCase();

    return services.value.filter(service => {
        if (filterLower === 'completed') {
            return service.completedAt != null;
        } else if (filterLower === 'inprogress') {
            return service.completedAt == null;
        } else if (filterLower === 'all') {
            return true;
        }
        return true; // To handle any unexpected filterText values
    });
});


const filterOptions = [
    {
        label: 'Tamamlandı',
        value: 'Completed',
        icon: SuccessFilled,
    },
    {
        label: 'İşlemde',
        value: 'InProgress',
        icon: RefreshRight,
    },
    {
        label: 'Hepsi',
        value: 'All',
        icon: Box,
    }];

const openServiceModal = (service: ServiceWithOperations) => {
    modal.open(ServiceModalCard, {
        service_id: service.id,
    })
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <span v-if="!vehicle" class="text-2xl font-semibold">Araç bilgisi yükleniyor...</span>
        <div v-else class="m-3">
            <UCard>
                <template #header>
                    <div class="flex gap-10">
                        <div class="flex items-center cursor-pointer" @click="$router.back()">
                            <el-icon size="25">
                                <Back />
                            </el-icon>
                        </div>
                        <UButton icon="i-heroicons-plus-circle" @click="createNewService" color="lime">
                            Yeni Servis
                        </UButton>
                        <div class="font-extrabold flex gap-4 text-lg [text-wrap:balance] text-gray-300">
                            <el-tag size="large" type="info" class="hover:text-green-600">{{ capitalize(vehicle.make) }}
                                - {{ capitalize(vehicle.model) }}</el-tag>
                            <span
                                class="inline-flex flex-col h-[calc(theme(fontSize.lg)*theme(lineHeight.tight))] overflow-hidden">
                                <ul class="block text-left leading-tight [&_li]:block animate-text-slide">
                                    <li class="text-indigo-500">{{ vehicle.plateNumber }}</li>
                                    <li class="text-rose-500">{{ vehicle.year }}</li>
                                    <li class="text-yellow-500">{{ formatNumber(vehicle.mileage) }} Km</li>
                                </ul>
                            </span>
                            <el-tag size="large" type="warning">Toplam Servis: {{ services.length }}</el-tag>
                        </div>

                    </div>
                </template>

                <div class="h-full flex flex-col gap-2">
                    <el-segmented v-model="filterText" :options="filterOptions">
                        <template #default="{ item }">
                            <div class="flex flex-col items-center gap-2 p-2">
                                <el-icon size="20">
                                    <component :is="item.icon" />
                                </el-icon>
                                <div>{{ item.label }}</div>
                            </div>
                        </template>
                    </el-segmented>
                    <div>
                    <el-scrollbar height="400px">
                        <transition-group name="fade" tag="div">

                            <div v-for="(service, index) in filteredServices" :key="service.id"
                                class="flex flex-col gap-2 relative">

                                <div
                                    class="m-3 mr-4 p-2 flex flex-col gap-2 items-center group rounded-lg border-b border-solid dark:border-neutral-700 dark:bg-neutral-800 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/80 hover:shadow-green-400 shadow-sm">

                                    <!-- ABSOLUTE POSITION-->
                                    <el-tag type="info" size="large"
                                        class="text-2xl font-serif text-gray-400 group-hover:text-gray-300 absolute left-5 top-4">
                                        {{ index + 1 }}
                                    </el-tag>

                                    <!-- ABSOLUTE POSITION-->
                                    <div class="absolute right-7 top-1/2 transform -translate-y-1/2">
                                        <el-tooltip class="cursor-pointer" effect="dark" placement="bottom"
                                            content="Servis Detayı"><el-button :icon="ArrowRight" circle
                                                @click="openServiceModal(service)" />
                                        </el-tooltip>
                                    </div>

                                    <div class="ml-2 flex gap-2 justify-center items-center">
                                        <el-tag size="large" type="success">ServiceID: {{ service.id }}
                                        </el-tag>
                                        <el-tag size="large" type="danger">Toplam Tutar: {{
            formatNumber(service.total_cost) }}
                                            TL</el-tag>
                                        <el-tag size="large" :type="service.completedAt ? 'success' : 'info'">Durum:
                                            {{
            service.completedAt
                ? 'Tamamlandı' : 'İşlemde' }}</el-tag>
                                        <el-tag size="large" type="warning">Toplam Operasyon: {{
            service.operations.length }}
                                        </el-tag>
                                        <div class="ml-3 flex gap-2  items-center justify-center">
                                            <el-tooltip effect="dark" placement="top"
                                                content="Servisi Tamamla"><el-button v-if="!service.completedAt"
                                                    type="success" :icon="SuccessFilled" circle
                                                    @click="completeServiceHandler(service)" />
                                                <el-button v-else type="success" :icon="SuccessFilled" circle
                                                    disabled />
                                            </el-tooltip>
                                            <el-tooltip effect="dark" placement="top" content="Servisi Sil"><el-button
                                                    @click="deleteServiceHandler(service)" type="danger" :icon="Delete"
                                                    circle />
                                            </el-tooltip>
                                        </div>

                                        <el-text class="mx-1" type="info">{{ formatDateTime(service.createdAt) }}
                                            oluşturuldu</el-text>


                                    </div>

                                </div>


                            </div>

                        </transition-group>
                    </el-scrollbar>
                </div>
                </div>

            </UCard>
        </div>

    </div>
</template>


<style>
.animate-text-slide {
    animation: text-slide 10s infinite;
}

@keyframes text-slide {

    0%,
    16.66% {
        transform: translateY(0%);
    }

    33.33%,
    49.99% {
        transform: translateY(-33.33%);
    }

    66.66%,
    83.32% {
        transform: translateY(-66.66%);
    }

    100% {
        transform: translateY(-100%);
    }
}
</style>
