'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Camera, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface ImageUploadProps {
  currentImage?: string | null
  onImageChange: (url: string | null) => void
  onImageRemove: () => void
  isLoading?: boolean
  className?: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
  isLoading = false,
  className
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      )
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', response.status, errorText)

        // Try to parse as JSON, fallback to text
        let errorMessage = 'Upload failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorText
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: Upload failed`
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result.success) {
        onImageChange(result.data.url)
        toast.success('Profile picture updated successfully!')
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      )
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    try {
      const response = await fetch('/api/user/upload-avatar', {
        method: 'DELETE'
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete failed:', response.status, errorText)

        // Try to parse as JSON, fallback to text
        let errorMessage = 'Delete failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorText
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: Delete failed`
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result.success) {
        onImageRemove()
        setPreview(null)
        toast.success('Profile picture removed successfully!')
      } else {
        throw new Error(result.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove image'
      )
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || currentImage

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {displayImage && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0"
                onClick={handleRemoveImage}
                disabled={uploading || isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-sm text-gray-600">
              Upload a JPEG, PNG, or WebP image (max 5MB)
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClick}
              disabled={uploading || isLoading}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
