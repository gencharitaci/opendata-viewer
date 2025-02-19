"use client";

import { Basemaps } from "@/components/basemaps/basemaps";
import { BookmarksComponent } from "@/components/bookmarks/bookmarks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PrintComponent } from "@/components/ui/print";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayers } from "@/contexts/layer-context";
import { useMap } from "@/contexts/map-context";
import { cn } from "@/lib/utils";
import { IDataAndFeatureAPI } from "@/types/data";
import Basemap from "@arcgis/core/Basemap";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import EsriMap from "@arcgis/core/Map";
import DOMPurify from "dompurify";
import {
  Calendar1Icon,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  FileDown,
  FileText,
  HardDrive,
  Info,
  Layers,
  LinkIcon,
  ListFilter,
  Shapes,
  Trash2,
  Webhook,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  activeMenu: string;
}
interface ErrorType {
  message?: string;
}

export function SidebarContent({
  activeMenu,
  className,
  ...props
}: SidebarContentProps) {
  const { view } = useMap();
  const { layers, toggleLayer, getFeature } = useLayers();

  const [searchLayersPlaceholder, setSearchLayersPlaceholder] =
    useState<string>("Search layers...");
  const [searchLayersTerm, setSearchLayersTerm] = useState("");
  const [filter, setFilter] = useState<"active" | "all">("all");
  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  const [dataItems, setDataItems] = useState<IDataAndFeatureAPI[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<ErrorType | null>(null);
  const [filteredDataItems, setFilteredDataItems] = useState(dataItems);
  const [searchDataPlaceholder, setSearchDataPlaceholder] =
    useState<string>("Search data...");
  const [searchDataTerm, setSearchDataTerm] = useState("");

  const openDataUrl = process.env.NEXT_PUBLIC_MECK_OPENDATA;
  console.log(openDataUrl);

  // Manage animated visibility of layers
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];
    Object.keys(layers).forEach((layerId, index) => {
      const timeoutId = setTimeout(() => {
        setVisibleLayers((prev) => [...prev, layerId]);
      }, index * 200);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [layers]);

  /** Layers menu - Search placeholder animation */
  useEffect(() => {
    let currentIndex = 0;
    const placeholderIds = Object.keys(layers);
    const intervalId = setInterval(() => {
      if (placeholderIds.length > 0) {
        setSearchLayersPlaceholder(`${placeholderIds[currentIndex]}`);
        currentIndex = (currentIndex + 1) % placeholderIds.length;
      }
    }, 1000); // Change placeholder in every 1 minute.

    return () => clearInterval(intervalId);
  }, [layers]);

  /** Layers menu - Filter Filtered layers based on search term and  + animation */
  const filteredLayers = Object.entries(layers)
    .filter(([, isVisible]) => {
      if (filter === "active") return isVisible; // Only show active layers
      return true; // Show all layers if filter is "all"
    })
    .filter(
      ([layerId]) =>
        layerId.toLowerCase().includes(searchLayersTerm.toLowerCase()) // Apply search term
    )
    .filter(([layerId]) => visibleLayers.includes(layerId)); // Apply animation visibility

  /** Data menu - Search placeholder animation */
  useEffect(() => {
    let currentIndex = 0;
    const placeholderItems = dataItems.map((item) => item.title);
    const intervalId = setInterval(() => {
      if (placeholderItems.length > 0) {
        setSearchDataPlaceholder(`${placeholderItems[currentIndex]}`);
        currentIndex = (currentIndex + 1) % placeholderItems.length;
      }
    }, 1000); // Change placeholder in every 1 minute.

    return () => clearInterval(intervalId);
  }, [dataItems]);

  /** Data menu - Search */
  useEffect(() => {
    const results = dataItems.filter((item) =>
      item.title.toLowerCase().includes(searchDataTerm.toLowerCase())
    );
    setFilteredDataItems(results);
  }, [searchDataTerm, dataItems]);

  const handleBasemapChange = async (basemapId: string, url?: string) => {
    if (view?.map) {
      try {
        // Preserve the current layers
        const currentLayers = view.map.layers.toArray();

        if (url) {
          // Create custom Mecklenburg basemap
          const baseLayer =
            url.includes("VectorBasemap") ||
            url.includes("VectorBasemapGrayscale")
              ? new MapImageLayer({ url })
              : new TileLayer({ url });

          const basemap = new Basemap({
            baseLayers: [baseLayer],
            title: basemapId,
          });

          // Update the map with custom basemap
          view.map = new EsriMap({
            basemap: basemap,
          });
        } else {
          // Update the map with standard ArcGIS basemap
          view.map = new EsriMap({
            basemap: basemapId,
          });
        }

        // Re-add the layers
        if (currentLayers.length > 0) {
          view.map.addMany(currentLayers);
        }

        console.log("Basemap changed to:", basemapId);
      } catch (error) {
        console.error("Error switching basemap:", error);
      }
    } else {
      console.warn("Map view not initialized");
    }
  };

  /** Data menu - Fetch data from API */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/opendata-viewer/api/opendata/data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setDataItems(data);
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          setErrorData({ message: error.message });
        } else {
          setErrorData({ message: "An error occurred while fetching data" });
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  if (loadingData) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {errorData.message}</p>
      </div>
    );
  }

  switch (activeMenu) {
    case "Layers":
      return (
        <div className={cn("px-1 py-1 space-y-0", className)} {...props}>
          {/* Searchbar */}
          <div className="sticky top-2 mb-2">
            <Button
              variant="outline"
              className="absolute m-0 p-2 border-none rounded-lg  left-0 top-1/2 transform -translate-y-1/2 bg-sky-100 text-gray-500 hover:text-gray-700"
            >
              {"Search :"}
            </Button>
            <Input
              id={searchLayersPlaceholder}
              type="text"
              className="w-full py-2 pl-20 border rounded-lg bg-white focus:outline-none focus:ring placeholder:text-sky-700 placeholder:pl-0 placeholder:text-xs placeholder:font-semibold"
              placeholder={searchLayersPlaceholder}
              value={searchLayersTerm}
              onChange={(e) => setSearchLayersTerm(e.target.value)}
            />
            {searchLayersTerm && (
              <Button
                variant="ghost"
                onClick={() => setSearchLayersTerm("")} // Clear the input field
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-5 h-5" color="#ea5d5d" />
              </Button>
            )}

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <ListFilter className="text-gray-900 w-5 h-5" />
              </PopoverTrigger>
              <PopoverContent className="p-2 space-y-2 text-sm w-auto">
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md ${
                    filter === "active"
                      ? "bg-blue-100 text-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter("active")}
                >
                  {filter === "active" ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                  <span>Only active layers</span>
                </div>
                <div
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md ${
                    filter === "all"
                      ? "bg-blue-100 text-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  {filter === "all" ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                  <span>All layers</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Layers */}
          <div data-sidebar-content="Layers" className="mt-2 border-t pt-2">
            <ScrollArea className="h-[calc(100vh-148px)]">
              <div className="space-y-1 p-2 lg:p-4 gap-4 ">
                {filteredLayers.map(([layerId]) => {
                  const feature = getFeature(layerId);

                  if (!feature) return null;

                  return (
                    <div
                      key={layerId}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-opacity duration-200 animate-fade-in"
                      style={{
                        animationDelay: `${
                          Object.keys(layers).indexOf(layerId) * 200
                        }ms`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary text-xl">
                          <Layers className="size-6" />
                        </div>
                        <div className="space-y-1">
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-xs font-medium">
                                {layerId.charAt(0).toUpperCase() +
                                  layerId.slice(1).replace(/([A-Z])/g, " $1")}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="w-[400px] h-auto ml-24 text-sm text-justify rounded-lg p-4">
                              <DescriptionCard
                                description={feature?.description || ""}
                              />
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Icon Links */}
                        <div className="flex justify-start items-center gap-1 p-1 rounded-lg shadow-none">
                          {feature.shapefile && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`${openDataUrl}/${feature.shapefile}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-500 rounded-lg"
                                >
                                  <Shapes className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                Shapefile
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {feature.theURL && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={feature.theURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-green-100 text-green-500 rounded-lg"
                                >
                                  <LinkIcon className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                URL
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {feature.ags && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={feature.ags}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-red-100 text-red-500 rounded-full"
                                >
                                  <Webhook className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                REST Service
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {feature.metadata && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`${openDataUrl}/metadata/${feature.metadata}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-yellow-100 text-yellow-600 rounded-full"
                                >
                                  <Info className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                Metadata
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {feature.byod && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`${openDataUrl}/${feature.byod}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-purple-100 text-purple-500 rounded-lg"
                                >
                                  <HardDrive className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                BYO Drive
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {feature.pdf && (
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`${openDataUrl}/${feature.pdf}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-600 rounded-md"
                                >
                                  <FileText className="w-5 h-5" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                Download PDF File
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {(feature.updated ||
                            feature.size ||
                            feature.source) && (
                            <Tooltip>
                              <TooltipTrigger>
                                <span 
                                  className="flex items-center justify-center w-7 h-7 bg-cyan-100 text-cyan-600 rounded-md">
                                  <Calendar1Icon className="w-5 h-5" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                                <div className="grid grid-cols-1 border-none">
                                  {feature.updated && (
                                    <div>
                                      {"Last update : "}
                                      {feature.updated}
                                    </div>
                                  )}
                                  {feature.size && (
                                    <div>
                                      {"Size : "}
                                      {feature.size}
                                    </div>
                                  )}
                                  {feature.source && (
                                    <div>
                                      {"Source : "}
                                      {feature.source}
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <Switch
                              checked={layers[layerId]}
                              onCheckedChange={(checked) =>
                                toggleLayer(layerId, checked)
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                            Add / Remove
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      );

    case "Data":
      return (
        <div
          className={cn(
            "px-0 py-2 space-y-0 grid grid-cols-1 sm:grid-cols-1 gap-2",
            className
          )}
          {...props}
        >
          {/* Searchbar */}
          <div className="sticky top-2 mb-2">
            <Button
              variant="outline"
              className="absolute m-0 p-2 border-none rounded-lg left-0 top-1/2 transform -translate-y-1/2 bg-amber-100 text-gray-500 hover:text-gray-700"
            >
              {"Search :"}
            </Button>
            <Input
              type="text"
              className="w-full py-2 pl-20 border rounded-lg bg-white focus:outline-none focus:ring placeholder:text-sky-700 placeholder:pl-0 placeholder:text-xs placeholder:font-semibold"
              placeholder={searchDataPlaceholder}
              value={searchDataTerm}
              onChange={(e) => setSearchDataTerm(e.target.value)}
            />
            {searchDataTerm && (
              <Button
                variant="ghost"
                onClick={() => setSearchDataTerm("")} // Clear the input field
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-5 h-5" color="#ea5d5d" />
              </Button>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-148px)]">
            <div className="flex flex-col text-center rounded-md p-2 lg:p-4 gap-4 items-center">
              {filteredDataItems.map((item, index) => (
                <Card
                  key={index}
                  className={cn(
                    "flex flex-col rounded-lg border-t",
                    "bg-gradient-to-b from-muted/60 to-muted/20",
                    "p-0 text-start sm:p-0",
                    "hover:from-muted/60 hover:to-muted/20",
                    "transition-colors duration-300",
                    className
                  )}
                >
                  <CardHeader className="flex m-0 p-3">
                    <CardTitle className="flex flex-1 justify-between text-gray-800">
                      <div className="flex flex-start text-base font-semibold">
                        {item?.title}
                      </div>
                      <div className="flex gap-1 justify-end">
                        {item?.shapefile && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={`${openDataUrl}/${item?.shapefile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-500 rounded-lg"
                              >
                                <Shapes className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              Shapefile
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item?.theURL && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={item?.theURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-green-100 text-green-500 rounded-lg"
                              >
                                <LinkIcon className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              Link
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item?.metadata && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={`${openDataUrl}/metadata/${item?.metadata}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-yellow-100 text-yellow-600 rounded-full"
                              >
                                <Info className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              Metadata
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item?.byod && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={`${openDataUrl}/${item?.byod}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-purple-100 text-purple-500 rounded-lg"
                              >
                                <HardDrive className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              BYO Drive
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item?.pdf && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={`${openDataUrl}/${item?.pdf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-red-100 text-red-600 rounded-md"
                              >
                                <FileDown className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              PDF
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item?.textfile && (
                          <Tooltip>
                            <TooltipTrigger>
                              <a
                                href={`${openDataUrl}/${item?.textfile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-600 rounded-md"
                              >
                                <FileText className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="w-auto h-auto text-sm text-justify rounded-lg p-2">
                              Text File
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <Separator orientation="horizontal" />

                  <CardContent className="text-sm mt-3 space-y-2 text-justify">
                    <DescriptionCard description={item?.description || ""} />
                  </CardContent>
                  <Separator orientation="horizontal" />
                  <CardFooter className="flex justify-between items-center gap-1 p-3 mx-2 rounded-lg shadow-none">
                    {item?.updated && (
                      <>
                        <Label className="text-xs font-medium text-amber-700">
                          {item?.updated}
                        </Label>
                        <Separator orientation="vertical" />
                      </>
                    )}
                    {item?.size && (
                      <>
                        <Label className="text-xs font-medium text-teal-700">
                          {item?.size}
                        </Label>
                        <Separator orientation="vertical" />
                      </>
                    )}
                    {item?.source && (
                      <Label className="text-xs font-medium text-sky-700">
                        {item?.source}
                      </Label>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      );

    case "Basemaps":
      return (
        <ScrollArea className="h-[calc(100vh-148px)]">
          <Basemaps onBasemapChange={handleBasemapChange} />
        </ScrollArea>
      );

    case "Bookmarks":
      return (
        <ScrollArea className="h-[calc(100vh-148px)]">
          <BookmarksComponent className={className} {...props} />
        </ScrollArea>
      );

    case "Print":
      return (
        <ScrollArea className="h-[calc(100vh-148px)]">
          <PrintComponent activeMenu={activeMenu} />
        </ScrollArea>
      );

    case "About":
      return (
        <ScrollArea className="h-[calc(100vh-148px)] overflow-y-auto">
          <div className="w-full py-4">
            <div className="container mx-auto">
              <div className="flex flex-col text-center rounded-md p-4 lg:p-6 gap-4 items-center">
                {/* Badge Section */}
                <div>
                  <Badge>MeckODV v1.0.0</Badge>
                </div>

                {/* Welcome Text Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base md:text-xl max-w-2xl font-medium tracking-tight">
                    <span className="text-gray-500">Welcome to</span>{" "}
                    Mecklenburg County GIS
                    <span className="text-primary"> Open Data Viewer!</span>
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
                    Mecklenburg County believes in the power of open data and
                    open-source software to inspire creativity, ingenuity, and
                    collaboration. Explore our diverse collection of data,
                    tools, and resources designed to empower you—whether
                    you&rsquo;re a curious resident, researcher, or a developer.
                    <br />
                    <strong>Let&rsquo;s build something amazing!</strong>
                  </p>
                </div>

                {/* Open Data Image */}
                <div className="relative w-full max-w-md h-[220px] md:h-[300px] overflow-hidden">
                  <Image
                    fill
                    src={"/opendata-viewer/images/data.svg"}
                    alt={"Mecklenburg County Open Data"}
                    className="object-contain p-4"
                  />
                </div>

                {/* Open Data Items */}
                <div className="flex flex-col items-start text-start w-full max-w-2xl gap-4">
                  <Badge variant={"outline"} className="text-lg">
                    Data
                  </Badge>
                  <Button
                    variant={"ghost"}
                    className="text-base text-sky-700 hover:text-orange-700"
                  >
                    <Link
                      href="https://en.wikipedia.org/wiki/Open_data"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open data!
                    </Link>
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Accessible",
                        desc: "Open data is accessible to everyone.",
                      },
                      {
                        title: "Open",
                        desc: "Available in open, non-proprietary formats.",
                      },
                      {
                        title: "Transparent",
                        desc: "Fosters transparency in governance.",
                      },
                      {
                        title: "Collaborative",
                        desc: "Encourages innovation across communities.",
                      },
                      {
                        title: "Modifiable",
                        desc: "You can modify and create derivatives.",
                      },
                      {
                        title: "Redistributable",
                        desc: "Allows redistribution of data.",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-4 items-start"
                      >
                        <Check className="w-5 h-5 mt-1 text-primary" />
                        <div className="flex flex-col">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={"https://maps.mecknc.gov/openmapping/data.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant={"outline"}
                      className="bg-gradient-to-r from-[#616161] via-[#6b7280] to-[#374151] text-white"
                    >
                      Go to Data <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Separator */}
                <Separator orientation="horizontal" className="my-6" />

                {/* Open Apps Section */}
                <div className="relative w-full max-w-md h-[220px] md:h-[300px] overflow-hidden">
                  <Image
                    fill
                    src={"/opendata-viewer/images/apps.svg"}
                    alt={"Mecklenburg County Open Apps"}
                    className="object-contain p-4"
                  />
                </div>

                <div className="flex flex-col items-start text-start w-full max-w-2xl gap-4">
                  <Badge variant={"outline"} className="text-lg">
                    Apps
                  </Badge>
                  <h2 className="text-base md:text-lg tracking-tight">
                    <Button
                      variant={"ghost"}
                      className="text-base text-sky-700 hover:text-orange-700"
                    >
                      <Link
                        href="https://en.wikipedia.org/wiki/Open_data"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open-source software
                      </Link>
                    </Button>
                    gives you:
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Freedom",
                        desc: "Run the program for any purpose.",
                      },
                      {
                        title: "Understanding",
                        desc: "Study and modify the program.",
                      },
                      {
                        title: "Sharing",
                        desc: "Redistribute copies to help others.",
                      },
                      {
                        title: "Collaboration",
                        desc: "Share modified versions.",
                      },
                      {
                        title: "Transparency",
                        desc: "Fosters trust through open code.",
                      },
                      {
                        title: "Adaptability",
                        desc: "Customize to meet specific needs.",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-4 items-start"
                      >
                        <Check className="w-5 h-5 mt-1 text-primary" />
                        <div className="flex flex-col">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={"https://maps.mecknc.gov/openmapping/apps.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant={"outline"}
                      className="bg-gradient-to-r from-[#616161] via-[#6b7280] to-[#374151] text-white"
                    >
                      Go to Apps <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      );

    default:
      return null;
  }
}

export const DescriptionCard = ({ description }: { description: string }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div className="description-card">
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
    </div>
  );
};
