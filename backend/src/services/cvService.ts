import { prisma } from '../server'
import { CV, CVCreateInput, CVUpdateInput } from '../models/CV'

export const createCV = async (userId: string, data: CVCreateInput): Promise<CV> => {
  // Verify template exists
  const template = await prisma.template.findUnique({
    where: { id: data.templateId },
  })

  if (!template) {
    throw new Error('Template not found')
  }

  const cvData: any = {
    ...data,
    userId,
    styling: data.styling || template.styles,
  }

  return await prisma.cV.create({
    data: cvData,
    include: {
      template: true,
    },
  }) as CV
}

export const getCVs = async (userId: string): Promise<CV[]> => {
  return await prisma.cV.findMany({
    where: { userId },
    include: {
      template: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  }) as CV[]
}

export const getCV = async (id: string, userId: string): Promise<CV> => {
  const cv = await prisma.cV.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      template: true,
    },
  })

  if (!cv) {
    throw new Error('CV not found')
  }

  return cv as CV
}

export const updateCV = async (
  id: string,
  userId: string,
  data: CVUpdateInput
): Promise<CV> => {
  const cv = await prisma.cV.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!cv) {
    throw new Error('CV not found')
  }

  return await prisma.cV.update({
    where: { id },
    data,
    include: {
      template: true,
    },
  }) as CV
}

export const deleteCV = async (id: string, userId: string): Promise<void> => {
  const cv = await prisma.cV.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!cv) {
    throw new Error('CV not found')
  }

  await prisma.cV.delete({
    where: { id },
  })
}

export const duplicateCV = async (id: string, userId: string): Promise<CV> => {
  const original = await prisma.cV.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!original) {
    throw new Error('CV not found')
  }

  const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...cvData } = original

  const duplicateData: any = {
    ...cvData,
    title: `${original.title} (Copy)`,
    userId,
  }

  return await prisma.cV.create({
    data: duplicateData,
    include: {
      template: true,
    },
  }) as CV
}