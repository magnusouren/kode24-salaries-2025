import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            'https://www.kode24.no/files/2025/09/01/kode24s%20l%C3%B8nnstall%202025.json'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch data from external source');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching salary data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch salary data' },
            { status: 500 }
        );
    }
}
