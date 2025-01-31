"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true)
      const file = acceptedFiles[0]

      if (!file) return

      // Create FormData
      const formData = new FormData()
      formData.append("file", file)

      // Replace with your upload API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Error uploading file:", error)
      // You might want to show an error toast here
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative
          border-2
          border-dashed
          rounded-lg
          p-4
          transition
          ${isDragActive ? "border-yellow-500" : "border-gray-600"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-yellow-500/50"}
          ${value ? "h-[300px]" : "h-[200px]"}
        `}
      >
        <input {...getInputProps()} />
        
        {value ? (
          // Image preview
          <div className="relative h-full w-full">
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              onClick={handleRemove}
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          // Upload placeholder
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
                <p className="text-sm text-gray-400">Uploading...</p>
              </>
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {isDragActive ? (
                    "Drop the image here"
                  ) : (
                    "Drag and drop an image, or click to select"
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Max file size: 5MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}