"use client";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyAlert } from "@/components/EmptyAlert";
import { PhotoBodyDialog } from "@/components/PhotoBodyDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { addPhoto, removePhoto } from "@/redux/features/saveAndDeletePhoto";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { likePhoto, unlikePhoto } from "@/redux/features/likeUnlikePhotos";

interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleAddPhoto = (photo: Photo) => {
    toast.success("Photo Saved", {
      description: "The photo has been saved to your library.",
      dismissible: true,
    });
    dispatch(addPhoto(photo));
    router.refresh();
    console.log(photo);
  };

  const handleRemovePhoto = (photo: Photo) => {
    toast.error("Photo Removed", {
      description: "The photo has been removed from your library.",
      dismissible: true,
    });
    dispatch(removePhoto(photo));
    router.refresh();
    console.log(photo);
  };

  const handleLikePhoto = (photo: Photo) => {
    toast.success("Photo Liked", {
      description: "The photo has been liked.",
      dismissible: true,
    });
    dispatch(likePhoto(photo));
    router.refresh();
    console.log(photo);
  };

  const handleUnlikePhoto = (photo: Photo) => {
    toast.error("Photo Unliked", {
      description: "The photo has been unliked.",
      dismissible: true,
    });
    dispatch(unlikePhoto(photo));
    router.refresh();
    console.log(photo);
  };

  const localStorageAvailable = typeof window !== "undefined";

  const storageSave = localStorageAvailable && localStorage.getItem("photos");
  const storageLike =
    localStorageAvailable && localStorage.getItem("liked-photos");

  const localStoragePhotos: Photo[] = storageSave
    ? JSON.parse(storageSave)
    : [];

  const localStorageLikedPhotos: Photo[] = storageLike
    ? JSON.parse(storageLike)
    : [];

  console.log("liked-photos", localStorageLikedPhotos);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
      );
      return data as Photo[];
    },
  });

  const filteredPhotos = photos?.filter((photo) =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  };

  if (isLoadingPhotos) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const photosPerPage = 20;
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos?.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (!filteredPhotos) {
    return <EmptyAlert />;
  }

  return (
    <div>
      <h1 className="mt-8 mb-2 font-bold text-3xl">Photos</h1>
      <p className="mb-8 text-sm">Click on the photo title to view it in full size</p>
      <Input
        type="text"
        className="w-full mb-8"
        placeholder="Start typing to search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <div className="grid grid-cols-4 gap-4">
        {currentPhotos && currentPhotos.length > 0 ? (
          currentPhotos.map((photo) => (
            <div className="my-3 flex gap-5 items-center" key={photo.id}>
              {photo.id}){" "}
              <div className="w-full flex flex-col gap-3 items-center justify-center">
                <p className="text-center">
                  {photo.title.substring(0, 20) + "..."}
                </p>
                <PhotoBodyDialog photo={photo} />
                <div className="flex gap-3 items-center">
                  {localStorageLikedPhotos.some((p) => p.id === photo.id) ? (
                    <div onClick={() => handleUnlikePhoto(photo)}>
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                  ) : (
                    <div onClick={() => handleLikePhoto(photo)}>
                      <Heart className="w-5 h-5" />
                    </div>
                  )}
                  {localStoragePhotos.some((p) => p.id === photo.id) ? (
                    <Button
                      className="flex-1 px-3"
                      onClick={() => handleRemovePhoto(photo)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 px-3"
                      onClick={() => handleAddPhoto(photo)}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyAlert />
        )}
      </div>

      <Separator className="my-8" />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => paginate(currentPage - 1)}
              className={currentPage === 1 ? "hidden" : ""}
            />
          </PaginationItem>

          {/* Render the first page */}
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => paginate(1)}
              isActive={1 === currentPage}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Render the second page */}
          <PaginationItem key={2}>
            <PaginationLink
              onClick={() => paginate(2)}
              isActive={2 === currentPage}
            >
              2
            </PaginationLink>
          </PaginationItem>

          {/* Render ellipsis if there are pages before the current page */}
          {currentPage > 3 && (
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Render the current page if it's not the first, second, or third page */}
          {currentPage > 3 &&
            currentPage <
              Math.ceil(filteredPhotos.length / photosPerPage) - 2 && (
              <PaginationItem key={currentPage}>
                <PaginationLink
                  onClick={() => paginate(currentPage)}
                  isActive={true}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}

          {/* Render ellipsis if there are pages after the current page */}
          {currentPage <
            Math.ceil(filteredPhotos.length / photosPerPage) - 3 && (
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Render the last two pages */}
          {Array.from({ length: 2 }, (_, i) => {
            const pageNumber =
              Math.ceil(filteredPhotos.length / photosPerPage) - (1 - i);
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={() => paginate(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              className={
                indexOfLastPhoto >= filteredPhotos.length ? "hidden" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Page;
