"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

// Basemap Types enum
const BasemapTypes = {
  MeckBasemap: "meck-basemap",
  MeckVectorAerial: "meck-vector-aerial",
  MeckTopoHillShade: "meck-topo-hillshade",
  MeckVectorGrayscale: "meck-vector-grayscale",
  MeckVector: "meck-vector",
  // Standard ArcGIS basemaps
  Topo: "topo-vector",
  Streets: "streets-vector",
  Satellite: "satellite",
  Hybrid: "hybrid",
  DarkGray: "dark-gray-vector",
  Gray: "gray-vector",
  Navigation: "streets-navigation-vector",
  OSM: "osm",
} as const;


const arcgisBasemaps = [
  {
    id: BasemapTypes.MeckBasemap,
    name: "Meck Basemap",
    thumbnail: "/opendata-viewer/basemaps/meck-basemap.png",
    preview: "Mecklenburg County standard basemap",
    url: "https://meckgis.mecklenburgcountync.gov/server/rest/services/Basemap/Basemap/MapServer",
  },
  {
    id: BasemapTypes.MeckVectorAerial,
    name: "Meck Aerial",
    thumbnail: "/opendata-viewer/basemaps/meck-aerial.png",
    preview: "Mecklenburg County aerial imagery",
    url: "https://meckgis.mecklenburgcountync.gov/server/rest/services/Basemap/BasemapAerial/MapServer",
  },
  {
    id: BasemapTypes.MeckTopoHillShade,
    name: "Meck Topo",
    thumbnail: "/opendata-viewer/basemaps/meck-topo.png",
    preview: "Mecklenburg County topographic map with hillshade",
    url: "https://meckgis.mecklenburgcountync.gov/server/rest/services/Basemap/TopoHillShade/MapServer",
  },
  {
    id: BasemapTypes.MeckVectorGrayscale,
    name: "Meck Grayscale",
    thumbnail: "/opendata-viewer/basemaps/meck-grayscale.png",
    preview: "Mecklenburg County vector basemap in grayscale",
    url: "https://meckgis.mecklenburgcountync.gov/server/rest/services/Basemap/VectorBasemapGrayscale/MapServer",
  },
  {
    id: BasemapTypes.MeckVector,
    name: "Meck Vector",
    thumbnail: "/opendata-viewer/basemaps/meck-vector.png",
    preview: "Mecklenburg County vector basemap",
    url: "https://meckgis.mecklenburgcountync.gov/server/rest/services/Basemap/VectorBasemap/MapServer",
  },
  // Standard ArcGIS basemaps
  {
    id: BasemapTypes.Topo,
    name: "Topographic",
    thumbnail: "/opendata-viewer/basemaps/topo.png",
    preview: "Detailed terrain and natural features",
  },
  {
    id: BasemapTypes.Streets,
    name: "Streets",
    thumbnail: "/opendata-viewer/basemaps/streets.png",
    preview: "Detailed street map",
  },
  {
    id: BasemapTypes.Satellite,
    name: "Satellite",
    thumbnail: "/opendata-viewer/basemaps/satellite.png",
    preview: "Aerial imagery without labels",
  },
  {
    id: BasemapTypes.Hybrid,
    name: "Hybrid",
    thumbnail: "/opendata-viewer/basemaps/hybrid.png",
    preview: "Aerial imagery with labels",
  },
  {
    id: BasemapTypes.DarkGray,
    name: "Dark Gray",
    thumbnail: "/opendata-viewer/basemaps/dark-gray.png",
    preview: "Dark themed map for data visualization",
  },
  {
    id: BasemapTypes.Gray,
    name: "Light Gray",
    thumbnail: "/opendata-viewer/basemaps/light-gray.png",
    preview: "Light themed map for data visualization",
  },
  {
    id: BasemapTypes.Navigation,
    name: "Navigation",
    thumbnail: "/opendata-viewer/basemaps/navigation.png",
    preview: "Navigation focused map",
  },
];

interface BasemapsProps extends React.HTMLAttributes<HTMLDivElement> {
  onBasemapChange?: (basemapId: string, url?: string) => void;
}

