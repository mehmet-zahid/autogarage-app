<script setup lang="ts">
import type { ServiceType } from '~/types/business'
import { ElMessageBox } from 'element-plus'
import { ServiceTypeUpdateModal } from '#components'
import { CircleCloseFilled } from '@element-plus/icons-vue'


const { getServiceTypes, deleteServiceTypes, updateServiceType } = await useDatabase()
const serviceTypes = ref<ServiceType[]>([])
const modal = useModal()
const dialog = ref(false)
const pending = ref(false)

const callGetServiceTypes = async () => {
    console.log("Getting Service Types")
    serviceTypes.value = await getServiceTypes()
}

onMounted(async () => {
    await callGetServiceTypes()
})

const columns = [
    { id: 1, key: 'id', label: 'ID', sortable: true },
    { id: 2, key: 'name', label: 'Operasyon Türü', sortable: true },
    { id: 3, key: 'price', label: 'Fiyat', sortable: true },
    { id: 4, key: 'createdBy', label: 'Oluşturan', sortable: true },
    { id: 5, key: 'createdAt', label: 'Oluşturulma Tarihi', sortable: true },
]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Selected Rows
const selectedRows = ref([])

function select(row) {
    const index = selectedRows.value.findIndex((item) => item.id === row.id)
    if (index === -1) {
        selectedRows.value.push(row)
    } else {
        selectedRows.value.splice(index, 1)
    }
}
const sort = ref({ column: 'id', direction: 'asc' as const })
const q = ref('')
const filteredRows = computed(() => {
    if (!q.value) {
        return serviceTypes.value?.map((serviceType) => {
            return {
                id: serviceType.id,
                name: serviceType.name,
                price: serviceType.price,
                createdBy: serviceType.createdBy,
                createdAt: serviceType.createdAt,
            }
        })
    }

    return serviceTypes.value?.filter((serviceType) => {
        return serviceType.name.toLowerCase().includes(q.value.toLowerCase())
    }).map((serviceType) => {
        return {
            id: serviceType.id,
            name: serviceType.name,
            price: serviceType.price,
            createdBy: serviceType.createdBy,
            createdAt: serviceType.createdAt,
        }
    })
})



const deleteServiceTypesHandler = async () => {

    if (selectedRows.value.length === 0) {
        useShowToast("Operasyon türü seçiniz", "error")
        return
    }

    pending.value = true
    try {
        await deleteServiceTypes(selectedRows.value.map((row) => row.id))
        await callGetServiceTypes()
    } catch (error) {
        console.error(error)
        useShowToast("Bir Sorun oluştu!", "error")
    }
    pending.value = false
    dialogVisible.value = false
}

const openUpdateModal = (serviceType: ServiceType) => {
    modal.open(ServiceTypeUpdateModal, {
        serviceType: serviceType,
        onRefreshData: callGetServiceTypes
    })
}



const dialogVisible = ref(false)

</script>

<template>
    <div>
        <UCard>
            <template #header></template>
            <div class="flex px-3 gap-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="q" placeholder="Filtrele..." />
                <UButton label="Yeni Oluştur" @click="() => dialog = true" icon="i-heroicons-plus-circle-16-solid" />
                <UButton v-if="selectedRows.length > 0" :label="selectedRows.length > 1 ? 'Seçilenleri Sil' : 'Sil'"
                    @click="dialogVisible = true" icon="i-heroicons-trash-20-solid" color="red" />
            </div>

            <UTable v-model="selectedRows" v-model:sort="sort" sort-mode="manual"
                sort-asc-icon="i-heroicons-arrow-up-20-solid" sort-desc-icon="i-heroicons-arrow-down-20-solid"
                :sort-button="{ icon: 'i-heroicons-sparkles-20-solid', color: 'primary', variant: 'outline', size: '2xs', square: false, ui: { rounded: 'rounded-full' } }"
                :loading="pending" :loading-icon="`i-heroicons-refresh-20-solid`" class="w-full h-[700px] text-left"
                :columns="columnsTable" :rows="filteredRows" @select="select">

                <template #id-data="{ row }">
                    <div class="flex gap-2">
                        <span class="flex-1"> {{ row.id }}.</span>
                        <UTooltip text="Güncelle" class="flex-4">
                            <UButton v-if="!row.isSynched" icon="i-heroicons-pencil-solid" color="lime" size="xs"
                                variant="outline" :ui="{ rounded: 'rounded-full' }" square class="flex-3"
                                @click.stop="openUpdateModal(row)" />
                        </UTooltip>
                    </div>
                </template>
                <template #loading-state>
                    <div class="flex items-center justify-center h-32">
                        <i class="loader --6" />
                    </div>
                </template>

                <template #empty-state>
                    <div class="flex flex-col items-center justify-center py-6 gap-3">
                        <span class="italic text-sm">Hiç Veri Yok</span>


                        <UButton label="Yeni Oluştur" @click="() => dialog = true"
                            icon="i-heroicons-plus-circle-16-solid" />
                    </div>
                </template>


            </UTable>

            <el-drawer v-model="dialog" title="Servis Operasyon Türü Oluştur" direction="rtl">

                <ServiceTypeCreateForm @close-modal="() => dialog = false" @refresh-data="callGetServiceTypes" />

            </el-drawer>

            <template #footer></template>

        </UCard>
        <el-dialog v-model="dialogVisible" title="Uyarı" width="500" center>
            <span>
                Eğer bu servis operasyon türünü silerseniz, bu operasyon türünü referans veren tüm operasyonlar da
                silinecektir.
                Devam etmek istediğinize emin misiniz?
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">İptal</el-button>
                    <el-button type="danger" @click="deleteServiceTypesHandler">
                        <el-icon class="el-icon--left">
                            <CircleCloseFilled />
                        </el-icon>
                        Silmeyi Onayla
                    </el-button>

                </div>
            </template>
        </el-dialog>


    </div>

</template>

<style scoped>
/* https://codepen.io/jenning/pen/YzNmzaV */
.loader {
    --color: rgb(var(--color-primary-400));
    --size-mid: 6vmin;
    --size-dot: 1.5vmin;
    --size-bar: 0.4vmin;
    --size-square: 3vmin;

    display: block;
    position: relative;
    width: 50%;
    display: grid;
    place-items: center;
}

.loader::before,
.loader::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
}

/**
    loader --6
**/
.loader.--6::before {
    width: var(--size-square);
    height: var(--size-square);
    background-color: var(--color);
    top: calc(50% - var(--size-square));
    left: calc(50% - var(--size-square));
    animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {

    0%,
    100% {
        transform: none;
    }

    25% {
        transform: translateX(100%);
    }

    50% {
        transform: translateX(100%) translateY(100%);
    }

    75% {
        transform: translateY(100%);
    }
}
</style>