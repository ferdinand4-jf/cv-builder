'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus, Trash2, MoveUp, MoveDown, User, Briefcase, GraduationCap, Sparkles, Palette } from 'lucide-react'
import { useTemplateStore } from '../../store/templateStore'
import { CV } from '../../types'

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  summary: z.string().max(500, 'Le résumé doit faire moins de 500 caractères').optional(),
})

const experienceSchema = z.object({
  company: z.string().min(1, "L'entreprise est requise"),
  position: z.string().min(1, 'Le poste est requis'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, 'La description est requise'),
  achievements: z.array(z.string()).optional(),
})

const educationSchema = z.object({
  institution: z.string().min(1, "L'établissement est requis"),
  degree: z.string().min(1, 'Le diplôme est requis'),
  field: z.string().min(1, "Le domaine d'étude est requis"),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
})

const skillSchema = z.object({
  name: z.string().min(1, 'Le nom de la compétence est requis'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
})

const languageSchema = z.object({
  name: z.string().min(1, 'La langue est requise'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
})

const certificationSchema = z.object({
  name: z.string().min(1, 'Le nom de la certification est requis'),
  issuer: z.string().min(1, "L'organisme est requis"),
  date: z.string().min(1, 'La date est requise'),
})

const projectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis'),
  description: z.string().min(1, 'La description est requise'),
  link: z.string().url().optional().or(z.literal('')),
})

const cvSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  templateId: z.string().min(1, 'Le modèle est requis'),
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  certifications: z.array(certificationSchema),
  projects: z.array(projectSchema),
  styling: z.object({
    primaryColor: z.string().default('#E11D2E'),
    secondaryColor: z.string().default('#101828'),
    fontFamily: z.string().default('Inter'),
    fontSize: z.string().default('14'),
  }),
})

type CVFormData = z.infer<typeof cvSchema>

interface CVBuilderProps {
  initialData?: Partial<CV>
  onSave: (data: any) => Promise<void>
}

const tabs = [
  { value: 'personal', label: 'Profil', icon: User },
  { value: 'experience', label: 'Expérience', icon: Briefcase },
  { value: 'education', label: 'Formation', icon: GraduationCap },
  { value: 'skills', label: 'Compétences', icon: Sparkles },
]

