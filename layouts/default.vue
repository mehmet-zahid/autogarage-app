<script lang="ts" setup>
import sidebarItems from "@/static/sidebar";
import type { SidebarItem } from "@/types/sidebar";

const sidebarMenuItems = ref<SidebarItem[]>(sidebarItems);
</script>

<template>
  <div class="flex flex-col">
    
    <div class="flex">
      <Sidebar :sidebar-items="sidebarMenuItems" />
      <div class="w-full overflow-y-auto h-screen">
        <slot></slot>
      </div>
    </div>
    <UNotifications />
  </div>
</template>