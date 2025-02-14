'use client';

import MapView from "@arcgis/core/views/MapView";
import { createContext, useContext, useState } from 'react';

interface MapContextType {
    view: MapView | null;
    setView: (view: MapView) => void;
}

const MapContext = createContext<MapContextType>({
    view: null,
    setView: () => { },
});

export function MapProvider({ children }: { children: React.ReactNode }) {
    const [view, setView] = useState<MapView | null>(null);

    return (
        <MapContext.Provider value={{ view, setView }}>
            {children}
        </MapContext.Provider>
    );
}

export const useMap = () => useContext(MapContext); 