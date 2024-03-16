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
import { Button, buttonVariants } from "@/components/ui/button";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removePost } from "@/redux/features/saveAndDeletePost";
import { toast } from "sonner";
import Link from "next/link";

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddPost = (post: Post) => {
    toast.error("Post Removed", {
      description: "The post has been removed from your library.",
      dismissible: true,
    });
    dispatch(removePost(post));
    setTimeout(() => {
      window.location.reload();
    }, 500);
    console.log(post);
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const savedPosts = localStorage.getItem("posts");
  const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 justify-center h-[80vh]">
        <h1>No saved posts found</h1>
        <Link className={buttonVariants()} href="/posts">
          Save Posts
        </Link>
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

  if (!filteredPosts || filteredPosts.length === 0 || !currentPosts) {
    return <EmptyAlert />;
  }

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
      {filteredPosts && filteredPosts.length > 0 ? (
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