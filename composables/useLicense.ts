import { ref } from 'vue'
import { useFetch, useCookie } from '#app'

interface LicenseResponse {
  token: string
}

interface LicenseValidationResponse {
  valid: boolean
}

export function useLicense() {
  const licenseToken = useCookie<string | null>('license_token', { default: () => null })
  const licenseValid = ref(true)

  const generateLicense = async (user: string): Promise<void> => {
    const { data } = await useFetch<LicenseResponse>('/api/license', {
      method: 'POST',
      body: { user }
    })
    if (data.value) {
      licenseToken.value = data.value.token
    }
  }

  const checkLicense = async (): Promise<void> => {
    if (!licenseToken.value) {
      licenseValid.value = false
      return
    }
    const { data } = await useFetch<LicenseValidationResponse>('/api/license', {
      params: { token: licenseToken.value }
    })
    if (data.value) {
      licenseValid.value = data.value.valid
    }
    if (!licenseValid.value) {
      alert('Your license has expired!')
      // Optionally, clear the token and redirect to a login or registration page
      licenseToken.value = null
    }
  }

  return {
    licenseToken,
    licenseValid,
    generateLicense,
    checkLicense
  }
}
