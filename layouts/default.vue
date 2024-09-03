<script lang="ts" setup>
import sidebarItems from "@/static/sidebar";

</script>

<template>
  <div class="flex flex-col">
    
    <div class="flex">
      <MenuBar />
      <div class="w-full overflow-y-auto h-screen">
        <slot></slot>
      </div>
    </div>
    <UNotifications />
  </div>
</template>