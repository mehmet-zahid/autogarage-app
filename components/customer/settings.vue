<script setup lang="ts">

import type { Customer } from '~/types/business';

const props = defineProps<{
    customer: Customer;
}>();

const { updateCustomer } = useDatabase();

const customer = ref<Customer>(props.customer);

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

</script>
<template>
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
</template>