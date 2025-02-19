/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDataAndFeatureAPI } from '@/types/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const openDataUrl = `${process.env.NEXT_PUBLIC_MECK_OPENDATA}/data.json`;

    if (!openDataUrl) {
        return NextResponse.json({ 
            error: 'Environment variable does not set correctly' 
        }, { 
            status: 500 
        });
    }

    try {
        const response = await fetch(openDataUrl, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: IDataAndFeatureAPI[] = await response.json();

        // Filter for objects not containing the `ags` key
        const filteredData = data.filter((item) => !item.ags);

        if (filteredData.length === 0) {
            throw new Error('No valid data found in the response');
        }

        return NextResponse.json(filteredData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch or process data' }, { status: 500 });
    }
}
