import { Response } from 'express'
import { prisma } from '../../src/server'
import { AuthRequest } from '../middlewares/auth'
import { toUserResponse } from '../models/User'
import { hashPassword } from '../utils/bcrypt'

// User Management
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    const userResponses = users.map(toUserResponse)

    res.json({
      data: userResponses,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Failed to get users' })
  }
}

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        cvs: {
          include: {
            template: true,
          },
        },
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const userResponse = toUserResponse(user)
    res.json({ ...userResponse, cvs: user.cvs })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Failed to get user' })
  }
}

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, role, isActive, password } = req.body

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      })

      if (existingUser) {
        res.status(400).json({ message: 'Email already taken' })
        return
      }
    }

    const updateData: any = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      role: role || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
    }

    if (password) {
      updateData.password = await hashPassword(password)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    const userResponse = toUserResponse(updatedUser)
    res.json(userResponse)
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Failed to update user' })
  }
}

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    // Prevent admin from deleting themselves
    if (!req.user || id === req.user.id) {
      res.status(400).json({ message: 'Cannot delete your own account' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    await prisma.user.delete({
      where: { id },
    })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Failed to delete user' })
  }
}

// Template Management
export const createTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, category, thumbnail, styles, isActive, isPremium } = req.body

    const existingTemplate = await prisma.template.findUnique({
      where: { name },
    })

    if (existingTemplate) {
      res.status(400).json({ message: 'Template with this name already exists' })
      return
    }

    const template = await prisma.template.create({
      data: {
        name,
        description,
        category,
        thumbnail,
        styles,
        isActive: isActive !== undefined ? isActive : true,
        isPremium: isPremium !== undefined ? isPremium : false,
      },
    })

    res.status(201).json(template)
  } catch (error) {
    console.error('Create template error:', error)
    res.status(500).json({ message: 'Failed to create template' })
  }
}

export const updateTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, description, category, thumbnail, styles, isActive, isPremium } = req.body

    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      res.status(404).json({ message: 'Template not found' })
      return
    }

    // Check if name is already taken by another template
    if (name && name !== template.name) {
      const existingTemplate = await prisma.template.findUnique({
        where: { name },
      })

      if (existingTemplate) {
        res.status(400).json({ message: 'Template with this name already exists' })
        return
      }
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        category: category || undefined,
        thumbnail: thumbnail || undefined,
        styles: styles || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        isPremium: isPremium !== undefined ? isPremium : undefined,
      },
    })

    res.json(updatedTemplate)
  } catch (error) {
    console.error('Update template error:', error)
    res.status(500).json({ message: 'Failed to update template' })
  }
}

export const deleteTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      res.status(404).json({ message: 'Template not found' })
      return
    }

    await prisma.template.delete({
      where: { id },
    })

    res.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({ message: 'Failed to delete template' })
  }
}

// Statistics
export const getStatistics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalCVs,
      totalTemplates,
      cvsByTemplate,
      usersByMonth,
      cvsByMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.cV.count(),
      prisma.template.count(),
      prisma.cV.groupBy({
        by: ['templateId'],
        _count: true,
        orderBy: {
          _count: {
            templateId: 'desc',
          },
        },
      }),
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
          COUNT(*) as count
        FROM "User"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      `,
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
          COUNT(*) as count
        FROM "CV"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      `,
    ])

    // Get template names for cvsByTemplate
    const templateIds = cvsByTemplate.map((item: { templateId: any }) => item.templateId)
    const templates = await prisma.template.findMany({
      where: {
        id: { in: templateIds },
      },
      select: {
        id: true,
        name: true,
      },
    })

    const templateMap = new Map(templates.map((t: { id: any; name: any }) => [t.id, t.name]))

    const cvsByTemplateWithNames = cvsByTemplate.map((item: { templateId: unknown; _count: any }) => ({
      templateId: item.templateId,
      templateName: templateMap.get(item.templateId) || 'Unknown',
      count: item._count,
    }))

    res.json({
      totalUsers,
      activeUsers,
      totalCVs,
      totalTemplates,
      cvsByTemplate: cvsByTemplateWithNames,
      usersByMonth: usersByMonth as any[],
      cvsByMonth: cvsByMonth as any[],
    })
  } catch (error) {
    console.error('Get statistics error:', error)
    res.status(500).json({ message: 'Failed to get statistics' })
  }
}