<script setup lang="ts">
import type { Service} from '~/types/business'
const router = useRouter();
const isModalOpen = ref(false)
const { getAllServices } = useDatabase();

const servicesData = ref([])
servicesData.value = await getAllServices();

const commandPaletteRef = ref();

const services = computed(() =>
servicesData.value.map((Service: Service) => ({
    id: Service.id.toString(),
    label: Service.vehicleIds,
    to: `/oto/Service/${Service.id}`,
    //href: `/oto/Service/${Service.id}`,
    icon: "i-heroicons-user",
  }))
);

const refreshData = async () => {
  servicesData.value = await getAllServices();
}
const actions = [
  // {
  //   id: "new-Service",
  //   label: "Yeni Müşteri Ekle",
  //   icon: "i-heroicons-document-plus",
  //   click: () => toast.add({
  //     title: "Success",
  //     icon: "i-heroicons-check-circle",
  //     description: "Müşteri Kaydedildi",
  //     status: "success",
  //     duration: 3000,
  //     isClosable: true,
  //     position: "top-right",
  //   }),
  //   shortcuts: ["⌘", "N"],
  // },
  // {
  //   id: "new-folder",
  //   label: "Add new folder",
  //   icon: "i-heroicons-folder-plus",
  //   click: () => toast.add({ title: "New folder added!" }),
  //   shortcuts: ["⌘", "F"],
  // },
  // {
  //   id: "hashtag",
  //   label: "Add hashtag",
  //   icon: "i-heroicons-hashtag",
  //   click: () => toast.add({ title: "Hashtag added!" }),
  //   shortcuts: ["⌘", "H"],
  // },
  // {
  //   id: "label",
  //   label: "Add label",
  //   icon: "i-heroicons-tag",
  //   click: () => toast.add({ title: "Label added!" }),
  //   shortcuts: ["⌘", "L"],
  // },
];

const groups = computed(() =>
  [
    commandPaletteRef.value?.query
      ? {
          key: "services",
          commands: services.value,
        }
      : {
          key: "recent",
          label: "Recent searches",
          commands: services.value.slice(0, 5),
        },
    {
      key: "actions",
      commands: actions,
    },
  ].filter(Boolean)
);

function onSelect(option) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    router.push(option.to);
  } else if (option.href) {
    window.open(option.href, "_blank");
  }
}
</script>

<template>
  <div class="m-3 flex flex-col gap-10">
    <UCard>
      <template #header>
        <div class="flex gap-3">
          <h1 class="text-lg font-semibold">Servis İşlemleri</h1>
          <UButton
            icon="i-heroicons-plus"
            @click="isModalOpen = true"
          >
            Yeni Servis Ekle
          </UButton>
          <div class="p-4">
          <UModal v-model="isModalOpen">
            <UCard
              :ui="{
                
                padding: 'p-8',
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Servis Kaydı
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isModalOpen = false" />
          </div>
              </template>

              <ServiceCreateForm @close-modal="isModalOpen = false" @refresh-data="refreshData" />

              <template #footer>
                <Placeholder class="h-8" />
              </template>
            </UCard>
          </UModal>
        </div>
        </div>
      </template>
      <UCommandPalette
        ref="commandPaletteRef"
        placeholder="Müşteri ara"
        :groups="groups"
        :autoselect="false"
        @update:model-value="onSelect"
      />
      <template #footer> </template>
    </UCard>

  </div>
</template>