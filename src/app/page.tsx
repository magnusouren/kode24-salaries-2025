'use client';

import { useState, useEffect, useCallback } from 'react';
import SalaryTable from './components/SalaryTable';
import SalaryStats from './components/SalaryStats';
import SalaryFilters from './components/SalaryFilters';
import EntryLevelInsights from './components/EntryLevelInsights';
import SalaryCharts from './components/SalaryCharts';
import CareerProgression from './components/CareerProgression';

export interface SalaryData {
    kjønn: string;
    'års utdanning': number;
    'års erfaring': number;
    arbeidssted: string;
    jobbtype: string;
    fag: string;
    lønn: number;
    'inkludert bonus?': boolean;
    'inkludert provisjon?': boolean;
}

export interface FilterState {
    kjønn: string;
    fag: string;
    arbeidssted: string;
    jobbtype: string;
    minSalary: number;
    maxSalary: number;
    minExperience: number;
    maxExperience: number;
}

export default function Home() {
    const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
    const [filteredData, setFilteredData] = useState<SalaryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        kjønn: '',
        fag: '',
        arbeidssted: '',
        jobbtype: '',
        minSalary: 0,
        maxSalary: 3000000,
        minExperience: 0,
        maxExperience: 50,
    });

    useEffect(() => {
        fetchSalaryData();
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = [...salaryData];

        if (filters.kjønn) {
            filtered = filtered.filter((item) => item.kjønn === filters.kjønn);
        }
        if (filters.fag) {
            filtered = filtered.filter((item) => item.fag === filters.fag);
        }
        if (filters.arbeidssted) {
            filtered = filtered.filter(
                (item) => item.arbeidssted === filters.arbeidssted
            );
        }
        if (filters.jobbtype) {
            filtered = filtered.filter(
                (item) => item.jobbtype === filters.jobbtype
            );
        }

        filtered = filtered.filter(
            (item) =>
                item.lønn >= filters.minSalary &&
                item.lønn <= filters.maxSalary &&
                item['års erfaring'] >= filters.minExperience &&
                item['års erfaring'] <= filters.maxExperience
        );

        setFilteredData(filtered);
    }, [salaryData, filters]);

    useEffect(() => {
        applyFilters();
    }, [salaryData, filters, applyFilters]);

    const fetchSalaryData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/salaries');
            if (!response.ok) {
                throw new Error('Failed to fetch salary data');
            }
            const data = await response.json();
            setSalaryData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-xl'>Loading salary data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-xl text-red-600'>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <header className='mb-12'>
                <h1 className='text-4xl font-bold text-center mb-4'>
                    Kode24 Lønnstall 2025
                </h1>
                <p className='text-center text-gray-600 text-lg mb-6'>
                    Utforsk lønnsdata for IT-bransjen i Norge
                </p>

                {/* Descriptive introduction */}
                <div className='mx-auto bg-blue-50 rounded-lg p-6 mb-8'>
                    <h2 className='text-xl font-semibold mb-4 text-blue-800'>
                        📊 Om denne lønnsundersøkelsen
                    </h2>
                    <div className='grid md:grid-cols-2 gap-6 text-sm text-blue-700'>
                        <div>
                            <p className='mb-3'>
                                Denne undersøkelsen inneholder lønnsdata fra{' '}
                                <strong>IT-profesjonelle i Norge</strong>
                                og gir deg innsikt i hva du kan forvente å tjene
                                basert på erfaring, utdanning, fagområde og
                                arbeidssted.
                            </p>
                            <p>
                                Data er spesielt nyttig for{' '}
                                <strong>studenter</strong> og{' '}
                                <strong>nyutdannede</strong>
                                som planlegger sin karriere i teknologibransjen.
                            </p>
                        </div>
                        <div>
                            <h3 className='font-medium mb-2'>
                                🔍 Viktige definisjoner:
                            </h3>
                            <ul className='space-y-1'>
                                <li>
                                    <strong>Entry-level:</strong> 0-2 års
                                    erfaring
                                </li>
                                <li>
                                    <strong>Nyutdannet:</strong> 0 års
                                    yrkeserfaring
                                </li>
                                <li>
                                    <strong>Junior:</strong> 1-3 års erfaring
                                </li>
                                <li>
                                    <strong>Senior:</strong> 5+ års erfaring
                                </li>
                                <li>
                                    <strong>Lønn:</strong> Årlig bruttolønn i
                                    NOK
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <div className='grid gap-8'>
                <SalaryStats data={filteredData} />

                <EntryLevelInsights data={filteredData} />

                <SalaryFilters
                    data={salaryData}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <SalaryCharts data={filteredData} />

                <CareerProgression data={filteredData} />

                <SalaryTable
                    data={filteredData}
                    totalCount={salaryData.length}
                />
            </div>
        </div>
    );
}
