<script setup lang="ts">
import type { Vehicle } from '~/types/business';

const { getVehicleById } = useDatabase();

const vehicle = ref(null as Vehicle | null);

onMounted(async () => {
    const vehicle_id = parseInt(useRoute().params.vehicle_id);
    vehicle.value = await getVehicleById(vehicle_id);
});
const breadcrumbLinks = ref([
    {
        label: 'Araçlar',
        icon: 'i-heroicons-user',
        to: '/oto/vehicle',
    },
    {
        label: 'Araç Detay',
        icon: 'i-heroicons-user-circle',
    },
]);



</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex gap-2 justify-center mt-4 align-middle">
            <UBreadcrumb :links="breadcrumbLinks" />
        </div>

        <div class="flex gap-2 h-screen p-2">
            <ServiceItemsCard class="flex-1" :vehicle_name="vehicle?.fullName"/>
            
        </div>
    </div>
</template>
