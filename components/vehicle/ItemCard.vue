<script setup lang="ts">
import type { Vehicle } from '~/types/business';
import { VehicleUpdateModal } from '#components'

const props = defineProps < {
    vehicle: Vehicle;
} > ();

const emit = defineEmits(['refreshData', 'click']);
const { deleteVehicle } = useDatabase();
const modal = useModal()

const deleteVehicleHandler = async (id:number) => {
  await deleteVehicle(id)
  useShowToast("Araç başarıyla silindi", "success")
    emit('refreshData')
}

const openUpdateModal = (vehicle: Vehicle) => {
  console.log("Modal open function", vehicle)
  modal.open(VehicleUpdateModal, {
    vehicle: vehicle,
    onRefreshData: () => emit('refreshData'),
  })
}


const getDropdownItems = (vehicle: Vehicle) => [
  [{
    label: 'Güncelle',
    slot: 'update',
    icon: 'i-heroicons-pencil',
    disabled: false,
    click: () => openUpdateModal(vehicle)
  }], [{
    label: 'Sil',
    slot: 'delete',
    icon: 'i-heroicons-trash',
    disabled: false,
    click: async () => await deleteVehicleHandler(vehicle.id)
  }]
];
</script>

<template>
    <div class="vehicle-card p-2 relative h-32 rounded-lg shadow-md flex gap-4 items-center cursor-pointer border 
    border-solid border-gray-800 transition-all hover:border-green-400" @click="() => $router.push(`/oto/vehicle/${props.vehicle.id}`)">
        <div class="vehicle-info flex flex-col gap-1 text-gray-300">
            <div class="font-bold ">{{ props.vehicle.make }} - {{ props.vehicle.model }}</div>
            <div class="">{{ props.vehicle.plateNumber }}</div>
            <div class="">{{ props.vehicle.year }}</div>
        </div>

        <div class="vehicle-tags flex flex-col gap-2">
          <el-tag type="success">Kilometre: {{ props.vehicle.mileage }}</el-tag>
          <el-tag type="success">Renk: {{ props.vehicle.color }}</el-tag>

        </div>

        <UDropdown :items="getDropdownItems(props.vehicle)" :ui="{ item: { disabled: 'cursor-text select-text' } }"
            class="absolute right-1 top-1" @click.stop>
            <Icon name="heroicons-outline:dots-horizontal" class="text-green-500" size="24" />

            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>
              <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
            </template>
          </UDropdown>



    </div>
</template>

<style scoped>
.vehicle-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  /* Ensure child elements do not overflow the parent */
  overflow: hidden;
}

.vehicle-info, .vehicle-tags {
  flex: 1;
  min-width: 0; /* Prevents overflow */
}

@media (max-width: 768px) {
  .vehicle-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>