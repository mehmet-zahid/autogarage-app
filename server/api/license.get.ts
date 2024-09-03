import { verifyToken } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event) as { token: string }
  const valid = verifyToken(token)
  return { valid: !!valid }
})
