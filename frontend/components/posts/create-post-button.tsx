"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CreatePostForm } from "@/components/posts/create-post-form"
import { Plus } from "lucide-react"

export function CreatePostButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
        <CreatePostForm />
      </DialogContent>
    </Dialog>
  )
}