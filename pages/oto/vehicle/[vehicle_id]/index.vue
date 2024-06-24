<script setup lang="ts">
import type { Vehicle, Service } from '~/types/business';

import { Back, Delete } from '@element-plus/icons-vue';

const { getVehicleById, createService, getServicesByVehicleId, updateService } = useDatabase();


const vehicle_id = parseInt(useRoute().params.vehicle_id);
console.log(vehicle_id)
const vehicle = ref(null as Vehicle | null);
const { username } = useUser();
const services = ref([] as Service[]);
services.value = await getServicesByVehicleId(vehicle_id);


const createNewService = async () => {
    // creating with default values
    const createdService: Service = await createService({
        vehicle_id: vehicle_id,
        total_cost: 0,
        note: '',
        createdBy: username as string,
        createdAt: new Date()
    });

    services.value.push(createdService);
    useShowToast('Yeni servis oluşturuldu.', 'success', 2000);
}

const updateServiceHandler = async (service: Service) => {
    service.completedAt = new Date();
    await updateService(service);
    useShowToast('Servis tamamlandı olarak işaretlendi.', 'success', 2000);

}

const deleteServiceHandler = async (service: Service) => {
    service.isDeleted = 1;
    await updateService(service);
    useShowToast('Servis silindi.', 'success', 2000);
    services.value = await getServicesByVehicleId(vehicle_id);
}

onMounted(async () => {

    vehicle.value = await getVehicleById(vehicle_id);
    console.log(toRaw(vehicle.value))
});

function capitalize(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
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

                <div class="h-96 flex flex-col gap-2">
                    <el-scrollbar height="400px">
                        <div v-for="(service, index) in services" :key="service.id"
                            class="flex flex-col gap-2 relative">

                            <div
                                class="m-3 mr-4 p-2 flex flex-col gap-2 items-center group rounded-lg border-b border-solid dark:border-neutral-700 dark:bg-neutral-800 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/80 hover:shadow-green-400 shadow-sm">
                                <span
                                    class="text-2xl font-serif text-gray-400 group-hover:text-gray-300 absolute left-5 top-4">
                                    {{ index + 1 }}
                                </span>
                                <el-tooltip effect="dark" placement="left-end" content="Servisi Sil"><el-button
                                        @click="deleteServiceHandler(service)" class="absolute right-10 top-8"
                                        type="danger" :icon="Delete" circle />
                                </el-tooltip>
                                <div class="m-1 flex gap-10">

                                    <div>
                                        <el-button v-if="!service.completedAt" plain
                                            @click="updateServiceHandler(service)">Tamamla</el-button>
                                        <el-button type="primary" plain>Primary</el-button>
                                        <el-button type="success" plain>Success</el-button>
                                        <el-button type="info" plain>Info</el-button>

                                    </div>


                                </div>
                                <div class="flex">
                                    <div class="flex-none w-14 h-14">

                                    </div>
                                    <div class="grow h-14 flex flex-col gap-2 m-2">
                                        <div class="flex gap-3">
                                            <el-tag size="large" type="success">ServiceID: {{ service.id }}
                                            </el-tag>
                                            <el-tag size="large" type="info">Toplam Tutar: {{
            formatNumber(service.total_cost) }}
                                                TL</el-tag>
                                        </div>
                                        <div>
                                            <el-tag size="large" :type="service.completedAt ? 'success' : 'info'">Durum: {{
            service.completedAt
                                                ? 'Tamamlandı' : 'Devam ediyor' }}</el-tag>
                                        </div>

                                    </div>
                                    <div class="flex-none w-14 h-14 m-2">
                                        <el-tag size="large" type="warning">Toplam Operasyon: 5
                                        </el-tag>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-scrollbar>
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
