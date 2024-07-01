<script setup lang="ts">
import type { ServiceOperationsWithTypes, ServiceOperation } from '~/types/business'

const pending = ref(true)
const { getServiceOpsWithServiceTypesByServiceId, deleteServiceOperations } = await useDatabase()

const modal = useModal()
const serviceOperations = ref<ServiceOperationsWithTypes[] | null>([])


const props = defineProps<{
  service_id: number
}>()

const refreshData = async () => {
  pending.value = true
  serviceOperations.value = await getServiceOpsWithServiceTypesByServiceId(props.service_id)
  console.log("Service Operations", serviceOperations.value)
  pending.value = false
}


await refreshData()

const columns = [
  { id: 1, key: 'id', label: 'Operasyon ID', sortable: true },
  { id: 2, key: 'service_type', label: 'Operasyon Türü', sortable: true },
  { id: 3, key: 'price', label: 'Fiyat', sortable: true },
  { id: 4, key: 'quantity', label: 'Adet', sortable: true },
  { id: 5, key: 'createdBy', label: 'Oluşturan', sortable: true },
  { id: 6, key: 'createdAt', label: 'Oluşturulma Tarihi', sortable: true },
]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// const emit = defineEmits(['refreshData'])

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return serviceOperations.value?.map((serviceOperation) => {
      return {
        id: serviceOperation.id,
        service_type: serviceOperation.service_type.name,
        price: serviceOperation.service_type.price + " TL",
        quantity: serviceOperation.quantity,
        createdBy: serviceOperation.createdBy,
        createdAt: serviceOperation.createdAt,
      }
    })
  }

  const dataforui = serviceOperations.value?.map((serviceOperation) => {
    return {
      id: serviceOperation.id,
      service_type: serviceOperation.service_type.name,
      price: serviceOperation.service_type.price + " TL",
      quantity: serviceOperation.quantity,
      createdBy: serviceOperation.createdBy,
      createdAt: serviceOperation.createdAt,
    }
  })

  if (!dataforui) {
    return []
  }

  return dataforui.filter((row) => {
    return Object.values(row).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

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

const isSlideOpen = ref(false)

const totalPrice = computed(() => {
  return serviceOperations.value?.reduce((sum, serviceOperation) => {
    return sum + serviceOperation.service_type.price * serviceOperation.quantity
  }, 0) ?? 0
})

const deleteOperationsHandler = async () => {
  if (selectedRows.value.length === 0) {
    useShowToast('Lütfen en az bir operasyon seçiniz', 'error')
    return
  }

  await deleteServiceOperations(selectedRows.value.map((row) => row.id))
  useShowToast('Seçili Operasyonlar silindi', 'success')
  await refreshData()
}

const DropdownItems = [
   [{
    label: 'Sil',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D'],
    click: async () => await deleteOperationsHandler()
  }]
]
</script>




<template>
  <UModal fullscreen>
    <div class="m-4 flex flex-col gap-4">
      <UCard>
        <template #header>
          <div class="h-6 flex gap-5 justify-between items-center">
            <div class="flex gap-2  items-center">
              <div class="flex gap-2">
                <h1 class="text-md font-bold text-gray-400">Servis No:</h1>
                <el-tag type="success">{{ props.service_id }}</el-tag>
              </div>
              <el-divider direction="vertical" class="text-3xl"></el-divider>
              <div class="flex gap-2">
                <h1 class="text-md font-bold text-gray-400">Operasyon Sayısı:</h1>
                <el-tag type="success">{{ serviceOperations?.length }}</el-tag>
              </div>
            </div>
            <div class="">
              <UTooltip text="Yeni Operasyon" class="flex-4">
                <UButton icon="i-heroicons-plus-16-solid" @click="() => isSlideOpen = true" color="orange"
                  variant="outline" :ui="{ rounded: 'rounded-full' }" square />
              </UTooltip>
            </div>

          </div>
        </template>
        <div class="flex px-3 gap-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
          <UInput v-model="q" placeholder="Filtrele..." />
          <UDropdown :items="DropdownItems" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" label="Aksiyonlar" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
        </div>
        <UTable v-model="selectedRows" v-model:sort="sort" sort-mode="manual"
          sort-asc-icon="i-heroicons-arrow-up-20-solid" sort-desc-icon="i-heroicons-arrow-down-20-solid"
          :sort-button="{ icon: 'i-heroicons-sparkles-20-solid', color: 'primary', variant: 'outline', size: '2xs', square: false, ui: { rounded: 'rounded-full' } }"
          :loading="pending" :loading-icon="`i-heroicons-refresh-20-solid`" class="w-full" :columns="columnsTable"
          :rows="filteredRows" @select="select">
          <template #loading-state>
            <div class="flex items-center justify-center h-32">
              <i class="loader --6" />
            </div>
          </template>

          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6 gap-3">
              <span class="italic text-sm">Hiç Veri Yok</span>


              <UButton label="Operasyon Oluştur" @click="isSlideOpen = true" />
            </div>
          </template>


        </UTable>

        <USlideover v-model="isSlideOpen">
          <UCard class="flex flex-col flex-1"
            :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <div class="h-8"></div>
            </template>

            <ServiceOperationCreateForm :service_id="props.service_id" close-modal="isSlideOpen = false"
              @refresh-data="refreshData" />

            <template #footer>

            </template>
          </UCard>
        </USlideover>

        <template #footer>
          <div class="flex gap-2 justify-between">
            <div class="flex gap-2 justify-center items-center">
              <span class="text-gray-400 text-lg font-bold">Toplam Tutar:</span>
              <el-tag type="success">{{ totalPrice }} TL</el-tag>
            </div>
            <div></div>
          </div>
        </template>

      </UCard>

    </div>
  </UModal>
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