import { NextRequest, NextResponse } from "next/server"

import { getGoogleSheetsData } from "@app/backend/google_sheets";

export const GET = async (req: NextRequest) => {
    const filter = req.nextUrl.searchParams;

    let data = await getGoogleSheetsData();

    const limit = parseInt(filter.get('limit') || '10')
    const skip = parseInt(filter.get('skip') || '0')

    data.sort((a, b) => {
        const sortBy = (filter.get('sortBy') || 'company') as keyof typeof data[number];
        const sortDir = parseInt(filter.get('sortDir') || '-1')
        return a[sortBy].localeCompare(b[sortBy]) * sortDir;
    });
    
    data = data.filter((row) => {
        const query = filter.get('query');
        if (query) {
            if (
                !row.company.toLowerCase().includes(query.toLowerCase()) &&
                !row.product.toLowerCase().includes(query.toLowerCase()) &&
                !row.status.toLowerCase().includes(query.toLowerCase()) &&
                !row.country.toLowerCase().includes(query.toLowerCase()) &&
                !row.efficacy.toLowerCase().includes(query.toLowerCase())
            ) return false;
        }

        const status = filter.get('status')?.split(',');
        if (status && !status.includes(row.status)) {
            return false;
        }

        const country = filter.get('country')?.split(',');
        if (country && !country.includes(row.country)) {
            return false;
        }

        const totalScore = filter.get('totalScore')?.split(',');
        if (totalScore && !totalScore.includes(row.totalScore)) {
            return false;
        }

        return true;
    })

    return NextResponse.json({
        status: 200,
        data: {
            data: data.slice(skip, skip + limit),
            count: data.length,
            limit,
            skip
        }
    })
}