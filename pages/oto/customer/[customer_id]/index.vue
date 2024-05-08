<script setup lang="ts">
import type { Customer } from '~/types/business';

const { getCustomerById, updateCustomer } = useDatabase();
const route = useRoute();

const customer = ref<Customer | undefined>(undefined);
customer.value = await getCustomerById(route.params.customer_id);

const is_customer_data_changed = ref(false);

watch(customer, (value) => {
    console.log("customer data has been changed")
    is_customer_data_changed.value = true;
}, { deep: true });
console.log(customer);

const saveChanges = async () => {
    console.log("saveChanges")
    try {
        if (!customer.value) {
            throw new Error("Customer data is not available");
        }

        const update_res = await updateCustomer(customer.value);
        console.log("Update Result: ", update_res)
        is_customer_data_changed.value = false;
        useShowToast("Müşteri bilgileri güncellendi", "success");
    } catch (error) {
    console.error(error);
    useShowToast("Müşteri Bilgisi Güncellenemedi!", "error");
}
};



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
        <div class="m-3">
            <UCard class="w-full">
                <template #header>
                    <div class="flex gap-3">

                        <UButton icon="i-heroicons-pencil" color="primary" size="sm" variant="solid" label="Düzenle" />
                        <UButton icon="i-heroicons-trash" color="red" size="sm" variant="solid" label="Sil"
                            :ui="{ rounded: 'rounded-lg' }" />
                    </div>
                </template>

                <div class="flex flex-col gap2">
                    <el-row class="p-2">
                        <el-col :span="5">
                            <h1 class="text-lg font-sans">Ad Soyad</h1>
                        </el-col>
                        <el-col :span="15">
                            <UInput v-model="customer.fullName" placeholder="AD-SOYAD" />
                        </el-col>

                    </el-row>

                    <el-row class="p-2">
                        <el-col :span="5">
                            <h3 class="text-lg font-sans">Email</h3>
                        </el-col>
                        <el-col :span="15">
                            <UInput v-model="customer.email" placeholder="Email" />
                        </el-col>

                    </el-row>

                    <el-row class="p-2">
                        <el-col :span="5">
                            <h3 class="text-lg font-sans">Telefon</h3>
                        </el-col>
                        <el-col :span="15">
                            <UInput v-model="customer.phone" placeholder="Telefon" />
                        </el-col>

                    </el-row>
                </div>




                <template #footer>
                    <div>
                        <UButton v-if="is_customer_data_changed" @click="saveChanges" color="primary" size="sm"
                            variant="solid" label="Değişiklikleri Kaydet" />
                    </div>
                </template>
            </UCard>
        </div>

        <div class="border border-solid border-gray-700 m-3 flex flex-col gap-2 p-3 rounded-md h-[200px]">
            <div class="flex justify-between
            ">
                <h1 class="text-lg font-sans"> {{ customer.fullName.toUpperCase() }}</h1>
                <div class="flex gap-3">

                    <UButton icon="i-heroicons-pencil" color="primary" size="sm" variant="solid" label="Düzenle" />
                    <UButton icon="i-heroicons-trash" color="red" size="sm" variant="solid" label="Sil"
                        :ui="{ rounded: 'rounded-lg' }" />
                </div>
            </div>
            <div></div>
            <div></div>

        </div>
    </div>
</template>
