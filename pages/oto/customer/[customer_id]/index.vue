<script setup lang="ts">
import type { Customer, Vehicle } from '~/types/business';
import { Search } from '@element-plus/icons-vue'

const { getCustomerById, getVehiclesByCustomerId } = await useDatabase();
const isSlideOpen = ref(false)
const customer_id = parseInt(useRoute().params.customer_id)
const customer = ref<Customer | null>(null);
const vehicles = ref<Vehicle[] | null>(null);
const route = useRoute();

onMounted(async () => {
    try {
        customer.value = await getCustomerById(customer_id);
        console.log(toRaw(customer.value))
        vehicles.value = await getVehiclesByCustomerId(customer_id);
        console.log(toRaw(vehicles.value))
    } catch (error) {
        console.error('Error fetching customer or vehicles:', error);
        // Handle error, maybe redirect or show a notification
    }
});

watch(() => route.params, async (newParams) => {
  if (newParams && newParams.customer_id) {
    try {
        customer.value = await getCustomerById(customer_id);
        vehicles.value = await getVehiclesByCustomerId(customer_id);
    } catch (error) {
        console.error('Error fetching customer or vehicles:', error);
        // Handle error, maybe redirect or show a notification
    }
  } else {
    console.error("customer_id is undefined or invalid");
    // Handle the case where customer_id is invalid, maybe redirect or show an error
  }
}, { immediate: true, deep: true });

const searchQuery = ref('');

const filteredVehicles = computed(() => {
  if (!searchQuery.value) {
    return vehicles.value;
  }
  return vehicles.value.filter((vehicle: Vehicle) =>
    vehicle.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    vehicle.plateNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    vehicle.year.toString().includes(searchQuery.value)
    
  );
});

const callGetVehicles = async () => {
    console.log("Call get customers")
    vehicles.value = await getVehiclesByCustomerId(customer_id);
    console.log(toRaw(vehicles.value))
}

const breadcrumbLinks = ref([
    {
        label: 'Müşteriler',
        icon: 'i-heroicons-user',
        to: '/oto/customer',
    },
    {
        label: 'Müşteri Detay',
        icon: 'i-heroicons-user-circle',
    },
]);



</script>

<template>
    <div class="m-3 flex flex-col gap-3">
      <div class="flex gap-2 justify-center mt-4 align-middle">
        <UBreadcrumb :links="breadcrumbLinks" />
      </div>
      <span class="text-2xl font-semibold text-gray-500">{{ customer?.name }}</span>
      <UCard>
        <template #header>
          <div class="flex gap-3">
            <UButton icon="i-heroicons-plus" @click="isSlideOpen = true">
              Yeni Araç Ekle
            </UButton>
            <USlideover v-model="isSlideOpen">
              <UCard class="flex flex-col flex-1"
                :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                  <Placeholder class="h-8" />
                </template>
  
                <VehicleCreateForm @close-modal="isSlideOpen = false" @refresh-data="callGetVehicles" :customer_id="customer_id" />
  
                <template #footer>
                  <Placeholder class="h-8" />
                </template>
              </UCard>
            </USlideover>
          </div>
          <div class="mt-4 flex gap-4">
            <el-input v-model="searchQuery" style="max-width: 600px" placeholder="Araç Ara..." class="input-with-select">
              <template #append>
                <el-button :icon="Search" />
              </template>
            </el-input>
          </div>
        </template>
        <div v-if="!vehicles" class="flex justify-center items-center mx-auto text-lg font-medium">
          Yükleniyor...
        </div>
        <div class="justify-center items-center mx-auto text-lg font-medium" v-else-if="vehicles.length < 1">
          Henüz Hiç Araç yok
        </div>
        <div v-else class="grid grid-cols-3 gap-4">
          <VehicleItemCard v-for="vehicle in filteredVehicles" :key="vehicle.id" :vehicle="vehicle"
            @refresh-data="callGetVehicles"/>
        </div>
      </UCard>
    </div>
  </template>
  
