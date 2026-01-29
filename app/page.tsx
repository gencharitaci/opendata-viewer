"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Disclaimer from "@/components/disclaimer/disclaimer";
import { Separator } from "@/components/ui/separator";
import {
  SIDEBAR_WIDTH,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayerProvider } from "@/contexts/layer-context";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapComponent = dynamic(
  () => import("@/components/map/map").then((mod) => mod.MapComponent),
  { ssr: false }
);

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <LayerProvider>
        <SidebarProvider
          // className="relative -inset-1 bg-gradient-to-r from-sky-700/20 via-amber-500/20 to-sky-300/20 rounded-2xl opacity-75"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>
            <div className="flex h-screen flex-col">
              <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Mecklenburg County
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold">
                        Open Data Viewer
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="flex-1">
                <Disclaimer />
                <MapComponent />
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </LayerProvider>
    </TooltipProvider>
  );
}
