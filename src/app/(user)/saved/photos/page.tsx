"use client";
import React, { useState } from "react";
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
import { removePhoto } from "@/redux/features/saveAndDeletePhoto";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const handleRemovePhoto = (photo: Photo) => {
    toast.success("Photo Removed", {
      description: "The photo has been removed from your library.",
      dismissible: true,
    });
    dispatch(removePhoto(photo));
    router.refresh();
    console.log(photo);
  };

  const localStorageAvailable = typeof window !== "undefined";

  const localstorage = localStorageAvailable && localStorage.getItem("photos");
  console.log("Photos from local storage", localstorage);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const storedPhotos = localStorageAvailable && localStorage.getItem("photos");
  const photos: Photo[] = storedPhotos ? JSON.parse(storedPhotos) : [];

  const filteredPhotos = photos?.filter((photo) =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  };

  if (photos.length < 0) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center h-[80vh]">
        <h1>No photos found</h1>
        <Link className={buttonVariants()} href="/photos">
          Add Photos
        </Link>
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

  return (
    <div>
      <h1 className="my-8 font-bold text-3xl">Photos</h1>
      <Input
        type="text"
        className="w-full mb-8"
        placeholder="Start typing to search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <div className="grid grid-cols-4 gap-4 w-full">
        {currentPhotos && currentPhotos.length > 0 ? (
          currentPhotos.map((photo, index) => (
            <div className="my-3 flex gap-5 items-center" key={photo.id}>
              {index + 1}){" "}
              <div className="w-full flex flex-col gap-3 items-center justify-center">
                <p className="text-center">
                  {photo.title.substring(0, 20) + "..."}
                </p>
                <PhotoBodyDialog photo={photo} />
                <Button
                  className="w-[100px] p-1"
                  onClick={() => handleRemovePhoto(photo)}
                >
                  Remove
                </Button>
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

          {/* Render page numbers */}
          {Array.from(
            { length: Math.ceil(filteredPhotos.length / photosPerPage) },
            (_, i) => {
              const pageNumber = i + 1;
              const isEllipsisStart = currentPage > 3 && i === 1;
              const isEllipsisEnd =
                currentPage <
                  Math.ceil(filteredPhotos.length / photosPerPage) - 2 &&
                i === Math.ceil(filteredPhotos.length / photosPerPage) - 2;

              if (
                (currentPage <= 3 && i < 3) ||
                (currentPage >=
                  Math.ceil(filteredPhotos.length / photosPerPage) - 2 &&
                  i >= Math.ceil(filteredPhotos.length / photosPerPage) - 3) ||
                isEllipsisStart ||
                isEllipsisEnd
              ) {
                return (
                  <React.Fragment key={pageNumber}>
                    {isEllipsisStart || isEllipsisEnd ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => paginate(pageNumber)}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </React.Fragment>
                );
              }
              return null;
            },
          )}

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
