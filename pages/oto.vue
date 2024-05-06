<template>
    <div class="flex flex-col justify-center overflow-hidden text-center">
    <NuxtPage />
</div>
</template>

<script lang="ts" setup>
    definePageMeta({
       middleware: ["auth"]
    })

</script>