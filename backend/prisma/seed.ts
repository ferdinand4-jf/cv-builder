// prisma/seed.ts
/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // 1. Créer les utilisateurs
    console.log('👤 Creating users...')
    
    const adminPassword = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@cvbuilder.com' },
      update: {},
      create: {
        email: 'admin@cvbuilder.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
      },
    })
    console.log(`✅ Admin user: ${admin.email} (ID: ${admin.id})`)

    const userPassword = await bcrypt.hash('User123!', 10)
    const user = await prisma.user.upsert({
      where: { email: 'user@cvbuilder.com' },
      update: {},
      create: {
        email: 'user@cvbuilder.com',
        password: userPassword,
        firstName: 'Demo',
        lastName: 'User',
        role: 'USER',
        isActive: true,
      },
    })
    console.log(`✅ Demo user: ${user.email} (ID: ${user.id})`)

    // 2. Créer les templates avec les catégories valides
    console.log('📄 Creating templates...')
    
    const templates = [
      {
        name: 'Modern Professional',
        description: 'A clean, modern template with a professional look. Perfect for corporate roles.',
        category: 'MODERN', // ✅ Valide
        thumbnail: '/templates/modern.png',
        styles: {
          primaryColor: '#3b82f6',
          secondaryColor: '#1e293b',
          fontFamily: 'Inter',
          fontSize: 14,
          spacing: 'normal',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects'],
        },
        isActive: true,
        isPremium: false,
      },
      {
        name: 'Classic Elegance',
        description: 'A timeless classic design that never goes out of style. Perfect for traditional industries.',
        category: 'CLASSIC', // ✅ Valide
        thumbnail: '/templates/classic.png',
        styles: {
          primaryColor: '#1e293b',
          secondaryColor: '#475569',
          fontFamily: 'Georgia',
          fontSize: 14,
          spacing: 'relaxed',
          sections: ['personal', 'summary', 'experience', 'education', 'skills'],
        },
        isActive: true,
        isPremium: false,
      },
      {
        name: 'ATS Optimized',
        description: 'Specially designed to pass ATS (Applicant Tracking Systems) with ease.',
        category: 'ATS_FRIENDLY', // ✅ Valide
        thumbnail: '/templates/ats.png',
        styles: {
          primaryColor: '#000000',
          secondaryColor: '#333333',
          fontFamily: 'Arial',
          fontSize: 12,
          spacing: 'compact',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'certifications'],
        },
        isActive: true,
        isPremium: false,
      },
      {
        name: 'Creative Portfolio',
        description: 'A bold, creative design that stands out. Perfect for creative roles and portfolios.',
        category: 'CREATIVE', // ✅ Valide
        thumbnail: '/templates/creative.png',
        styles: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#1e1b4b',
          fontFamily: 'Montserrat',
          fontSize: 14,
          spacing: 'relaxed',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
        },
        isActive: true,
        isPremium: true,
      },
      {
        name: 'Executive Premium',
        description: 'Premium executive template with elegant design. Perfect for C-level positions.',
        category: 'CLASSIC', // ✅ Valide - Utilisation de CLASSIC
        thumbnail: '/templates/executive.png',
        styles: {
          primaryColor: '#0f172a',
          secondaryColor: '#334155',
          fontFamily: 'Playfair Display',
          fontSize: 14,
          spacing: 'relaxed',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects'],
        },
        isActive: true,
        isPremium: true,
      },
      {
        name: 'Minimalist Clean',
        description: 'Simple and clean design focusing on content clarity. Perfect for modern professionals.',
        category: 'MODERN', // ✅ Valide - Utilisation de MODERN
        thumbnail: '/templates/minimalist.png',
        styles: {
          primaryColor: '#000000',
          secondaryColor: '#4a4a4a',
          fontFamily: 'Helvetica',
          fontSize: 13,
          spacing: 'normal',
          sections: ['personal', 'summary', 'experience', 'education', 'skills'],
        },
        isActive: true,
        isPremium: false,
      },
      {
        name: 'Tech Startup',
        description: 'Modern template designed for tech professionals and startups.',
        category: 'MODERN', // ✅ Valide
        thumbnail: '/templates/tech.png',
        styles: {
          primaryColor: '#06b6d4',
          secondaryColor: '#0f172a',
          fontFamily: 'Inter',
          fontSize: 14,
          spacing: 'normal',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'projects'],
        },
        isActive: true,
        isPremium: false,
      },
      {
        name: 'Academic CV',
        description: 'Professional template for academic and research positions.',
        category: 'CLASSIC', // ✅ Valide
        thumbnail: '/templates/academic.png',
        styles: {
          primaryColor: '#1e293b',
          secondaryColor: '#475569',
          fontFamily: 'Times New Roman',
          fontSize: 12,
          spacing: 'normal',
          sections: ['personal', 'summary', 'education', 'experience', 'publications', 'skills', 'certifications'],
        },
        isActive: true,
        isPremium: false,
      },
    ]

    let createdCount = 0
    for (const templateData of templates) {
      try {
        const template = await prisma.template.upsert({
          where: { name: templateData.name },
          update: {
            name: templateData.name,
            description: templateData.description,
            // Cast category to any to satisfy Prisma enum update typing
            category: (templateData.category as any),
            thumbnail: templateData.thumbnail,
            styles: templateData.styles,
            isActive: templateData.isActive,
            isPremium: templateData.isPremium,
            updatedAt: new Date(),
          },
          create: {
            ...templateData,
            // Cast category to any to satisfy Prisma enum create typing
            category: (templateData.category as any),
          },
        })
        console.log(`✅ Template: ${template.name} (${template.category})`)
        createdCount++
      } catch (error) {
        console.error(`❌ Failed to create template ${templateData.name}:`, error)
      }
    }

    // 3. Vérifier le nombre total de templates
    const totalTemplates = await prisma.template.count()
    console.log(`📊 Total templates: ${totalTemplates}`)

    console.log('🎉 Seeding completed successfully!')
    console.log('\n🔑 Login credentials:')
    console.log(`   Admin: admin@cvbuilder.com / Admin123!`)
    console.log(`   User:  user@cvbuilder.com / User123!`)
    console.log('\n📄 Templates created:')
    templates.forEach(t => {
      console.log(`   - ${t.name} (${t.category})${t.isPremium ? ' ⭐' : ''}`)
    })

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })