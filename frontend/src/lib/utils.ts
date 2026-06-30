// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction de base pour les classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatage des dates
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateShort = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Texte
export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(word => capitalize(word)).join(' ')
}

// Initiales
export const getInitials = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) return 'U'
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export const getAvatarFallback = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Génération d'ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Gestion d'erreurs
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.error) return error.response.data.error
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}

export const getErrorStatus = (error: any): number => {
  if (error?.response?.status) return error.response.status
  return 500
}

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')
}

// Stockage local
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    return JSON.parse(item)
  } catch {
    return defaultValue
  }
}

export const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Redirection avec délai
export const redirectWithDelay = (router: any, path: string, delay: number = 1000) => {
  setTimeout(() => {
    router.push(path)
  }, delay)
}

// Copier dans le presse-papier
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Téléchargement de fichier
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Détection du navigateur
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export const isMobile = (): boolean => {
  if (!isBrowser()) return false
  return window.innerWidth < 768
}

export const isTablet = (): boolean => {
  if (!isBrowser()) return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = (): boolean => {
  if (!isBrowser()) return false
  return window.innerWidth >= 1024
}

// Filtrage et tri
export const sortByDate = <T extends { createdAt: string | Date }>(
  items: T[],
  direction: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return direction === 'desc' ? dateB - dateA : dateA - dateB
  })
}

export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] => {
  if (!search) return items
  const query = search.toLowerCase()
  return items.filter(item =>
    fields.some(field =>
      String(item[field]).toLowerCase().includes(query)
    )
  )
}

// Export par défaut pour faciliter l'importation
const utils = {
  cn,
  formatDate,
  formatDateTime,
  formatDateShort,
  truncateText,
  capitalize,
  capitalizeWords,
  getInitials,
  getAvatarFallback,
  isValidEmail,
  isValidPhone,
  isValidURL,
  generateId,
  generateSlug,
  debounce,
  getErrorMessage,
  getErrorStatus,
  isNetworkError,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  redirectWithDelay,
  copyToClipboard,
  downloadFile,
  isBrowser,
  isMobile,
  isTablet,
  isDesktop,
  sortByDate,
  filterBySearch,
}

export default utils