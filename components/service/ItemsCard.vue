<script setup lang="ts">

const props = defineProps<{
  customer_name: string
  customer_reg_date: string
}>()

const dateObject = new Date(props.customer_reg_date)
// Get the year, month, and day
const year = dateObject.getFullYear();
// getMonth() returns a zero-based index, so we add 1 to get the actual month number
const month = dateObject.getMonth() + 1;
const day = dateObject.getDate();

// Format the date as "YYYY-MM-DD"
const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

const dropdownItems = [
  [{
    label: 'Action x',
  }], [{
    label: 'Servisi Editle',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D']
  }]
]
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between gap-3 min-w-[400px]">
        <div
          class="flex p-2 gap-1 border border-solid border-gray-700 font-serif cursor-pointer rounded-full justify-center items-center hover:opacity-80 shadow-lg hover:bg-[#054f31] ">
          <span>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <path fill="#34A853" d="M16 16v14h4V20z"></path>
              <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
              <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
              <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
              <path fill="none" d="M0 0h36v36H0z"></path>
            </svg>
          </span>
          <span class="text-sm font-light justify-center">Servis Oluştur</span>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-lg text-gray-300 border border-solid border-[#00214f] rounded-lg p-2"> {{ props.customer_name.toLocaleUpperCase() }}</p>
          
        </div>
        
        <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
          <UButton trailing-icon="i-heroicons-bars-3" variant="ghost" size="lg" />
        </UDropdown>
      </div>
    </template>

    <div class="h-96">
      </div>

    <template #footer>
      <div class="h-32"></div>
    </template>
  </UCard>
</template>