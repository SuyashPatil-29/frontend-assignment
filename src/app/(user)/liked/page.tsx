"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
}

const localStorageAvailable = typeof window !== 'undefined';

const SavedDashboard = () => {
  // Check if "photos" data exists in localStorage
  const storedPhotos = localStorageAvailable && localStorage.getItem("liked-photos");

  // Parse the storedPhotos if it exists, otherwise set it to an empty array
  const photos: Photo[] = storedPhotos ? JSON.parse(storedPhotos) : [];

  const storedPosts = localStorageAvailable && localStorage.getItem("likedPosts");

  const posts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mt-8 mb-10">Liked</h1>
      <div className="grid grid-cols-1 gap-8">
        <Link href="liked/photos">
          <Card className="bg-[rgb(15,15,15)]">
            <CardHeader>
              <CardTitle>Liked Photos</CardTitle>
              <CardDescription>
                {photos ? photos?.length : "...."} Photos Liked
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              {photos.length > 0 ? (
                photos?.slice(0, 7).map((photo) => (
                  <Card className="group" key={photo.id}>
                    <Image
                      src={photo.thumbnailUrl}
                      width={100}
                      height={100}
                      alt="photo"
                    />
                  </Card>
                ))
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p>No photos liked</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="cursor-pointer group:hover:underline">Click to view all</p>
            </CardFooter>
          </Card>
        </Link>

        <Link href="liked/posts">
          <Card className="bg-[rgb(15,15,15)]">
            <CardHeader>
              <CardTitle>Liked Posts</CardTitle>
              <CardDescription>
                {posts ? posts?.length : "...."} Posts Liked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length > 0 ? (
                <div className="flex gap-4">
                  {posts?.slice(0, 5).map((post) => (
                    <Card className="md:p-4 p-3" key={post.id}>
                      <p>{post.title.slice(0, 22) + "..."}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p>No posts liked</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="cursor-pointer group:hover:underline">Click to view all</p>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default SavedDashboard;
