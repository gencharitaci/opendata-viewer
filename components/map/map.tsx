'use client';

import { useLayers } from '@/contexts/layer-context';
import { useMap } from '@/contexts/map-context';
import { cn } from "@/lib/utils";
import { IDataAndFeatureAPI } from "@/types/data";
import '@arcgis/core/assets/esri/themes/light/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Compass from "@arcgis/core/widgets/Compass";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import Home from "@arcgis/core/widgets/Home";
import Locate from "@arcgis/core/widgets/Locate";
import Zoom from "@arcgis/core/widgets/Zoom";
import { useEffect, useRef, useState } from 'react';
import { Announcement } from '../announcement/announcement';
import { Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


type MapComponentProps = React.HTMLAttributes<HTMLDivElement>

export function MapComponent({ className, ...props }: MapComponentProps) {
    const mapDiv = useRef<HTMLDivElement>(null);
    const { layers, setInitialLayers } = useLayers();
    const layerRefs = useRef<{ [key: string]: GraphicsLayer | FeatureLayer | MapImageLayer }>({});
    const { setView } = useMap();
    const [featureData, setFeatureData] = useState<IDataAndFeatureAPI[]>([]);
    const mapViewRef = useRef<MapView | null>(null); 

    const [showAnnouncement, setShowAnnouncement] = useState(true);
    const isMobile = useIsMobile();


    useEffect(() => {
        const fetchLayers = async () => {
            try {
                const response = await fetch('/opendata-viewer/api/opendata/features');
                if (!response.ok) throw new Error('Failed to fetch feature layers');

                const features: IDataAndFeatureAPI[] = await response.json();

                setInitialLayers(features); 
                setFeatureData(features);
            } catch (error) {
                console.error('Error fetching features:', error);
            }
        };

        let isMounted = true;

        if (isMounted) {
            fetchLayers();
        }

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 


    useEffect(() => {
        if (mapDiv.current) {
            const map = new Map({
                basemap: "topo-vector"
            });

            const view = new MapView({
                container: mapDiv.current,
                map: map,
                zoom: 12,
                center: [-80.843127, 35.227085],
                popup: {
                    dockEnabled: true,
                    dockOptions: {
                        buttonEnabled: true,
                        breakpoint: false,
                        position: "bottom-right",
                    },
                },
            });

            mapViewRef.current = view; 
            setView(view);

            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.className = 'absolute left-0 top-0 h-full w-12 bg-white flex flex-col items-center gap-2 pt-2';
            mapDiv.current.appendChild(widgetContainer);

            // Create containers for each widget
            const homeContainer = document.createElement('div');
            const zoomContainer = document.createElement('div');
            const locateContainer = document.createElement('div');
            const compassContainer = document.createElement('div');
            const fullscreenContainer = document.createElement('div');

            // Add containers to widget container
            [homeContainer, zoomContainer, locateContainer, compassContainer, fullscreenContainer].forEach(container => {
                widgetContainer.appendChild(container);
            });
            const home = new Home({
                view: view,
                container: homeContainer
            });
            const zoom = new Zoom({
                view: view,
                container: zoomContainer
            });
            const locate = new Locate({
                view: view,
                container: locateContainer
            });
            const compass = new Compass({
                view: view,
                container: compassContainer
            });
            const fullscreen = new Fullscreen({
                view: view,
                container: fullscreenContainer,
                element: mapDiv.current
            });

            // Cleanup
            return () => {
                if (view) {
                    view.ui.remove(zoom);
                    view.ui.remove(home);
                    view.ui.remove(locate);
                    view.ui.remove(compass);
                    view.ui.remove(fullscreen);
                }
            };
        }
    }, [setView]);


    useEffect(() => {
        if (mapViewRef.current) {
            const map = mapViewRef.current.map;

            Object.entries(layers).forEach(([layerId, isVisible]) => {
                if (isVisible && !layerRefs.current[layerId]) {
                    const feature = featureData.find((f) => f.title === layerId);
                    if (feature && feature.ags) {

                        const isFeatureServer = feature.ags.includes("/FeatureServer");
                        const isMapServer = feature.ags.includes("/MapServer");

                        let serviceUrl = feature.ags;

                        // If it's a MapServer with a layer index (e.g., "/0"), remove the index
                        if (isMapServer && /\d+$/.test(serviceUrl.split("/").pop() || "")) {
                            serviceUrl = serviceUrl.substring(0, serviceUrl.lastIndexOf("/"));
                        }

                        let newLayer;
                        if (isFeatureServer) {
                            newLayer = new FeatureLayer({
                                url: feature.ags, 
                                id: layerId,
                                title: feature.title,
                                visible: true,
                                outFields: ["*"], 
                                popupTemplate: {
                                    title: feature.title,
                                    content: (f: { graphic: { attributes: Record<string, unknown> } }) => {
                                        const attributes = f.graphic?.attributes || {};

                                        const cardContent = `
                                            <div style="width: 100%; overflow: hidden;">
                                                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; text-align: left;">
                                                    <tbody>
                                                        <!-- Description Row -->
                                                        <tr>
                                                            <td
                                                                style="padding: 8px; text-align: justify;"
                                                                colspan="2"
                                                            >
                                                                ${feature.description || "No description available"}
                                                            </td>
                                                        </tr>
                                                        <!-- Title Row -->
                                                        <tr>
                                                            <td style="
                                                                background: linear-gradient(45deg, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); 
                                                                text-align: justify; 
                                                                padding: 8px; 
                                                                font-weight: bold; 
                                                                border: 1px dashed #ddd;"  
                                                                colspan="2"
                                                            >
                                                                Feature Details:
                                                            </td>
                                                        </tr>
                                                        <!-- Attribute Rows -->
                                                        ${Object.entries(attributes)
                                                .map(([fieldName, value]) => {
                                                    if (fieldName && value && String(value).trim() !== "") {
                                                        return `
                                                                        <tr>
                                                                            <td style="background: linear-gradient(45deg, rgba(252,255,244,1) 0%,rgba(233,233,206,1) 100%); padding: 8px; font-weight: bold; border: 0.25px dashed #ddd;">
                                                                                ${fieldName}
                                                                            </td>
                                                                            <td style="padding: 8px; border-bottom: 0.5px dashed #ddd; border-right: 0.5px dashed #ddd;">
                                                                                ${value}
                                                                            </td>
                                                                        </tr>`;
                                                    }
                                                    return ""; 
                                                })
                                                .join("")}
                                                    </tbody>
                                                </table>
                                            </div>
                                        `;

                                        return cardContent;

                                    },
                                },
                            });
                        } else if (isMapServer) {
                            newLayer = new MapImageLayer({
                                url: serviceUrl,
                                id: layerId,
                                title: feature.title,
                                visible: true,
                            });
                        }

                        if (newLayer) {
                            map.add(newLayer);
                            layerRefs.current[layerId] = newLayer;
                        }
                    }
                }

                if (!isVisible && layerRefs.current[layerId]) {
                    const layer = layerRefs.current[layerId];
                    map.remove(layer);
                    delete layerRefs.current[layerId];
                }
            });

        }
    }, [layers, featureData]);

    useEffect(() => {
        Object.entries(layers).forEach(([layerId, visible]) => {
            const layer = layerRefs.current[layerId];
            if (layer) {
                layer.visible = visible;
            }
        });
    }, [layers]);

    return (
        <div className={cn("w-full h-full relative", className)} {...props}>
            <div ref={mapDiv} className="w-full h-full" />

            <div className={`absolute 
                ${isMobile ? 'w-[90vw] top-2 left-11' : 'w-[30vw] top-2 right-2'}`}>
                  {/* Announcement - Map overlay */}
                  <Announcement
                    showAnnouncement={showAnnouncement}
                    onHide={() => setShowAnnouncement(false)}
                    icon={<Info className="m-px h-4 w-4 text-sky-700" />}
                    title={"Note:"}
                    description={
                      "Click on Map Layer Elements when “Turned On” to see available information."
                    }
                  />
                </div>
                
        </div>
    );
} 