export function CVBuilder({ initialData, onSave }: CVBuilderProps) {
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const { templates, loading: templatesLoading, fetchTemplates } = useTemplateStore()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      title: initialData?.title || '',
      templateId: initialData?.templateId || '',
      personalInfo: {
        firstName: initialData?.personalInfo?.firstName || '',
        lastName: initialData?.personalInfo?.lastName || '',
        email: initialData?.personalInfo?.email || '',
        phone: initialData?.personalInfo?.phone || '',
        address: initialData?.personalInfo?.address || '',
        linkedin: initialData?.personalInfo?.linkedin || '',
        portfolio: initialData?.personalInfo?.portfolio || '',
        summary: initialData?.personalInfo?.summary || '',
      },
      experience: initialData?.experience || [],
      education: initialData?.education || [],
      skills: initialData?.skills || [],
      languages: initialData?.languages || [],
      certifications: initialData?.certifications || [],
      projects: initialData?.projects || [],
      styling: {
        primaryColor: initialData?.styling?.primaryColor || '#E11D2E',
        secondaryColor: initialData?.styling?.secondaryColor || '#101828',
        fontFamily: initialData?.styling?.fontFamily || 'Inter',
        fontSize: initialData?.styling?.fontSize || '14',
      },
    },
  })

  const { fields: experienceFields, append: appendExperience, remove: removeExperience, move: moveExperience } =
    useFieldArray({ control, name: 'experience' })
  const { fields: educationFields, append: appendEducation, remove: removeEducation, move: moveEducation } =
    useFieldArray({ control, name: 'education' })
  const { fields: skillFields, append: appendSkill, remove: removeSkill } =
    useFieldArray({ control, name: 'skills' })
  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } =
    useFieldArray({ control, name: 'languages' })
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } =
    useFieldArray({ control, name: 'certifications' })
  const { fields: projectFields, append: appendProject, remove: removeProject } =
    useFieldArray({ control, name: 'projects' })

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const onSubmit = async (data: CVFormData) => {
    try {
      setIsLoading(true)
      await onSave(data)
    } catch (error) {
      console.error('Échec de l\'enregistrement du CV:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 bg-canvas/95 backdrop-blur py-2 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">
              {initialData?.id ? 'Modifier le CV' : 'Créer un CV'}
            </h1>
            <p className="text-sm text-ink-soft font-mono">
              {initialData?.id ? 'Toute modification est enregistrée à la sauvegarde.' : 'Étape par étape, ça avance vite.'}
            </p>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-redpen hover:bg-redpen-dark text-white w-full sm:w-auto"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer le CV'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full bg-white border border-border rounded-lg p-1 gap-1 h-auto">
                {tabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex items-center gap-1.5 text-xs sm:text-sm py-2 data-[state=active]:bg-redpen-light data-[state=active]:text-redpen-dark"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <Card className="border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Titre du CV</Label>
                        <Input id="title" {...register('title')} placeholder="Ex. CV Développeur DevOps" />
                        {errors.title && <p className="text-redpen text-sm mt-1">{errors.title.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="templateId">Modèle</Label>
                        <Select
                          onValueChange={(value) => setValue('templateId', value)}
                          defaultValue={initialData?.templateId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.filter(t => t.isActive).map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name} {template.isPremium && '⭐'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.templateId && <p className="text-redpen text-sm mt-1">{errors.templateId.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Prénom</Label>
                        <Input {...register('personalInfo.firstName')} />
                        {errors.personalInfo?.firstName && (
                          <p className="text-redpen text-sm mt-1">{errors.personalInfo.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Nom</Label>
                        <Input {...register('personalInfo.lastName')} />
                        {errors.personalInfo?.lastName && (
                          <p className="text-redpen text-sm mt-1">{errors.personalInfo.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input type="email" {...register('personalInfo.email')} />
                        {errors.personalInfo?.email && (
                          <p className="text-redpen text-sm mt-1">{errors.personalInfo.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Téléphone</Label>
                        <Input {...register('personalInfo.phone')} />
                      </div>
                    </div>

                    <div>
                      <Label>Adresse</Label>
                      <Input {...register('personalInfo.address')} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>LinkedIn</Label>
                        <Input {...register('personalInfo.linkedin')} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div>
                        <Label>Portfolio</Label>
                        <Input {...register('personalInfo.portfolio')} placeholder="https://..." />
                      </div>
                    </div>

                    <div>
                      <Label>Résumé professionnel</Label>
                      <Textarea {...register('personalInfo.summary')} rows={4} placeholder="2 à 3 phrases qui donnent envie de lire la suite." />
                      {errors.personalInfo?.summary && (
                        <p className="text-redpen text-sm mt-1">{errors.personalInfo.summary.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                {experienceFields.map((field, index) => (
                  <Card key={field.id} className="border-border">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display font-semibold text-ink">Expérience #{index + 1}</h3>
                        <div className="flex gap-1">
                          <Button type="button" variant="ghost" size="sm" onClick={() => moveExperience(index, index - 1)} disabled={index === 0}>
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => moveExperience(index, index + 1)} disabled={index === experienceFields.length - 1}>
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeExperience(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Entreprise</Label>
                          <Input {...register(`experience.${index}.company`)} />
                        </div>
                        <div>
                          <Label>Poste</Label>
                          <Input {...register(`experience.${index}.position`)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <Input type="date" {...register(`experience.${index}.startDate`)} />
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <Input type="date" {...register(`experience.${index}.endDate`)} />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea {...register(`experience.${index}.description`)} rows={3} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen"
                  onClick={() => appendExperience({
                    company: '', position: '', startDate: '', endDate: '', current: false, description: ''
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une expérience
                </Button>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                {educationFields.map((field, index) => (
                  <Card key={field.id} className="border-border">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display font-semibold text-ink">Formation #{index + 1}</h3>
                        <div className="flex gap-1">
                          <Button type="button" variant="ghost" size="sm" onClick={() => moveEducation(index, index - 1)} disabled={index === 0}>
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => moveEducation(index, index + 1)} disabled={index === educationFields.length - 1}>
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeEducation(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Établissement</Label>
                          <Input {...register(`education.${index}.institution`)} />
                        </div>
                        <div>
                          <Label>Diplôme</Label>
                          <Input {...register(`education.${index}.degree`)} />
                        </div>
                      </div>
                      <div>
                        <Label>Domaine d'étude</Label>
                        <Input {...register(`education.${index}.field`)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <Input type="date" {...register(`education.${index}.startDate`)} />
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <Input type="date" {...register(`education.${index}.endDate`)} />
                        </div>
                      </div>
                      <div>
                        <Label>Moyenne / GPA (optionnel)</Label>
                        <Input {...register(`education.${index}.gpa`)} placeholder="3.8" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen"
                  onClick={() => appendEducation({
                    institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: ''
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une formation
                </Button>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6 mt-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-display">Compétences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input {...register(`skills.${index}.name`)} placeholder="Nom de la compétence" className="flex-1" />
                        <Select onValueChange={(value) => setValue(`skills.${index}.level`, value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeSkill(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="mt-2 border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen" onClick={() => appendSkill({ name: '', level: 'intermediate' })}>
                      <Plus className="h-4 w-4 mr-2" /> Ajouter une compétence
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-display">Langues</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {languageFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input {...register(`languages.${index}.name`)} placeholder="Langue" className="flex-1" />
                        <Select onValueChange={(value) => setValue(`languages.${index}.level`, value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                            <SelectItem value="native">Langue maternelle</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeLanguage(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="mt-2 border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen" onClick={() => appendLanguage({ name: '', level: 'intermediate' })}>
                      <Plus className="h-4 w-4 mr-2" /> Ajouter une langue
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-display">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {certificationFields.map((field, index) => (
                      <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-canvas/50">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm text-ink-soft font-mono">Certification #{index + 1}</h4>
                          <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeCertification(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Nom</Label>
                            <Input {...register(`certifications.${index}.name`)} />
                          </div>
                          <div>
                            <Label>Organisme</Label>
                            <Input {...register(`certifications.${index}.issuer`)} />
                          </div>
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input type="date" {...register(`certifications.${index}.date`)} />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen" onClick={() => appendCertification({ name: '', issuer: '', date: '' })}>
                      <Plus className="h-4 w-4 mr-2" /> Ajouter une certification
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-display">Projets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projectFields.map((field, index) => (
                      <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-canvas/50">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm text-ink-soft font-mono">Projet #{index + 1}</h4>
                          <Button type="button" variant="destructive" size="sm" className="bg-redpen hover:bg-redpen-dark" onClick={() => removeProject(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <Label>Nom</Label>
                          <Input {...register(`projects.${index}.name`)} />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea {...register(`projects.${index}.description`)} rows={3} />
                        </div>
                        <div>
                          <Label>Lien (optionnel)</Label>
                          <Input {...register(`projects.${index}.link`)} placeholder="https://..." />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="border-dashed border-border text-ink-soft hover:text-redpen hover:border-redpen" onClick={() => appendProject({ name: '', description: '', link: '' })}>
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un projet
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Palette className="h-4 w-4 text-redpen" />
                  Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Couleur principale</Label>
                    <Input type="color" {...register('styling.primaryColor')} className="h-12 p-1 cursor-pointer" />
                  </div>
                  <div>
                    <Label>Couleur secondaire</Label>
                    <Input type="color" {...register('styling.secondaryColor')} className="h-12 p-1 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <Label>Police</Label>
                  <Select onValueChange={(value) => setValue('styling.fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Taille du texte</Label>
                  <Select onValueChange={(value) => setValue('styling.fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">Petite</SelectItem>
                      <SelectItem value="14">Moyenne</SelectItem>
                      <SelectItem value="16">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-ink-soft font-mono pt-2 border-t border-border">
                  Astuce : ces réglages s'appliquent à l'aperçu et au PDF final, peu importe le modèle choisi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
