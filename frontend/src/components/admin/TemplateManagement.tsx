'use client'

import { useState, useEffect } from 'react'
import { Template } from '../../types'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Plus, Edit, Trash2, Crown, Eye, EyeOff } from 'lucide-react'
import { useTemplateStore } from '../../store/templateStore'
import toast from 'react-hot-toast'

export function TemplateManagement() {
  const { templates, loading, fetchTemplates, createTemplate, updateTemplate, deleteTemplate } = useTemplateStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const defaultStyles: Template['styles'] = {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
    fontSize: 14,
    spacing: 'normal',
    sections: ['personal', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects'],
  }

  const [formData, setFormData] = useState<Partial<Template>>({
    name: '',
    description: '',
    category: 'MODERN',
    isActive: true,
    isPremium: false,
    styles: defaultStyles,
  })

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleOpenDialog = (template?: Template) => {
    if (template) {
      setEditingTemplate(template)
      setFormData(template)
    } else {
      setEditingTemplate(null)
      setFormData({
        name: '',
        description: '',
        category: 'MODERN',
        isActive: true,
        isPremium: false,
        styles: {
          primaryColor: '#3b82f6',
          secondaryColor: '#1e293b',
          fontFamily: 'Inter',
          fontSize: 14,
          spacing: 'normal',
          sections: ['personal', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects'],
        },
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTemplate(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData)
      } else {
        await createTemplate(formData)
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      await deleteTemplate(id)
    } catch (error) {
      console.error('Failed to delete template:', error)
    }
  }

  const handleToggleActive = async (template: Template) => {
    try {
      await updateTemplate(template.id, { isActive: !template.isActive })
    } catch (error) {
      console.error('Failed to toggle template:', error)
    }
  }

  const handleTogglePremium = async (template: Template) => {
    try {
      await updateTemplate(template.id, { isPremium: !template.isPremium })
    } catch (error) {
      console.error('Failed to toggle premium:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading templates...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardContent className="pt-6">
              <div className="aspect-[210/297] bg-gray-100 rounded-md overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-400 text-sm">Template Preview</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(template)}
                    >
                      {template.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePremium(template)}
                    >
                      <Crown className={`h-4 w-4 ${template.isPremium ? 'text-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Badge variant={template.isActive ? 'default' : 'secondary'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {template.isPremium && (
                    <Badge variant="default" className="bg-yellow-500">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Update the template details below.' : 'Fill in the details to create a new template.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this template"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MODERN">Modern</SelectItem>
                  <SelectItem value="CLASSIC">Classic</SelectItem>
                  <SelectItem value="ATS_FRIENDLY">ATS Friendly</SelectItem>
                  <SelectItem value="CREATIVE">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.styles?.primaryColor || '#3b82f6'}
                  onChange={(e) => setFormData({
                    ...formData,
                    styles: { ...(formData.styles ?? defaultStyles), primaryColor: e.target.value }
                  })}
                  className="h-12 p-1"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.styles?.secondaryColor || '#1e293b'}
                  onChange={(e) => setFormData({
                    ...formData,
                    styles: { ...(formData.styles ?? defaultStyles), secondaryColor: e.target.value }
                  })}
                  className="h-12 p-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select
                value={formData.styles?.fontFamily || 'Inter'}
                onValueChange={(value) => setFormData({
                  ...formData,
                  styles: { ...(formData.styles ?? defaultStyles), fontFamily: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
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

            <div className="space-y-2">
              <Label htmlFor="spacing">Spacing</Label>
              <Select
                value={formData.styles?.spacing || 'normal'}
                onValueChange={(value: any) => setFormData({
                  ...formData,
                  styles: { ...(formData.styles ?? defaultStyles), spacing: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPremium">Premium</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}