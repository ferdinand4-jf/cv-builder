import { Response } from 'express'
import { prisma } from '../server'
import { generatePDF } from '../services/pdfService'
import { AuthRequest } from '../middlewares/auth'

export const createCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const {
      title,
      templateId,
      personalInfo,
      experience,
      education,
      skills,
      languages,
      certifications,
      projects,
      customSections,
      styling,
      isPublic,
    } = req.body

    // Verify template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      res.status(404).json({ message: 'Template not found' })
      return
    }

    const cv = await prisma.cV.create({
      data: {
        userId: req.user.id,
        templateId,
        title,
        personalInfo: personalInfo || {},
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        languages: languages || [],
        certifications: certifications || [],
        projects: projects || [],
        customSections: customSections || [],
        styling: styling || template.styles,
        isPublic: isPublic || false,
      },
      include: {
        template: true,
      },
    })

    res.status(201).json(cv)
  } catch (error) {
    console.error('Create CV error:', error)
    res.status(500).json({ message: 'Failed to create CV' })
  }
}

export const getCVs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const cvs = await prisma.cV.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        template: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    res.json(cvs)
  } catch (error) {
    console.error('Get CVs error:', error)
    res.status(500).json({ message: 'Failed to get CVs' })
  }
}

export const getCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { id } = req.params

    const cv = await prisma.cV.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        template: true,
      },
    })

    if (!cv) {
      res.status(404).json({ message: 'CV not found' })
      return
    }

    res.json(cv)
  } catch (error) {
    console.error('Get CV error:', error)
    res.status(500).json({ message: 'Failed to get CV' })
  }
}

export const updateCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { id } = req.params
    const updates = req.body

    const cv = await prisma.cV.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!cv) {
      res.status(404).json({ message: 'CV not found' })
      return
    }

    const updatedCV = await prisma.cV.update({
      where: { id },
      data: updates,
      include: {
        template: true,
      },
    })

    res.json(updatedCV)
  } catch (error) {
    console.error('Update CV error:', error)
    res.status(500).json({ message: 'Failed to update CV' })
  }
}

export const deleteCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { id } = req.params

    const cv = await prisma.cV.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!cv) {
      res.status(404).json({ message: 'CV not found' })
      return
    }

    await prisma.cV.delete({
      where: { id },
    })

    res.json({ message: 'CV deleted successfully' })
  } catch (error) {
    console.error('Delete CV error:', error)
    res.status(500).json({ message: 'Failed to delete CV' })
  }
}

export const generateCVPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { id } = req.params

    const cv = await prisma.cV.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        template: true,
      },
    })

    if (!cv) {
      res.status(404).json({ message: 'CV not found' })
      return
    }

    const pdfBuffer = await generatePDF(cv)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=cv-${cv.title}.pdf`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Generate PDF error:', error)
    res.status(500).json({ message: 'Failed to generate PDF' })
  }
}

export const duplicateCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { id } = req.params

    const original = await prisma.cV.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    })

    if (!original) {
      res.status(404).json({ message: 'CV not found' })
      return
    }

    // Remove id, userId, createdAt, updatedAt from original
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...cvData } = original

    const duplicated = await prisma.cV.create({
      data: {
        title: `${original.title} (Copy)`,
        userId: req.user.id,
        templateId: cvData.templateId,
        personalInfo: (cvData.personalInfo as any) || {},
        experience: (cvData.experience as any) || [],
        education: (cvData.education as any) || [],
        skills: (cvData.skills as any) || [],
        languages: (cvData.languages as any) || [],
        certifications: (cvData.certifications as any) || [],
        projects: (cvData.projects as any) || [],
        customSections: (cvData.customSections as any) || [],
        styling: (cvData.styling as any) || {},
        isPublic: cvData.isPublic || false,
      },
      include: {
        template: true,
      },
    })

    res.status(201).json(duplicated)
  } catch (error) {
    console.error('Duplicate CV error:', error)
    res.status(500).json({ message: 'Failed to duplicate CV' })
  }
}