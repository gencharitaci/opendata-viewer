/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDataAndFeatureAPI } from '@/types/data';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {
    const openDataUrl = `${process.env.MECKGIS_OPENDATA_JSON}`;

    try {
        const res = await fetch(openDataUrl);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const data: IDataAndFeatureAPI[] = await res.json();

        // Filter for objects containing the `ags` key
        const filteredData = data.filter((item) => item.ags);

        return NextResponse.json(filteredData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch or process data' }, { status: 500 });
    }
}
