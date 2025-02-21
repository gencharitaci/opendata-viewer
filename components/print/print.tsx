'use client';

import { useMap } from "@/contexts/map-context";
import { cn } from "@/lib/utils";
import Print from "@arcgis/core/widgets/Print";
import { useEffect, useRef } from "react";

interface PrintProps extends React.HTMLAttributes<HTMLDivElement> {
    activeMenu: string;
}

export function PrintComponent({ className, activeMenu, ...props }: PrintProps) {
    const { view } = useMap();
    const printRef = useRef<Print | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Destroy existing print widget if menu changes
        if (activeMenu !== 'Print' && printRef.current) {
            printRef.current.destroy();
            printRef.current = null;
            return;
        }

        // Create new print widget only if in Print menu
        if (view && !printRef.current && containerRef.current && activeMenu === 'Print') {
            view.when(() => {
                if (!printRef.current && containerRef.current) {
                    const printWidget = new Print({
                        view: view,
                        container: containerRef.current,
                        // Print service URL
                        printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
                        allowedFormats: ["jpg", "png8", "png32", "pdf"],
                        // Default template options
                        templateOptions: {
                            title: "Mecklenburg County, NC",
                            author: "Adem Kurtipek",
                            copyright: "© 2024",
                            legendEnabled: true,
                            scaleEnabled: true
                        }
                    });

                    printRef.current = printWidget;
                }
            });
        }

        // Cleanup function
        return () => {
            if (printRef.current) {
                printRef.current.destroy();
                printRef.current = null;
            }
        };
    }, [view, activeMenu]);

    // If not in Print menu, don't render anything
    if (activeMenu !== 'Print') return null;

    return (
        <div className={cn("h-full w-full", className)} {...props}>
            <div
                ref={containerRef}
                className="h-full w-full [&_.esri-print]:h-full [&_.esri-print]:w-full [&_.esri-print]:bg-transparent [&_.esri-print]:border-0"
                style={{
                    height: 'calc(100vh - 200px)'
                }}
            />
        </div>
    );
} 