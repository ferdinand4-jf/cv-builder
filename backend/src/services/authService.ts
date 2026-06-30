import { prisma } from '../server'
import { hashPassword, comparePassword } from '../utils/bcrypt'
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { toUserResponse } from '../models/User'

export interface AuthResult {
  user: any
  token: string
  refreshToken: string
}

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  })

  // Generate tokens
  const token = generateToken(user.id, user.email, user.role)
  const refreshToken = generateRefreshToken(user.id)

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  return {
    user: toUserResponse(user),
    token,
    refreshToken,
  }
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated')
  }

  const isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  })

  // Generate tokens
  const token = generateToken(user.id, user.email, user.role)
  const refreshToken = generateRefreshToken(user.id)

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  return {
    user: toUserResponse(user),
    token,
    refreshToken,
  }
}

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  })
}

export const refreshAccessToken = async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token')
  }

  const decoded = verifyRefreshToken(refreshToken)

  if (!decoded) {
    throw new Error('Invalid refresh token')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  if (!user || !user.isActive) {
    throw new Error('User not found or inactive')
  }

  // Generate new tokens
  const newToken = generateToken(user.id, user.email, user.role)
  const newRefreshToken = generateRefreshToken(user.id)

  // Update refresh token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  return {
    token: newToken,
    refreshToken: newRefreshToken,
  }
}