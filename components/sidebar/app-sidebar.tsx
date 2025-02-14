"use client";

import {
  Bookmark,
  HardDriveDownload,
  Info,
  Layers,
  LucideProps,
  Map,
  Printer,
} from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";

import {
  Sidebar,
  SidebarContent as SidebarContainer,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/sidebar/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { SidebarMecklenburgMenu } from "@/components/sidebar/sidebar-meck";
import { SidebarSocialMediaMenu } from "@/components/sidebar/sidebar-social-media";
import { Button } from "../ui/button";

const DynamicSidebarContent = dynamic(
  () =>
    import("@/components/sidebar/sidebar-content").then(
      (mod) => mod.SidebarContent
    ),
  { ssr: false }
);

const data = {
  navMain: [
    { title: "Layers", url: "#", icon: Layers, isActive: true },
    { title: "Data", url: "#", icon: HardDriveDownload, isActive: false },
    { title: "Basemaps", url: "#", icon: Map, isActive: false },
    { title: "Bookmarks", url: "#", icon: Bookmark, isActive: false },
    { title: "Print", url: "#", icon: Printer, isActive: false },
    { title: "About", url: "#", icon: Info, isActive: false },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();

  const isMobile = useIsMobile();
  const [openSheet, setOpenSheet] = React.useState(false);

  const handleItemClick = (
    item: React.SetStateAction<{
      title: string;
      url: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      isActive: boolean;
    }>
  ) => {
    setOpen(true);
    setActiveItem(item);
    if (isMobile) {
      setOpenSheet(true);
    }
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
        {...props}
      >
        {/* This is the first sidebar */}
        <Sidebar
          collapsible="none"
          className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
        >
          <SidebarHeader className="h-14 p-0">
            <SidebarMenu className="h-full p-0">
              <SidebarMenuItem className="h-full">
                <SidebarMenuButton
                  size="lg"
                  asChild
                  className="h-full w-full rounded-none"
                >
                  <Link href="#" className="w-full h-full">
                    <Image
                      src="/opendata-viewer/logo/mecklenburg-county-logo.png"
                      alt="Mecklenburg County Logo"
                      width={48}
                      height={48}
                      className="ml-2"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                      <span className="truncate font-semibold">
                        MeckODV | Open Data Viewer
                      </span>
                      <span className="truncate text-xs">v.1.0.0</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <Separator orientation="horizontal" />
          <SidebarContainer>
            <SidebarGroup>
              <SidebarGroupContent className="md:px-0">
                <SidebarMenu>
                  {data.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        onClick={() => handleItemClick(item)}
                        isActive={activeItem.title === item.title}
                        className="flex items-center px-2.5 md:px-2 w-full justify-start"
                      >
                        <item.icon className="size-5 mx-2" />
                          <span className="text-sm md:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarFooter>
              <Separator orientation="horizontal" />
              <SidebarSocialMediaMenu />
              <Separator orientation="horizontal" />
              <SidebarMecklenburgMenu />
            </SidebarFooter>
          </SidebarContainer>
        </Sidebar>

        {/* This is the second sidebar with dynamic content for desktop/tablet */}
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-base font-medium text-foreground">
                {activeItem.title}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContainer>
            <SidebarGroup>
              <SidebarGroupContent>
                <DynamicSidebarContent activeMenu={activeItem.title} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContainer>
        </Sidebar>
      </Sidebar>

      {/* This is the second sidebar with dynamic content for mobile devices */}
      {isMobile && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          {/* Hide close icon ([&>button:first-child]:hidden) */}
          <SheetContent
            side="bottom"
            className="[&>button:first-child]:hidden h-full p-4"
          >
            <SheetHeader className="gap-3.5">
              <div className="grid grid-cols-2 items-start justify-between grid-rows-1 gap-4">
                <SheetTitle>{activeItem.title}</SheetTitle>
                <SheetClose asChild>
                  <Button type="submit" variant={"outline"}>
                    Close
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <Separator className="my-2" />
            <DynamicSidebarContent activeMenu={activeItem.title} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
