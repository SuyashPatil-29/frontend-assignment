import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
}


type props = {
  post : Post
}

export function PostBodyDialog({post}: props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{post.title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post {post.id}</DialogTitle>
        </DialogHeader>
        <h1 className="font-bold">Title : {post.title}</h1>
        <div className="grid gap-4 py-4">
          {post.body}
        </div>
      </DialogContent>
    </Dialog>
  )
}

