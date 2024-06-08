<script setup lang="ts">
import type { Vehicle } from '~/types/business';
import { VehicleUpdateModal } from '#components'

const props = defineProps < {
    vehicle: Vehicle;
} > ();

const emit = defineEmits(['refreshData']);
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
    <div class="p-2 relative h-32 rounded-lg shadow-md flex gap-4 items-center cursor-pointer border 
    border-solid border-gray-800 transition-all hover:border-green-400">
        <div class="flex flex-col gap-1">
            <div class="text-lg font-semibold">{{ props.vehicle.make }} - {{ props.vehicle.model }}</div>
            <div class="text-sm">{{ props.vehicle.plateNumber }}</div>
            <div class="text-sm">{{ props.vehicle.year }}</div>
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