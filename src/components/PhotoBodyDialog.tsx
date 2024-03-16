import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";

interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};


type props = {
  photo : Photo
}

export function PhotoBodyDialog({photo}: props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-3 items-center">
        <Image src={photo.thumbnailUrl} alt={photo.title} width={100} height={100} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Photo {photo.id}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full w-full items-center justify-center gap-4 p-4">
          <Image src={photo.url} alt={photo.title} width={300} height={300} />
          <h1 className="text-center font-semibold text-lg">Title : {photo.title}</h1>
        </div>
      </DialogContent>
    </Dialog>
  )
}
