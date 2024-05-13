<script setup lang="ts">
import type { Customer } from '~/types/business';

const { getCustomerById } = useDatabase();

const customer = ref(null as Customer | null);

onMounted(async () => {
    const customer_id = parseInt(useRoute().params.customer_id);
    customer.value = await getCustomerById(customer_id);
});
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
    <div class="flex flex-col gap-2">
        <div class="flex gap-2 justify-center mt-4 align-middle">
            <UBreadcrumb :links="breadcrumbLinks" />
        </div>

        <div class="flex gap-2 h-screen p-2">
            <ServiceItemsCard class="flex-1" :customer_name="customer?.fullName" :customer_reg_date="customer?.registeredAt" />
            
        </div>
    </div>
</template>
