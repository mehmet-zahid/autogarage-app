<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { login } = await useBackend();

const loading = ref(false);
const schema = z.object({
  name: z.string().min(4, 'Must be at least 4 characters').max(20, 'Must be at most 20 characters'),
  password: z.string().min(4, 'Must be at least 4 characters').max(20, 'Must be at most 20 characters'),
});

type Schema = z.output<typeof schema>;
const state = ref({
  name: undefined,
  password: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  let msg_handler = null;
  try {
    const r = await login(event.data.name, event.data.password);
    msg_handler = useShowToast("Giriş Başarılı, Yönlendiriliyorsunuz...", "success");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    useRouter().push({ path: "/oto/dashboard" });
    msg_handler.close();
    return;
  } catch (e) {
    console.error(e);
    useShowToast(e.message, "error");
  }
  loading.value = false;
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

const openMessage = (msg: string, type: string) => {
  ElMessage({
    showClose: true,
    duration: 5000,
    message: msg,
    type: type,
  });
};
</script>

<template>
  <div>
    <div
      class="relative items-center flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12"
    >
      <UCard class="w-full md:w-[800px] p-8">
        <template #header>
          <div class="flex gap-3">
            <h1 class="text-2xl font-semibold text-green-400">Giriş Yap</h1>
            <el-divider direction="vertical" class="text-5xl"></el-divider>
            <p class="text-gray-500">Kayıtlı Değil misiniz? <NuxtLink to="/signup" class="underline">Kaydolun</NuxtLink></p>
          </div>
          
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Kullanıcı Adı" name="name" 
          :ui="{
            label: {base: 'block font-bold text-gray-700 dark:text-green-500'}
            }">
            <UInput v-model="state.name" autocomplete="false"/>
          </UFormGroup>

          <UFormGroup label="Parola" name="password" :ui="{
            label: {base: 'block font-bold text-gray-700 dark:text-green-500'}
            }">
            <UInput v-model="state.password" type="password" autocomplete="false" />
          </UFormGroup>

          <UButton
          class="w-24 justify-center"
            color="emerald"
            variant="solid"
            type="submit"
            label="Giriş Yap"
            :loading="loading"
          />
        </UForm>

        <template #footer>
          <svg
            class="animate-bounce w-12 h-12 text-blue-500 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="scrollToTop"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></circle>
            <path d="M12 16v-8l4 4m-8 0l4-4"></path>
          </svg>
        </template>
      </UCard>
    </div>
  </div>
</template>