import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarItems from "./SidebarItems";
import { AlignJustify } from "lucide-react";

export default function MobileSidebar() {
  return (
    <div className="md:hidden border-b mb-4 pb-2 w-full">
      <nav className="flex justify-between w-full items-center">
        <div className="font-semibold text-lg">Logo</div>
        <Sheet>
          <SheetTrigger asChild>
            <AlignJustify className="cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left" className="flex h-full w-full items-center justify-center">
            <SidebarItems />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
