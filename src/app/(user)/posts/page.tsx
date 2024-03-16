"use client";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostBodyDialog } from "@/components/PostBodyDialog";
import { Input } from "@/components/ui/input";
import { EmptyAlert } from "@/components/EmptyAlert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addPost, removePost } from "@/redux/features/saveAndDeletePost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleAddPost = (post: Post) => {
    toast.success("Post Saved", {
      description: "The post has been saved to your library.",
      dismissible: true,
    });
    dispatch(addPost(post));
    router.refresh();
    console.log(post);
  };

  const handleRemovePost = (post: Post) => {
    toast.error("Post Removed", {
      description: "The post has been removed from your library.",
      dismissible: true,
    });
    dispatch(removePost(post));
    router.refresh();
    console.log(post);
  };

  const localStorageAvailable = typeof window !== "undefined";
  const localstorage = localStorageAvailable && localStorage.getItem("posts");
  const localStoragePosts: Post[] = localstorage
    ? JSON.parse(localstorage)
    : [];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      return data as Post[];
    },
  });

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoadingPosts) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const postsPerPage = 20; // Updated to 20 posts per page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts?.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="mt-8 mb-2 font-bold text-3xl">Posts</h1>
      <p className="mb-8 text-sm">Click on the post title to view the body</p>
      <Input
        type="text"
        className="w-full mb-8"
        placeholder="Start typing to search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      {filteredPosts && filteredPosts.length > 0 && currentPosts ? (
        currentPosts.map((post) => (
          <div className="my-3 flex gap-5 items-center" key={post.id}>
            {post.id}){" "}
            <div className="w-full flex items-center justify-between">
              <PostBodyDialog post={post} />{" "}
              {localStoragePosts.some((p) => p.id === post.id) ? (
                <Button onClick={() => handleRemovePost(post)}>Remove</Button>
              ) : (
                <Button onClick={() => handleAddPost(post)}>Save</Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <EmptyAlert />
      )}

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

          {/* Render the third page */}
          <PaginationItem key={3}>
            <PaginationLink
              onClick={() => paginate(3)}
              isActive={3 === currentPage}
            >
              3
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => paginate(4)}
              isActive={4 === currentPage}
            >
              4
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => paginate(5)}
              isActive={5 === currentPage}
            >
              5
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              className={
                indexOfLastPost >= filteredPosts!.length ? "hidden" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Page;
