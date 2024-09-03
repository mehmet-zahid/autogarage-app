<script setup>
import { getCurrent } from "@tauri-apps/api/window";

const appWindow = getCurrent();

const minimizeWindow = () => {
  console.log("Minimize button clicked");
  appWindow.minimize().catch(console.error);
};

const toggleMaximizeWindow = async () => {
  console.log("Maximize button clicked");
  const isMaximized = await appWindow.isMaximized();
  if (isMaximized) {
    appWindow.unmaximize().catch(console.error);
  } else {
    appWindow.maximize().catch(console.error);
  }
};

const closeWindow = () => {
  console.log("Close button clicked");
  appWindow.close().catch(console.error);
};
</script>

<template>
  <div data-tauri-drag-region class="titlebar">
    <div class="titlebar-button">
      <button @click="minimizeWindow">
        <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
      </button>
    </div>
    <div class="titlebar-button" @click="toggleMaximizeWindow">
      <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />

    </div>
    <div class="titlebar-button">
      <button @click="closeWindow">
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  height: 30px;
  background: #329ea3;

  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.titlebar-button:hover {
  background: #5bbec3;
}
</style>
