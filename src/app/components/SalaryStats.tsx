import { SalaryData } from '../page';

interface SalaryStatsProps {
    data: SalaryData[];
}

export default function SalaryStats({ data }: SalaryStatsProps) {
    if (data.length === 0) {
        return (
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>Statistikk</h2>
                <p>Ingen data å vise</p>
            </div>
        );
    }

    const salaries = data.map((item) => item.lønn);
    const avgSalary = Math.round(
        salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
    );
    const medianSalary = Math.round(
        salaries.sort((a, b) => a - b)[Math.floor(salaries.length / 2)]
    );
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    const genderDistribution = data.reduce((acc, item) => {
        acc[item.kjønn] = (acc[item.kjønn] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topFieldsCount = data.reduce((acc, item) => {
        acc[item.fag] = (acc[item.fag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topFields = Object.entries(topFieldsCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className='bg-white shadow rounded-lg p-6'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold mb-3'>
                    📊 Lønnsstatistikk oversikt
                </h2>
                <p className='text-gray-600 text-sm mb-4'>
                    Generell statistikk for alle stillinger i undersøkelsen.
                    Disse tallene gir deg en oversikt over lønnslandskapet i
                    norsk IT-bransje basert på {data.length.toLocaleString()}{' '}
                    respondenter.
                </p>
                <div className='bg-gray-50 rounded-lg p-3 text-xs text-gray-600'>
                    <strong>Forklaring:</strong> Gjennomsnitt viser det
                    aritmetiske snittet av alle lønninger, mens median viser
                    midtpunktet hvor 50% tjener mer og 50% tjener mindre.
                </div>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-blue-800'>
                        Totalt antall respondenter
                    </h3>
                    <p className='text-2xl font-bold text-blue-600'>
                        {data.length.toLocaleString()}
                    </p>
                    <p className='text-xs text-blue-600'>
                        IT-profesjonelle i Norge
                    </p>
                </div>

                <div className='bg-green-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-green-800'>
                        Gjennomsnittlig årslønn
                    </h3>
                    <p className='text-2xl font-bold text-green-600'>
                        {avgSalary.toLocaleString()} kr
                    </p>
                    <p className='text-xs text-green-600'>
                        Bruttolønn før skatt
                    </p>
                </div>

                <div className='bg-purple-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-purple-800'>
                        Median årslønn
                    </h3>
                    <p className='text-2xl font-bold text-purple-600'>
                        {medianSalary.toLocaleString()} kr
                    </p>
                    <p className='text-xs text-purple-600'>
                        50% tjener mer/mindre
                    </p>
                </div>

                <div className='bg-orange-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-orange-800'>
                        Lønnsområde (min-maks)
                    </h3>
                    <p className='text-lg font-bold text-orange-600'>
                        {minSalary.toLocaleString()} -{' '}
                        {maxSalary.toLocaleString()} kr
                    </p>
                    <p className='text-xs text-orange-600'>
                        Laveste til høyeste lønn
                    </p>
                </div>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
                <div>
                    <h3 className='font-semibold mb-2'>👥 Kjønnsfordeling</h3>
                    <p className='text-sm text-gray-600 mb-3'>
                        Fordelingen av menn og kvinner i IT-bransjen basert på
                        undersøkelsen.
                    </p>
                    <div className='space-y-2'>
                        {Object.entries(genderDistribution).map(
                            ([gender, count]) => (
                                <div
                                    key={gender}
                                    className='flex justify-between'
                                >
                                    <span className='capitalize'>
                                        {gender}:
                                    </span>
                                    <span className='font-semibold'>
                                        {count} (
                                        {Math.round(
                                            (count / data.length) * 100
                                        )}
                                        %)
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div>
                    <h3 className='font-semibold mb-2'>
                        🔥 Mest populære fagområder
                    </h3>
                    <p className='text-sm text-gray-600 mb-3'>
                        De 5 fagområdene med flest respondenter i undersøkelsen.
                    </p>
                    <div className='space-y-2'>
                        {topFields.map(([field, count]) => (
                            <div key={field} className='flex justify-between'>
                                <span className='truncate'>{field}:</span>
                                <span className='font-semibold ml-2'>
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
