import Link from "next/link";
import SidebarItems from "./SidebarItems";


const Sidebar = async () => {

  return (
    <aside className="h-screen min-w-52 bg-[rgb(15,15,15)] hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <Link href="/" className="text-lg font-semibold ml-4">Logo</Link>
          <SidebarItems />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

