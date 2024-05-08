<script setup lang="ts">
const items = [
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
            <div class="flex justify-between">
                <h2 class="text-lg font-semibold">Servislerim</h2>
                <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                    <UButton color="white" trailing-icon="solar:menu-dots-linear" />
                </UDropdown>
            </div>
        </template>

        <div>
            
        </div>

        <template #footer>

        </template>
    </UCard>
</template>