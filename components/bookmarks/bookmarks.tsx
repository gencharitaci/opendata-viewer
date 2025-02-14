'use client';

import { useMap } from "@/contexts/map-context";
import { cn } from "@/lib/utils";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import TimeExtent from '@arcgis/core/time/TimeExtent';
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import { useEffect, useRef } from "react";

type BookmarksProps = React.HTMLAttributes<HTMLDivElement>

export function BookmarksComponent({ className, ...props }: BookmarksProps) {
    const { view } = useMap();
    const bookmarksRef = useRef<Bookmarks | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (view && !bookmarksRef.current && containerRef.current) {
            let bookmarksWidget: Bookmarks | null = null;

            view.when(() => {
                if (!bookmarksRef.current && containerRef.current) {
                    bookmarksWidget = new Bookmarks({
                        view: view,
                        container: containerRef.current,
                        // editingEnabled: true, // DEPRECATED - (removed)
                        dragEnabled: true,
                        visibleElements: {
                            addBookmarkButton: true,
                            editBookmarkButton: true,
                            time: true,
                        }
                    });

                    bookmarksRef.current = bookmarksWidget;

                    const layer = view.map.layers.getItemAt(0) as FeatureLayer;
                    bookmarksWidget.on("bookmark-select", (event) => {
                        const bookmarkName = event.bookmark.name.toUpperCase()
                        layer.featureEffect = new FeatureEffect({
                            filter: new FeatureFilter({
                                where: "Name = '" + bookmarkName + "'",
                                geometry: view.extent,
                                spatialRelationship: "intersects",
                                distance: 0,
                                objectIds: [],
                                timeExtent: new TimeExtent(),
                                units: "meters"
                            }),
                            excludedEffect: "grayscale(100%) opacity(30%)",
                            includedEffect: "none",
                            excludedLabelsVisible: true,
                        });
                    });
                }
            });

            return () => {
                if (bookmarksWidget) {
                    bookmarksWidget.destroy();
                    bookmarksRef.current = null;
                }
            };
        }
    }, [view]);

    return (
        <div className={cn("h-full w-full", className)} {...props}>
            <div
                ref={containerRef}
                className="h-full w-full [&_.esri-bookmarks]:h-full [&_.esri-bookmarks]:w-full [&_.esri-bookmarks]:bg-transparent [&_.esri-bookmarks]:border-0 [&_.esri-bookmarks__loader]:hidden"
                style={{
                    height: 'calc(100vh - 200px)'
                }}
            />
        </div>
    );
} 