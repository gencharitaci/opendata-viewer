'use client';

import { IDataAndFeatureAPI } from '@/types/data';
import { createContext, ReactNode, useContext, useState } from 'react';

export type LayerContextType = {
    layers: { [layerId: string]: boolean };
    features: { [layerId: string]: IDataAndFeatureAPI };
    toggleLayer: (layerId: string, value: boolean) => void;
    setInitialLayers: (layerData: IDataAndFeatureAPI[]) => void;
    getFeature: (layerId: string) => IDataAndFeatureAPI | undefined;
};

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({ children }: { children: ReactNode }) {
    const [layers, setLayers] = useState<LayerContextType['layers']>({});
    const [features, setFeatures] = useState<LayerContextType['features']>({});

    const toggleLayer = (layerId: string, value: boolean) => {
        setLayers((prev) => ({
            ...prev,
            [layerId]: value,
        }));
    };

    const setInitialLayers = (layerData: IDataAndFeatureAPI[]) => {
        if (!Array.isArray(layerData) || layerData.length === 0) {
            console.error('setInitialLayers received invalid layerData:', layerData);
            return;
        }

        // Initialize layers and features
        const initialLayers = layerData.reduce((acc, feature, index) => {
            acc[feature.title] = index >= 1 && index < 2; // Set first 1 layers as active
            return acc;
        }, {} as { [layerId: string]: boolean });

        const initialFeatures = layerData.reduce((acc, feature) => {
            acc[feature.title] = feature;
            return acc;
        }, {} as { [layerId: string]: IDataAndFeatureAPI });

        setLayers(initialLayers);
        setFeatures(initialFeatures);
    };

    const getFeature = (layerId: string): IDataAndFeatureAPI | undefined => {
        return features[layerId];
    };

    return (
        <LayerContext.Provider 
            value={{ layers, features, toggleLayer, setInitialLayers, getFeature }}>
            {children}
        </LayerContext.Provider>
    );
}

export function useLayers() {
    const context = useContext(LayerContext);
    if (context === undefined) {
        throw new Error('useLayers must be used within a LayerProvider');
    }
    return context;
}
