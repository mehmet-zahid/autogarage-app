import { generateToken, isTokenExpired } from '~/utils/jwt'
const { getLicense, updateLicense, saveLicense } = useDatabase()

export default defineNuxtRouteMiddleware(async (to, from) => {
    const isAuthenticated = useLocalStorage("isAuthenticated", false)

    console.log(isAuthenticated)

    // Check license token expiration
    const license = await getLicense()
    console.log(license)
    if (license[0]) {
        if (!await isTokenExpired(license[0].token)) {
            console.log("License token is valid")
        } else {
            console.log("License token is expired, Please pay for a new license")
            useShowToast("Lisansınızın süresi bitmiştir. Lütfen yeni bir lisans satın alınız", "warning")
            const updateData = {
                id: license[0].id,
                isExpired: 1,
                license_type: license[0].license_type,
                token: license[0].token
            }
            await updateLicense(updateData)
            if (to.path !== '/oto/settings') {
                return navigateTo('/oto/settings')
            }


        }

    } else {
        // create a trial license for 7 days
        const payload = { license_type: "trial" }
        const token = await generateToken(payload, '7d')
        const newLicense = {
            license_type: "trial",
            token: token
        }
        await saveLicense(newLicense)
        useShowToast("Trial license created for 7 days", "success")
        console.log(token)
    }

    if (!isAuthenticated.value && to.path !== '/login') {
        return navigateTo('/login')
    }

    if (to.path === '/' || to.path === '/login') {
        return navigateTo('/oto/dashboard')
    }
})
