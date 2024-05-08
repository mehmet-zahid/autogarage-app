<script setup lang="ts">
import type { SidebarItem } from "@/types/sidebar";

const user = useUser();


const props = defineProps<{
  sidebarItems: SidebarItem[];
}>();

const expanded = useLocalStorage("sidebarExpanded", true);

const setExpanded = () => {
  expanded.value = !expanded.value;
};

const setActiveSidebarItem = (itemID: number) => {
  props.sidebarItems.forEach((item: SidebarItem) => {
    item.active = item.id === itemID;
  });
};


const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "m";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return number.toString();
  }
};

onMounted(() => {
  props.sidebarItems.forEach((item: SidebarItem) => {
    item.active = item.to === useRoute().path;
  });
});

//<Icon v-if="expanded" class="w-6 h-6 text-gray-500" name="heroicons:chevron-double-left" size="25"></Icon>
//<Icon v-else class="w-6 h-6 text-gray-500" name="heroicons:chevron-double-right" size="25"></Icon>
</script>

<template>
  <aside class="h-100">
    <nav class="h-full flex flex-col border-r border-[rgb(45,50,66)] shadow-sm">
      <div class="p4 pb-2 flex justify-between items-center relative">
       
        <div class="mt-3" :class="{ 'w-32': expanded, 'w-0': !expanded }">
          <img
            src="@/assets/Discovery_DotsIcon.gif"
            alt="Discovery_DotsIcon"
            class="w-[30px] h-[30px] overflow-hidden transition-all rounded-full ease-in-out duration-500"
          />
        </div>

        <!--Icon
          :class="{
            'text-gray-500': expanded,
            'text-gray-300': !expanded,
          }"
          class="rounded-full border border-green-300 border-solid cursor-pointer hover:bg-green-200"
          size="45"
          :name="expanded ? 'i-heroicons:chevron-double-left' : 'i-heroicons:chevron-double-right'"
          @click="setExpanded"
        /-->
        <button
          class="p-1.5 rounded-full hover:opacity-50 top-0 -right-6 absolute z-999"
          @click="setExpanded"
        >
          <!-- Left Arrow-->
          <svg
            v-if="expanded"
            class="w-10 h-12 text-blue-500 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></circle>
            <path d="M10 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
          <!-- Right Arrow-->
          <svg
            v-else
            class="w-10 h-12 text-blue-500 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></circle>
            <path d="M14 5l7 7-7 7m-8-14l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <ul class="flex-1 px-3 mt-9">
        <li
          v-for="item in props.sidebarItems"
          :key="item.id"
          class="relative flex group"
        >
          <NuxtLink
            :to="item.to"
            :class="{
              'bg-gradient-to-tr from-green-200 to-green-500 hover:text-black':
                item.active && expanded,
              'hover:bg-blue-950 text-gray-300': !item.active,
            }"
            class="relative flex items-center py-2 px-3 my-1 text-sm rounded-md cursor-pointer transition-colors group"
            @click="setActiveSidebarItem(item.id)"
          >
            <!-- Item Icon -->
            <Icon
              :name="item.icon"
              :color="item.active ? 'green' : 'gray'"
              class="w-6 h-6"
            ></Icon>

            <!-- Item Title -->
            <span
              class="text-sm overflow-hidden transition-all font-serif"
              :class="{
                'w-32 ml-2': expanded,
                'w-0 h-8': !expanded,
                'text-black': item.active,
              }"
            >
              {{ item.title }}
            </span>
          </NuxtLink>
          <!-- Popover -->

          <div
            v-if="!expanded"
            class="absolute left-full text-lg rounded-md bg-[#01184D] px-2 py-1 ml-4 invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 overflow-auto z-10"
          >
            {{ item.title }}
          </div>
        </li>

        <hr class="border-gray-200 my-2" />

        <div
          class="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer hover:bg-gray-700 text-gray-600 hover:text-red-500 transition-colors"
          @click="useUser().logout"
        >
          <Icon name="solar:logout-broken" class="w-6 h-6"></Icon>
          <span
            class="text-sm font-semibold overflow-hidden"
            :class="{ 'w-44 ml-2': expanded, 'w-0': !expanded }"
          >
            Logout
          </span>
        </div>
      </ul>

      <div class="border-t flex p-3 shadow-indigo-400">
        <img
          src="https://ui-avatars.com/api/?backround=c7d2fe&color=3720a3&bold=true"
          class="w-10 h-10 rounded-md"
          alt=""
        />

        <div
          class="flex justify-between items-center overflow-hidden transition-all"
          :class="{ 'w-52 ml-3': expanded, 'w-0': !expanded }"
        >
          <div >
            <h4 class="text-sm text-gray-300 font-semibold"> {{ user ? user.username: 'Unknown' }}</h4>
          </div>
          <UserDropdown />
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animated-image {
  animation: shake 5s infinite;
}
</style>