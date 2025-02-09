"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  LayoutDashboard,
  Folder,
  CheckSquare,
  Settings,
  MessageSquare,
  Bell,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BsSun, BsMoon } from "react-icons/bs";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

 

  const menuItems = [
    { name: "Home", icon: Home },
    { name: "Dashboard", icon: LayoutDashboard },
    {
      name: "Projects",
      icon: Folder,
      expandable: true,
      subItems: ["Active", "Archived", "Templates"],
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      expandable: true,
      subItems: ["To-Do", "InProgress", "Completed"],
    },
    {
      name: "Settings",
      icon: Settings,
      expandable: true,
      subItems: [
        "MyDetails",
        "MyProfile",
        "Security",
        "Integrations",
        "Billing",
      ],
    },
    { name: "Messages", icon: MessageSquare },
  ];

  const handleIconClick = (name: string) => {
    setActiveIcon((prev) => (prev === name ? null : name));
    setExpanded((prev) => (activeIcon === name ? !prev : true));
  };

  const toggleMenu = (menu: string, subItem?: string) => {
    console.log("UIOPP");
    if (subItem) {
      if (menu === "Projects") {
        router.push(`/projects/${subItem.toLowerCase()}`);
      }
      else if (menu === "Tasks") { 
        router.push(`/tasks/${subItem.toLowerCase()}`);
      }
      else if (menu === "Settings") {
        router.push(`/settings/${subItem.toLowerCase()}`);
      }
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    if (menu === "Dashboard") {
      router.push("/dashboard");
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("openMenus", openMenus);

  return (
    <div className={cn("h-screen flex", darkMode && "dark")}>
      <div
        className={cn(
          "h-screen w-20 flex flex-col items-center py-4",
          darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        )}
      >
        <button
          className="p-2 rounded focus:outline-none"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <BsSun className="w-6 h-6 text-yellow-500 hover:text-yellow-400" />
          ) : (
            <BsMoon className="w-6 h-6 text-gray-700 hover:text-gray-600" />
          )}
        </button>

        <div className="mt-4 space-y-4">
          {menuItems.map((item) => (
            <item.icon
              key={item.name}
              onClick={() => handleIconClick(item.name)}
              className={cn(
                "w-6 h-6 cursor-pointer transition-colors duration-300",
                activeIcon === item.name
                  ? "text-blue-500"
                  : darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-black"
              )}
            />
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <Bell className="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-600" />
          <HelpCircle className="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-600" />
          <div className="relative w-12 h-12">
            <Image
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full border-2 border-gray-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={cn(
          "h-screen flex flex-col transition-all duration-300 overflow-hidden",
          expanded ? "w-64" : "w-0",
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        )}
      >
        <div className="p-4 pb-0">
          <div className="p-4 text-xl font-semibold">Overview</div>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className={cn(
                "w-full rounded px-8 py-2 focus:outline-none",
                darkMode ? "bg-gray-800" : "bg-white border"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <div key={item.name} className="mb-2">
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-2 rounded cursor-pointer",
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                )}
                onClick={() => toggleMenu(item.name)}
              >
                <div className="flex items-center gap-2">
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      activeIcon === item.name
                        ? "text-blue-500"
                        : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-black"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.expandable && (
                  <button>
                    {openMenus[item.name] ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {item.expandable && openMenus[item.name] && (
                <div className="relative ml-6 mt-1">
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-400 dark:bg-gray-500" />
                  {item.subItems?.map((subItem, index, arr) => (
                    <div
                      key={subItem}
                      className="relative pl-4 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-400 dark:bg-gray-500" />
                      {index === arr.length - 1 && (
                        <div className="absolute left-0 top-0 h-1/2 w-px bg-gray-400 dark:bg-gray-500" />
                      )}
                      <span
                        className={cn(
                          "block pl-2",
                          subItem === "My profile" &&
                            "bg-gray-300 dark:bg-gray-600 px-2 rounded"
                        )}
                        onClick={() => toggleMenu(item.name, subItem)}
                      >
                        {subItem}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
