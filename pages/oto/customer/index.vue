<script setup lang="ts">
import type { Customer } from '~/types/business'
import { CustomerUpdateModal } from '#components'
import { Search } from '@element-plus/icons-vue'

const router = useRouter();
const isSlideOpen = ref(false)
const { getCustomers, deleteCustomer } = useDatabase();
const modal = useModal()
const customers = ref<Customer[]>([])
const searchQuery = ref('');
const callGetCustomers = async () => {
  console.log("Call get customers")
  customers.value = await getCustomers()
  console.log(toRaw(customers.value))
}

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return customers.value;
  }
  return customers.value.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.phone.includes(searchQuery.value) ||
    customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  await callGetCustomers()

  //console.log(toRaw(customers.value))
});



function onSelect(option) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    router.push(option.to);
  } else if (option.href) {
    window.open(option.href, "_blank");
  }
}
const deleteCustomerHandler = async (id) => {
  await deleteCustomer(id)
  useShowToast("Müşteri başarıyla silindi", "success")
  await callGetCustomers()
}

const openUpdateModal = (customer: Customer) => {
  console.log("Modal open function", customer)
  modal.open(CustomerUpdateModal, {
    customer: customer,
    onRefreshData: callGetCustomers
  })
}

const getDropdownItems = (customer: Customer) => [
  [{
    label: 'Güncelle',
    slot: 'update',
    icon: 'i-heroicons-pencil',
    disabled: false,
    click: () => openUpdateModal(customer)
  }], [{
    label: 'Sil',
    slot: 'delete',
    icon: 'i-heroicons-trash',
    disabled: false,
    click: async () => await deleteCustomerHandler(customer.id)
  }]
];
</script>

<template>
  <div class="m-3 flex flex-col gap-10">
    <UCard>
      <template #header>
        <div class="flex gap-3">
          <UButton icon="i-heroicons-plus" @click="isSlideOpen = true">
            Yeni Müşteri Ekle
          </UButton>
          <USlideover v-model="isSlideOpen">
            <UCard class="flex flex-col flex-1"
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <Placeholder class="h-8" />
              </template>

              <CustomerCreateForm @close-modal="isSlideOpen = false" @refresh-data="callGetCustomers" />

              <template #footer>
                <Placeholder class="h-8" />
              </template>
            </UCard>
          </USlideover>
        </div>
        <div class="mt-4 flex gap-4">
          <el-input v-model="searchQuery" style="max-width: 600px" placeholder="Müşteri Ara..."
            class="input-with-select">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </div>
      </template>
      
      <div class="grid grid-cols-3 gap-4">

        <div
          class="p-2 relative h-32 rounded-lg shadow-md flex gap-2 items-center cursor-pointer border border-solid border-gray-800 transition-all hover:border-green-400"
          v-for="customer in filteredCustomers" :key="customer.id"
          @click="onSelect({ to: `/oto/customer/${customer.id}` })">
          <div class="flex flex-col gap-2">
            <div class="font-semibold text-gray-400">{{ customer.name }}</div>
            <div v-if="customer.companyName" class="flex gap-2 justify-start">
              <Icon name="solar:buildings-2-bold" class="text-gray-500" size="20" />
              <UBadge color="primary" variant="outline">{{ customer.companyName }}</UBadge>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-500">{{ customer.phone }}</div>
            <div class="text-sm text-gray-500">{{ customer.email }}</div>
          </div>

          <UDropdown :items="getDropdownItems(customer)" :ui="{ item: { disabled: 'cursor-text select-text' } }"
            class="absolute right-1 top-1" @click.stop>
            <Icon name="heroicons-outline:dots-horizontal" class="text-green-500" size="24" />

            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>
              <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
            </template>
          </UDropdown>
        </div>

      </div>
    </UCard>
  </div>
</template>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>