export function Basemaps({
  className,
  onBasemapChange,
  ...props
}: BasemapsProps) {
  const [activeBasemap, setActiveBasemap] = useState(arcgisBasemaps[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleBasemapChange = (basemap: (typeof arcgisBasemaps)[0]) => {
    if (isLoading || isTransitioning) return;

    setIsLoading(true);
    setIsTransitioning(true);
    console.log("Switching to basemap:", basemap.name);

    // Emit the basemap change event with URL if it's a Meck basemap
    onBasemapChange?.(basemap.id, basemap.url);
    setActiveBasemap(basemap.id);

    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);

      // Keep transition state for a bit longer for smooth animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  };

  return (
    <div className={cn("px-4 py-2 space-y-4", className)} {...props}>
      <div className="grid grid-cols-3 gap-2">
        {arcgisBasemaps.map((basemap) => (
          <Button
            key={basemap.id}
            className={cn(
              "h-full w-full p-0",
              "bg-background/50 border border-foreground/10 text-foreground/90", 
              "group relative flex flex-col items-center rounded-lg border overflow-hidden",
              "transition-all duration-300 ease-in-out transform",
              activeBasemap === basemap.id
                ? "ring-2 ring-primary border-primary scale-[1.02]"
                : "hover:border-primary/50 hover:scale-[1.01]",
              (isLoading || isTransitioning) && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleBasemapChange(basemap)}
            disabled={isLoading || isTransitioning}
          >
            <div className="relative w-full pt-[56.25%] bg-muted">
              <div className="absolute inset-0">
                {/* Fallback emoji while image loads */}
                <div className="absolute inset-0 flex items-center justify-center text-2xl bg-secondary">
                  {basemap.id.includes("aerial") ? "🛰️" : "🗺️"}
                </div>

                <Image
                  src={basemap.thumbnail}
                  alt={basemap.name}
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={isTransitioning ? false : true} 
                  className={cn(
                    "object-cover",
                    "transition-opacity duration-200",
                    isTransitioning ? "opacity-50" : "opacity-100"
                  )}
                />
              </div>
            </div>
            <div
              className={cn(
                "w-full p-2 text-center text-sm font-medium",
                "transition-colors duration-200",
                activeBasemap === basemap.id
                  ? "bg-primary/5"
                  : "group-hover:bg-primary/5"
              )}
            >
              <div className="text-xs">{basemap.name}</div>
              {isLoading && activeBasemap === basemap.id && (
                <div className="text-xs text-muted-foreground animate-pulse">
                  <span className="font-semibold text-sky-600">
                    Loading {basemap.name}
                    <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 font-bold text-3xl"
                  >
                    <circle cx="4" cy="12" r="2" fill="currentColor">
                      <animate
                        id="spinner_qFRN"
                        begin="0;spinner_OcgL.end+0.25s"
                        attributeName="cy"
                        calcMode="spline"
                        dur="0.6s"
                        values="12;6;12"
                        keySplines=".33,.66,.66,1;.33,0,.66,.33"
                      />
                    </circle>
                    <circle cx="12" cy="12" r="2" fill="currentColor">
                      <animate
                        begin="spinner_qFRN.begin+0.1s"
                        attributeName="cy"
                        calcMode="spline"
                        dur="0.6s"
                        values="12;6;12"
                        keySplines=".33,.66,.66,1;.33,0,.66,.33"
                      />
                    </circle>
                    <circle cx="20" cy="12" r="2" fill="currentColor">
                      <animate
                        id="spinner_OcgL"
                        begin="spinner_qFRN.begin+0.2s"
                        attributeName="cy"
                        calcMode="spline"
                        dur="0.6s"
                        values="12;6;12"
                        keySplines=".33,.66,.66,1;.33,0,.66,.33"
                      />
                    </circle>
                  </svg>
                    </span>
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Current Basemap:{" "}
          {arcgisBasemaps.find((b) => b.id === activeBasemap)?.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {arcgisBasemaps.find((b) => b.id === activeBasemap)?.preview}
        </div>
      </div>
    </div>
  );
}
