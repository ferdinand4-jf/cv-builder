import { Response } from 'express'
import { prisma } from '../server'
import { AuthRequest } from '../middlewares/auth'
import { toUserResponse } from '../models/User'
import { hashPassword, comparePassword } from '../utils/bcrypt'

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { firstName, lastName, email } = req.body

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: req.user.id },
        },
      })

      if (existingUser) {
        res.status(400).json({ message: 'Email already taken' })
        return
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
      },
    })

    const userResponse = toUserResponse(updatedUser)
    res.json(userResponse)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password)

    if (!isValid) {
      res.status(401).json({ message: 'Current password is incorrect' })
      return
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Failed to change password' })
  }
}

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { password } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Verify password
    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      res.status(401).json({ message: 'Password is incorrect' })
      return
    }

    // Delete user (cascade will delete related data)
    await prisma.user.delete({
      where: { id: req.user.id },
    })

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ message: 'Failed to delete account' })
  }
}