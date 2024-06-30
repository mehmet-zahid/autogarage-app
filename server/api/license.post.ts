import { generateToken } from '../../utils/jwt'

interface LicenseRequest {
  license_type: string
}

export default defineEventHandler(async (event) => {
  const body: LicenseRequest = await readBody(event)
  const payload = { license_type: body.license_type }  // Add additional payload data if needed
  const token = generateToken(payload)
  return { token }
})
