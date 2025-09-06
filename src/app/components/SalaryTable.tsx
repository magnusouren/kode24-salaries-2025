import { useState } from 'react';
import { SalaryData } from '../page';

interface SalaryTableProps {
    data: SalaryData[];
    totalCount: number;
}

export default function SalaryTable({ data, totalCount }: SalaryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [sortField, setSortField] = useState<keyof SalaryData | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Sort data
    const sortedData = [...data];
    if (sortField) {
        sortedData.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (sortDirection === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSort = (field: keyof SalaryData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getSortIcon = (field: keyof SalaryData) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    if (data.length === 0) {
        return (
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>Lønnsdata</h2>
                <p>Ingen data matcher de valgte filtrene.</p>
            </div>
        );
    }

    return (
        <div className='bg-white shadow rounded-lg'>
            <div className='p-6 border-b'>
                <div className='mb-4'>
                    <h2 className='text-2xl font-bold mb-2'>
                        📋 Detaljert lønnsdata
                    </h2>
                    <p className='text-gray-600 text-sm mb-3'>
                        Komplett oversikt over alle lønnsoppgaver som matcher
                        dine filtere. Klikk på kolonneoverskriftene for å
                        sortere dataene.
                    </p>
                    <div className='bg-gray-50 rounded-lg p-3 text-xs text-gray-700'>
                        <strong>Viser:</strong> {data.length.toLocaleString()}{' '}
                        av totalt {totalCount.toLocaleString()} oppføringer
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div></div> {/* Spacer */}
                    <div className='flex items-center gap-2'>
                        <label className='text-sm font-medium'>Vis:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                handleItemsPerPageChange(Number(e.target.value))
                            }
                            className='p-1 border border-gray-300 rounded'
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className='text-sm'>per side</span>
                    </div>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('kjønn')}
                            >
                                Kjønn {getSortIcon('kjønn')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('års utdanning')}
                            >
                                Utdanning {getSortIcon('års utdanning')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('års erfaring')}
                            >
                                Erfaring {getSortIcon('års erfaring')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('arbeidssted')}
                            >
                                Arbeidssted {getSortIcon('arbeidssted')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('jobbtype')}
                            >
                                Jobbtype {getSortIcon('jobbtype')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('fag')}
                            >
                                Fagområde {getSortIcon('fag')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('lønn')}
                            >
                                Lønn {getSortIcon('lønn')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() => handleSort('inkludert bonus?')}
                            >
                                Bonus {getSortIcon('inkludert bonus?')}
                            </th>
                            <th
                                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                                onClick={() =>
                                    handleSort('inkludert provisjon?')
                                }
                            >
                                Provisjon {getSortIcon('inkludert provisjon?')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {paginatedData.map((item, index) => (
                            <tr key={index} className='hover:bg-gray-50'>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    <span className='capitalize'>
                                        {item.kjønn}
                                    </span>
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    {item['års utdanning']} år
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    {item['års erfaring']} år
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    {item.arbeidssted}
                                </td>
                                <td className='px-4 py-4 text-sm'>
                                    <div
                                        className='max-w-xs truncate'
                                        title={item.jobbtype}
                                    >
                                        {item.jobbtype}
                                    </div>
                                </td>
                                <td className='px-4 py-4 text-sm'>
                                    <div
                                        className='max-w-xs truncate'
                                        title={item.fag}
                                    >
                                        {item.fag}
                                    </div>
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                                    {item.lønn.toLocaleString()} kr
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            item['inkludert bonus?']
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {item['inkludert bonus?']
                                            ? 'Ja'
                                            : 'Nei'}
                                    </span>
                                </td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            item['inkludert provisjon?']
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {item['inkludert provisjon?']
                                            ? 'Ja'
                                            : 'Nei'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='px-6 py-4 border-t flex items-center justify-between'>
                    <div className='text-sm text-gray-700'>
                        Viser {startIndex + 1} til{' '}
                        {Math.min(startIndex + itemsPerPage, data.length)} av{' '}
                        {data.length} resultater
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                        >
                            Forrige
                        </button>
                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 border rounded ${
                                            currentPage === page
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                        )}
                        {totalPages > 5 && (
                            <>
                                <span className='px-3 py-1'>...</span>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === totalPages
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                        >
                            Neste
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
