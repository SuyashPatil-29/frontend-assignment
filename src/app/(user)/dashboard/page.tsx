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
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

interface Post {
    body: string;
    id: number;
    title: string;
    userId: number;
}

const DashboardPage = () => {
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
      );
      return data as Photo[];
    },
  });

    const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
      );
      return data as Post[];
    },
  });

  console.log(posts);

  return (
    <div>
      <h1 className="text-3xl font-bold mt-8 mb-10">Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        <Link href="/photos">
          <Card className="bg-[rgb(15,15,15)] group">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                Over {photos ? photos?.length : "...." } Photos Uploaded
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 group">
              {!isLoadingPhotos && photos ? photos?.slice(0, 7).map((photo) => (
                <Card>
                  <Image
                    src={photo.thumbnailUrl}
                    width={100}
                    height={100}
                    alt="photo"
                  />
                </Card>
              )) :
                <div className="w-full h-full flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              }
            </CardContent>
            <CardFooter >
              <p className="cursor-pointer group:hover:underline">Click to view all</p>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/posts">
          <Card className="bg-[rgb(15,15,15)] group">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Over {posts ? posts?.length : "...."} Posts Uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoadingPosts && posts ? (
                <div className="flex gap-4">
                  {posts?.slice(0, 5).map((post) => (
                    <Card className="md:p-4 p-3 group">
                      <p>{post.title.slice(0, 22) + "..." }</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
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

export default DashboardPage;
