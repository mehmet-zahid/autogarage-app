<script setup lang="ts">
import type { License } from "@/types/business"
import { getExpirationDate, verifyToken } from "@/utils/jwt"

const licenseToken = ref("")
const { getLicense, updateLicense } = await useDatabase()

const licenses = ref<License[]>([])
const license = ref<License | null>(null)
const expirationDate = ref<Date | null>(null)
const formattedExpiration = ref<string>("")

const updateInterval = 10000 // Check every minute

const checkLicenseStatus = async () => {
    licenses.value = await getLicense()
    license.value = licenses.value[0] || null
    if (license.value && license.value.token) {
        expirationDate.value = await getExpirationDate(license.value.token)
        if(!expirationDate.value) {
            formattedExpiration.value = "0 days left"
            console.log("Formatted Expiration: ", formattedExpiration.value)
            return
        }
        console.log("Expiration: ", expirationDate)
        formattedExpiration.value = calculateTimeLeft(expirationDate.value)
        console.log("Formatted Expiration: ", formattedExpiration.value)
    } else {
        formattedExpiration.value = "No expiration date"
    }
}

// Initial check
await checkLicenseStatus()

// Set up periodic checks
const intervalId = setInterval(async () => {
    await checkLicenseStatus()
}, updateInterval)

// Clear the interval when the component is unmounted
onUnmounted(() => {
    clearInterval(intervalId)
})

function calculateTimeLeft(expirationDate: Date): string {
    const today = new Date();
    const timeDiff = expirationDate.getTime() - today.getTime();

    if (timeDiff <= 0) {
        return "Expired";
    }

    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 3600)) % 24);
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));

    const daysStr = days > 0 ? `${days} gün ` : '';
    const hoursStr = hours > 0 ? `${hours} saat ` : '';
    const minutesStr = minutes > 0 ? `${minutes} dakika ` : '';
    const secondsStr = seconds > 0 ? `${seconds} saniye ` : '';

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr} kaldı`;
}

const updateLicenseHandler = async () => {
    if (!license.value) return
    // token validation
    try {
        const payload = await verifyToken(licenseToken.value)
        const updateLicenseData = {
            id: license.value.id,
            token: licenseToken.value,
            isExpired: 0,
            expiration: payload.payload.exp,
            license_type: payload.payload.license_type,
            updatedAt: new Date(),
        }
        await updateLicense(updateLicenseData)
        await checkLicenseStatus()
        useShowToast("Lisans başarıyla güncellendi", "success")
    } catch (error) {
        console.error(error)
        useShowToast("Geçersiz Lisans Tokeni", "error")
        return
    }
}
</script>

<template>
    <div class="flex flex-col gap-2 mt-4 mx-auto w-[850px] rounded-lg">
        <el-space fill wrap>
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <h1>License Information</h1>
                        <el-button class="button" text>Operation button</el-button>
                    </div>
                </template>
                <div v-if="license" class="flex flex-col gap-3 justify-center items-center">
                    <div class="flex gap-3 m-2">
                        <el-tag type="success">Token:</el-tag>
                        <el-input :model-value="license.token" style="width: 350px" autosize type="textarea" />
                    </div>
                    <el-tag type="warning">License Type: {{ license.license_type }}</el-tag>
                    <el-tag>Expiration: {{ expirationDate ? formattedExpiration : '0 day left' }}</el-tag>
                    <el-tag :type="expirationDate ? 'success' : 'danger'">{{ expirationDate ? 'Active' : 'Expired'
                        }}</el-tag>
                </div>
                <template #footer>
                    <div class="flex gap-4 items-center justify-center">
                        <el-input v-model="licenseToken" style="width: 350px" autosize type="textarea"
                            placeholder="Lisans giriniz" />
                        <el-button type="success" round @click="updateLicenseHandler">Uygula</el-button>
                    </div>
                </template>
            </el-card>
        </el-space>


    </div>
</template>