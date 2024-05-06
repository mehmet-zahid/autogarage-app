<script setup>

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
        Customer detay sayfası
        {{ $route.params.customer_id }}
    </div>
</template>

