import { SidebarLink } from "@/components/SidebarItems";
import {
  CircleFadingPlus,
  Heart,
  HomeIcon,
  Image,
  StickyNote,
} from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Dashboard", icon: HomeIcon },
  { href: "/photos", title: "Photos", icon: Image },
  { href: "/posts", title: "Posts", icon: StickyNote },
  { href: "/saved", title: "Saved", icon: CircleFadingPlus },
  { href: "/liked", title: "Liked", icon: Heart },
];

export const additionalLinks: AdditionalLinks[] = [];
