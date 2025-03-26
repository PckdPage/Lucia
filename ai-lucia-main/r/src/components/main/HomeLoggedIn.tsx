import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import DialogContentComp from "./DiaLogContentComp";

import { useSelector } from "react-redux";

export default function Page() {
  const selectedTodo = useSelector((state: any) => state.todo.selectedTodo);

  console.log("yesyes", selectedTodo ? selectedTodo : "");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Work</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>[to-do-instance]</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* {Array.from({ length: 24 }).map((_, index) => ( */}
          {selectedTodo ? (
            <div className="flex flex-col">
              <div className="m-5">
                <DialogContentComp
                  data={{
                    dueDate: selectedTodo.data.dueDate,
                    category: selectedTodo.data.category,
                    priority: selectedTodo.data.priority,
                    title: selectedTodo.data.title,
                    description: selectedTodo.data.description,
                  }}
                  label="Edit"
                />
              </div>
              <div className="aspect-video h-12 w-full h-full rounded-lg bg-muted/50" />
            </div>
          ) : (
            <div
              // key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          )}
          {/* ))} */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
