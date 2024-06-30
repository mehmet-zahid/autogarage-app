import { jwtVerify, SignJWT } from "jose"

const privateKey = ')8|L4o66FJVS1zK%+HR0l~!)uw;XEel%'  // Replace with your own secret key
const SECRET_KEY = new TextEncoder().encode(privateKey)
interface LicensePayload {
  license_type: string,
}

export async function generateToken(payload: LicensePayload, expiresIn: string='7d'): Promise<string> {
  
  const alg = 'HS256'
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer('mzi:corp:issuer')
      .setAudience('mzi:corp:audience')
      .setExpirationTime(expiresIn)
      .sign(SECRET_KEY)
  
  return token
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const payload = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] })
    return payload
  } catch (e) {
    return null
  }
}

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const payload = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] })
    // If payload is not null and there is no error, the token is valid
    return false
  } catch (error) {
    // If jwtVerify throws an error, the token is either invalid or expired
    console.error('Token verification error:', error)
    return true
  }
}

export function calculateDaysLeft(expirationDate: string): string {
  const today = new Date()
  const expiration = new Date(expirationDate)
  const timeDiff = expiration.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return `${daysDiff} days left`
}

export async function getExpirationDate(token: string): Promise<any> {
  try {
    const payload = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] })
    console.log('Token payload:', payload.payload)
    if (payload && typeof payload.payload.exp === 'number') {
      const expirationDate = new Date(payload.payload.exp * 1000) // Convert Unix timestamp to milliseconds
      console.log('Token expiration date:', expirationDate)
      
      return expirationDate
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
