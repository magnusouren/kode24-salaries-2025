import { SalaryData, FilterState } from '../types';

interface SalaryFiltersProps {
    data: SalaryData[];
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

export default function SalaryFilters({
    data,
    filters,
    onFiltersChange,
}: SalaryFiltersProps) {
    // Get unique values for dropdowns
    const uniqueGenders = [...new Set(data.map((item) => item.kjønn))].sort();
    const uniqueFields = [...new Set(data.map((item) => item.fag))].sort();
    const uniqueLocations = [
        ...new Set(data.map((item) => item.arbeidssted)),
    ].sort();
    const uniqueJobTypes = [
        ...new Set(data.map((item) => item.jobbtype)),
    ].sort();

    const handleFilterChange = (
        key: keyof FilterState,
        value: string | number
    ) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    const resetFilters = () => {
        onFiltersChange({
            kjønn: '',
            fag: '',
            arbeidssted: '',
            jobbtype: '',
            minSalary: 0,
            maxSalary: 3000000,
            minExperience: 0,
            maxExperience: 50,
        });
    };

    return (
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
            <div className='mb-6'>
                <div className='flex justify-between items-center mb-3'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                        🔍 Filtrer og tilpass data
                    </h2>
                    <button
                        onClick={resetFilters}
                        className='px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors'
                    >
                        Nullstill filtre
                    </button>
                </div>
                <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                    Bruk filtrene under for å tilpasse datavisningen til dine
                    interesser. Du kan kombinere flere filtre for å finne
                    spesifikke lønnsdata som er relevante for deg.
                </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Kjønn
                    </label>
                    <select
                        value={filters.kjønn}
                        onChange={(e) =>
                            handleFilterChange('kjønn', e.target.value)
                        }
                        className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    >
                        <option value=''>Alle</option>
                        {uniqueGenders.map((gender) => (
                            <option
                                key={gender}
                                value={gender}
                                className='capitalize'
                            >
                                {gender}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Fagområde
                    </label>
                    <select
                        value={filters.fag}
                        onChange={(e) =>
                            handleFilterChange('fag', e.target.value)
                        }
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    >
                        <option value=''>Alle</option>
                        {uniqueFields.map((field) => (
                            <option key={field} value={field}>
                                {field}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Arbeidssted
                    </label>
                    <select
                        value={filters.arbeidssted}
                        onChange={(e) =>
                            handleFilterChange('arbeidssted', e.target.value)
                        }
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    >
                        <option value=''>Alle</option>
                        {uniqueLocations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Jobbtype
                    </label>
                    <select
                        value={filters.jobbtype}
                        onChange={(e) =>
                            handleFilterChange('jobbtype', e.target.value)
                        }
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    >
                        <option value=''>Alle</option>
                        {uniqueJobTypes.map((jobType) => (
                            <option key={jobType} value={jobType}>
                                {jobType}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Lønnsområde (kr)
                    </label>
                    <div className='flex gap-2'>
                        <input
                            type='number'
                            placeholder='Min'
                            value={filters.minSalary}
                            onChange={(e) =>
                                handleFilterChange(
                                    'minSalary',
                                    Number(e.target.value)
                                )
                            }
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                        <input
                            type='number'
                            placeholder='Max'
                            value={filters.maxSalary}
                            onChange={(e) =>
                                handleFilterChange(
                                    'maxSalary',
                                    Number(e.target.value)
                                )
                            }
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Års erfaring
                    </label>
                    <div className='flex gap-2'>
                        <input
                            type='number'
                            placeholder='Min'
                            value={filters.minExperience}
                            onChange={(e) =>
                                handleFilterChange(
                                    'minExperience',
                                    Number(e.target.value)
                                )
                            }
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                        <input
                            type='number'
                            placeholder='Max'
                            value={filters.maxExperience}
                            onChange={(e) =>
                                handleFilterChange(
                                    'maxExperience',
                                    Number(e.target.value)
                                )
                            }
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
