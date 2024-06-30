<script setup lang="ts">
import type { UserLogin } from "~/types/business"
const username = useLocalStorage("username", "")
const passwordVisibility = ref(false)
const { getUserByName, updateUser } = useDatabase()

const user = ref<UserLogin | null>(null)
const originalUser = ref<UserLogin | null>(null)

const fetchUser = async () => {
    user.value = await getUserByName(username.value)
    originalUser.value = { ...user.value } // Store original data
    console.log("User: ", user.value)
}

// Fetch the user data on component mount
await fetchUser()

const togglePasswordVisibility = () => {
    passwordVisibility.value = !passwordVisibility.value
}

// Computed property to check if user data has changed
const hasChanges = computed(() => {
    return (
        user.value?.username !== originalUser.value?.username ||
        user.value?.password !== originalUser.value?.password
    )
})

// Function to save changes (you need to implement the actual save logic)
const saveChanges = async () => {
    
    console.log(toRaw(originalUser.value))
    console.log(toRaw(user.value))
    if (!hasChanges.value) {
        useShowToast("Değişiklik yok", "info")
        return
    }
    if (!user.value.username || !user.value.password) {
        useShowToast("Kullanıcı adı ve parola boş olamaz", "error")
        return
    }
    try {
        await updateUser(user.value)
        useShowToast("Değişiklikler kaydedildi", "success")
    } catch (error) {
        useShowToast("Bir hata oluştu", "error")
    }
}
</script>

<template>
    <div class="flex flex-col m-3 gap-5">

        <LicenseEntry />

        <el-divider />

        <el-space fill wrap class="mx-auto w-[850px] rounded-lg">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <h1>Kullanıcı Bilgileri</h1>
                        <el-button class="button" text>Basma</el-button>
                    </div>
                </template>
                <div v-if="user" class="flex flex-col gap-3 justify-center items-center m-10">
                    <div class="flex flex-col gap-3 m-2">
                        <div class="flex gap-2 items-center"><el-tag type="success">Username:</el-tag>
                            <el-input v-model="user.username" style="width: 350px" type="text" />
                        </div>
                        <el-divider/>
                        <div class="flex gap-2 items-center">
                            <el-tag type="success">Password:</el-tag>
                            <div class="flex gap-2 items-center justify-center">
                                <el-input v-model="user.password" style="width: 350px"
                                    :type="passwordVisibility ? 'text' : 'password'" placeholder="Parola boş olamaz!" />
                                <el-button @click="togglePasswordVisibility" type="success" round>{{ passwordVisibility
                    ? 'Gizle' :
                                    'Göster' }}</el-button>
                            </div>
                        </div>

                        


                    </div>
                </div>
                <template #footer>
                    <div class="flex gap-4 items-center justify-center">
                        <el-button v-if="hasChanges" type="success" round @click="saveChanges">Değişiklikleri
                            Kaydet</el-button>
                    </div>
                </template>
            </el-card>
        </el-space>

    </div>
</template>
