<template>
  <div class="relative">
    <Icon
      :class="{
        'text-gray-500': isCollapsed,
        'text-gray-300': !isCollapsed,
      }"
      class="rounded-full border border-gray-500 border-solid cursor-pointer hover:bg-neutral-700 absolute middle-right z-10"
      size="25"
      :color="isCollapsed ? 'gray' : 'green'"
      :name="
        !isCollapsed
          ? 'i-heroicons:chevron-double-left'
          : 'i-heroicons:chevron-double-right'
      "
      @click="toggleCollapse"
    />
    <el-tooltip
        class="box-item"
        effect="dark"
        :content="isCollapsed ? 'Genişlet' : 'Daralt'"
        placement="right-end"
      >
    <button
      class="ml-3 h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary"
        @click="toggleCollapse"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        class="icon-xl-heavy"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
</el-tooltip>
    <aside>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="isCollapsed"
        @open="handleOpen"
        @close="handleClose"
      >
        <NuxtLink to="/oto/dashboard"
          ><el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item></NuxtLink
        >

        <el-menu-item index="2" disabled>
          <el-icon><Management /></el-icon>
          <template #title>Yönetim(Yakında)</template>
        </el-menu-item>

        <NuxtLink to="/oto/customer">
          <el-menu-item index="3">
            <el-icon><Avatar /></el-icon>
            <template #title>Müşteriler</template>
          </el-menu-item></NuxtLink
        >

        <NuxtLink to="/oto/settings"
          ><el-menu-item index="4">
            <el-icon><User /></el-icon>
            <template #title>Kullanıcı</template>
          </el-menu-item></NuxtLink
        >

        <el-sub-menu index="5">
          <template #title>
            <el-icon><Checked /></el-icon>
            <span>Servis Yönetimi</span>
          </template>
          <NuxtLink to="/oto/service">
            <el-menu-item index="5-1">Servis Görüntüleme</el-menu-item>
          </NuxtLink>
          <NuxtLink to="/oto/service/optype">
            <el-menu-item index="5-2">Servis Tipi</el-menu-item>
          </NuxtLink>
        </el-sub-menu>
        

        <el-menu-item index="6" class="mt-20" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            <template #title>Çıkış Yap</template>
          </el-menu-item>
        
        
      </el-menu>

      
    </aside>
  </div>
</template>

<script setup lang="ts">
import {
  Management,
  Menu as IconMenu,
  User,
  Avatar,
  SwitchButton,
  Checked
} from "@element-plus/icons-vue";

const isCollapsed = useLocalStorage("isCollapsed", false);
const defaultActive = ref("2");

const { logout } = await useBackend();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  margin-top: 10px;
  width: 225px;
  min-height: 400px;
}

.middle-right {
  top: 30%;
  right: -10px;
}

.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
