"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLayers } from "@/contexts/layer-context";
import { cn } from "@/lib/utils";
import { Map as MapIcon } from "lucide-react";

type NavProps = React.HTMLAttributes<HTMLDivElement>;

export function Nav({ className, ...props }: NavProps) {
  const { layers, toggleLayer } = useLayers();

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div>
        <h4 className="mb-2 text-sm font-medium">Layers</h4>
        <div className="grid gap-1">
          {Object.entries(layers).map(([layerId, isVisible]) => (
            // Warning: In HTML, <button> cannot be a descendant of <button>.
            // This will cause a hydration error. Error Component Stack

            <Button
                key={layerId}
                onClick={() => toggleLayer(layerId, !isVisible)}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex w-full items-center justify-between"
                )}
            >
                <div className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        {isVisible ? 'Hide' : 'Show'} {layerId}
                    </span>
                </div>
                <Switch asChild checked={isVisible} />
            </Button>

            // <div
            //   key={layerId}
            //   className="flex w-full items-center justify-between"
            // >
            //   <Button
            //     onClick={() => toggleLayer(layerId, !isVisible)}
            //     className={cn(
            //       buttonVariants({ variant: "ghost" }),
            //       "flex-1 flex items-center gap-2"
            //     )}
            //   >
            //     <MapIcon className="h-4 w-4" />
            //     <span className="text-sm font-medium">
            //       {isVisible ? "Hide" : "Show"} {layerId}
            //     </span>
            //     <Switch asChild checked={isVisible} />
            //   </Button>
            // </div>
          ))}
        </div>
      </div>
    </div>
  );
}
