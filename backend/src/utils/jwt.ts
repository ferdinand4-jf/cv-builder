import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

export const generateToken = (userId: string, email: string, role: string): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] }
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    options
  )
}

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] }
  return jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    options
  )
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET)
  } catch (error) {
    return null
  }
}

export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}