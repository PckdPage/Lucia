import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedTodo } from "../store/todoSlice";

import {
  File,
  UserRoundPen,
  Store,
  Plus,
  Moon,
  AlertTriangle,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/button";
import DialogContentComp from "./main/DiaLogContentComp";

import { useQueryClient } from "@tanstack/react-query";

//sample data aaile lai
const normalData = {
  user: {
    name: "User",
    email: "m@example.com",
    avatar: "/lucia_p.png",
  },
  navMain: [
    {
      title: "Work",
      url: "#",
      icon: File,
      isActive: true,
    },
    {
      title: "Personal",
      url: "#",
      icon: UserRoundPen,
      isActive: false,
    },
    {
      title: "Shopping",
      url: "#",
      icon: Store,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  //eta
  const [activeItem, setActiveItem] = React.useState(normalData.navMain[0]);
  const { setOpen } = useSidebar();

  const [darkMode, setDarkMode] = React.useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  //data
  const [filters, setFilters] = React.useState({
    category: "Work",
    priority: null,
  });

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["todoData", filters],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getTodo`,
        {
          withCredentials: true,
          params: filters,
        }
      );
      return response.data;
    },
  });
  console.log(data);
  if (isLoading) {
    return <p></p>;
  }

  const queryClient = useQueryClient();

  const getReadableData = (string: string): string => {
    const date = new Date(string);
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedDate;
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <a
                href="#"
                className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <img
                  src="/lucia_p.png"
                  alt="company-logo"
                  className="object-cover w-full h-full"
                />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {/* {data.navMain.map((item) => ( */}
                {normalData.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          category: item.title,
                        }));
                        queryClient.invalidateQueries({
                          queryKey: ["todoData"],
                        });
                        setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: data?.username,
              email: data?.email,
              avatar: data?.profilePic,
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>
                <Moon></Moon>
              </span>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => setDarkMode(!!checked)}
                className="shadow-none"
              />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
          <Dialog>
            <DialogTrigger>
              <Button className="w-full">
                <Plus />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="">
                <DialogContentComp data={null} label="Submit" />
              </div>
            </DialogContent>
          </Dialog>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {data?.Todo.map((instance: any) => (
                <div
                  onClick={() => dispatch(setSelectedTodo(instance))}
                  // href="#"
                  key={instance.id}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2 ">
                    {/* <span className="font-small ">* High</span>{" "} */}
                    <span className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      HIGH
                    </span>
                    <span className="ml-auto text-xs w-auto">
                      {getReadableData(instance.dueDate)}
                    </span>
                  </div>
                  {/* <span className="font-small">{instance.description}</span> */}
                  <span className="font-extrabold line-clamp-1 w-full whitespace-break-spaces ">
                    {instance.title}
                  </span>
                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    {instance.description}
                  </span>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
