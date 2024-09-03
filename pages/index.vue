<template>
    <div class="justify-content">
      <NuxtLink class="text-gray-300 font-bold hover:underline" to="/oto">Ana sayfaya dön</NuxtLink>
    </div>
  </template>
  
  <script lang="ts" setup>
  definePageMeta({
    layout: "plain",
    middleware: "auth",
  });
  </script>