"use client";
import React, { useState } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removePost } from "@/redux/features/saveAndDeletePost";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
}

const localStorageAvailable = typeof window !== "undefined";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleAddPost = (post: Post) => {
    toast.error("Post Removed", {
      description: "The post has been removed from your library.",
      dismissible: true,
    });
    dispatch(removePost(post));
    router.refresh();
    console.log(post);
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const savedPosts = localStorageAvailable && localStorage.getItem("posts");
  const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const postsPerPage = 20; // Updated to 20 posts per page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts?.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="my-8 font-bold text-3xl">Posts</h1>
      <Input
        type="text"
        className="w-full mb-8"
        placeholder="Start typing to search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />

      {posts.length < 0 ? (
        <div className="flex flex-col items-center gap-5 justify-center h-[80vh]">
          <h1>No saved posts found</h1>
          <Link className={buttonVariants()} href="/posts">
            Save Posts
          </Link>
        </div>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        currentPosts.map((post) => (
          <h1 className="my-3 flex gap-5 items-center" key={post.id}>
            {post.id}){" "}
            <div className="w-full flex items-center justify-between">
              <PostBodyDialog post={post} />{" "}
              <Button onClick={() => handleAddPost(post)}>Remove</Button>
            </div>
          </h1>
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

          {/* Render page numbers */}
          {Array.from({
            length: Math.ceil(filteredPosts.length / postsPerPage),
          }).map((_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => paginate(index + 1)}
                isActive={index + 1 === currentPage}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              className={
                indexOfLastPost >= filteredPosts.length ? "hidden" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Page;
