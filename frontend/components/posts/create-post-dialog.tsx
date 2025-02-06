import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { CreatePostForm } from "./create-post-form"
  
  interface CreatePostDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  
  export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Post</DialogTitle>
          </DialogHeader>
          <CreatePostForm 
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }