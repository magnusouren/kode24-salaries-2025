import { SalaryData } from '../page';

interface SalaryChartsProps {
    data: SalaryData[];
}

export default function SalaryCharts({ data }: SalaryChartsProps) {
    if (data.length === 0) {
        return null;
    }

    // Experience vs Salary analysis
    const experienceGroups = data.reduce((acc, item) => {
        const expGroup = getExperienceGroup(item['års erfaring']);
        if (!acc[expGroup]) {
            acc[expGroup] = [];
        }
        acc[expGroup].push(item.lønn);
        return acc;
    }, {} as Record<string, number[]>);

    const experienceStats = Object.entries(experienceGroups)
        .map(([group, salaries]) => ({
            group,
            avgSalary: Math.round(
                salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length
            ),
            medianSalary: Math.round(
                salaries.sort((a, b) => a - b)[Math.floor(salaries.length / 2)]
            ),
            count: salaries.length,
            minSalary: Math.min(...salaries),
            maxSalary: Math.max(...salaries),
        }))
        .sort((a, b) => getGroupOrder(a.group) - getGroupOrder(b.group));

    // Gender pay gap analysis by experience level
    const genderPayGap = experienceStats.map(({ group }) => {
        const groupData = data.filter(
            (item) => getExperienceGroup(item['års erfaring']) === group
        );
        const maleData = groupData.filter((item) => item.kjønn === 'mann');
        const femaleData = groupData.filter((item) => item.kjønn === 'kvinne');

        const maleAvg =
            maleData.length > 0
                ? Math.round(
                      maleData.reduce((sum, item) => sum + item.lønn, 0) /
                          maleData.length
                  )
                : 0;
        const femaleAvg =
            femaleData.length > 0
                ? Math.round(
                      femaleData.reduce((sum, item) => sum + item.lønn, 0) /
                          femaleData.length
                  )
                : 0;

        return {
            group,
            maleAvg,
            femaleAvg,
            gap:
                maleAvg > 0 && femaleAvg > 0
                    ? Math.round(((maleAvg - femaleAvg) / maleAvg) * 100)
                    : 0,
            maleCount: maleData.length,
            femaleCount: femaleData.length,
        };
    });

    // Field comparison for entry-level vs experienced
    const fieldComparison = getFieldComparison(data);

    // Salary distribution
    const salaryRanges = getSalaryDistribution(data);

    return (
        <div className='space-y-8'>
            {/* Experience vs Salary Chart */}
            <div className='bg-white shadow rounded-lg p-6'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-3'>
                        📈 Lønnsutvikling etter erfaring
                    </h2>
                    <p className='text-gray-600 text-sm mb-4'>
                        Oversikt over hvordan lønnen utvikler seg med økt
                        yrkeserfaring. Gruppene viser både gjennomsnitt og
                        median for å gi et komplett bilde.
                    </p>
                    <div className='bg-yellow-50 rounded-lg p-3 text-xs text-gray-700'>
                        <strong>Lesetips:</strong> Medianlønn er ofte mer
                        representativ enn gjennomsnitt da den ikke påvirkes like
                        mye av ekstreme høye eller lave lønninger.
                    </div>
                </div>
                <div className='space-y-4'>
                    {experienceStats.map(
                        ({
                            group,
                            avgSalary,
                            medianSalary,
                            count,
                            minSalary,
                            maxSalary,
                        }) => {
                            const maxSal = Math.max(
                                ...experienceStats.map((item) => item.avgSalary)
                            );
                            const percentage = (avgSalary / maxSal) * 100;

                            return (
                                <div
                                    key={group}
                                    className='border rounded-lg p-4'
                                >
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className='font-semibold text-lg'>
                                            {group}
                                        </h3>
                                        <span className='text-sm text-gray-500'>
                                            {count} personer
                                        </span>
                                    </div>

                                    <div className='grid md:grid-cols-2 gap-4 mb-3'>
                                        <div>
                                            <div className='text-2xl font-bold text-green-600 mb-1'>
                                                {avgSalary.toLocaleString()} kr
                                            </div>
                                            <div className='text-sm text-gray-600'>
                                                Gjennomsnitt
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-xl font-semibold text-blue-600 mb-1'>
                                                {medianSalary.toLocaleString()}{' '}
                                                kr
                                            </div>
                                            <div className='text-sm text-gray-600'>
                                                Median
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
                                        <div
                                            className='bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full flex items-center justify-end pr-2'
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <span className='text-white text-xs font-medium'>
                                                {avgSalary.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex justify-between text-xs text-gray-500'>
                                        <span>
                                            Min: {minSalary.toLocaleString()} kr
                                        </span>
                                        <span>
                                            Max: {maxSalary.toLocaleString()} kr
                                        </span>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* Gender Pay Gap Analysis */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>
                    ⚖️ Kjønnsforskjeller i lønn
                </h2>
                <div className='space-y-4'>
                    {genderPayGap
                        .filter(
                            (item) => item.maleCount > 0 && item.femaleCount > 0
                        )
                        .map(
                            ({
                                group,
                                maleAvg,
                                femaleAvg,
                                gap,
                                maleCount,
                                femaleCount,
                            }) => (
                                <div
                                    key={group}
                                    className='border rounded-lg p-4'
                                >
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className='font-semibold'>
                                            {group}
                                        </h3>
                                        <div className='text-sm text-gray-500'>
                                            {maleCount} menn, {femaleCount}{' '}
                                            kvinner
                                        </div>
                                    </div>

                                    <div className='grid md:grid-cols-2 gap-4 mb-3'>
                                        <div className='bg-blue-50 p-3 rounded'>
                                            <div className='text-blue-800 font-medium'>
                                                👨 Menn
                                            </div>
                                            <div className='text-xl font-bold text-blue-600'>
                                                {maleAvg.toLocaleString()} kr
                                            </div>
                                        </div>
                                        <div className='bg-pink-50 p-3 rounded'>
                                            <div className='text-pink-800 font-medium'>
                                                👩 Kvinner
                                            </div>
                                            <div className='text-xl font-bold text-pink-600'>
                                                {femaleAvg.toLocaleString()} kr
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`text-center p-2 rounded ${
                                            gap > 0
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-green-50 text-green-700'
                                        }`}
                                    >
                                        {gap > 0 ? (
                                            <span>
                                                💸 Lønnsforskjell: {gap}% høyere
                                                for menn
                                            </span>
                                        ) : gap < 0 ? (
                                            <span>
                                                💚 Lønnsforskjell:{' '}
                                                {Math.abs(gap)}% høyere for
                                                kvinner
                                            </span>
                                        ) : (
                                            <span>
                                                ✅ Ingen betydelig
                                                lønnsforskjell
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                </div>
            </div>

            {/* Field Comparison: Entry-level vs Experienced */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>
                    🚀 Karriereutvikling per fagområde
                </h2>
                <div className='space-y-4'>
                    {fieldComparison.map(
                        ({
                            field,
                            entryLevel,
                            experienced,
                            growth,
                            entryCount,
                            expCount,
                        }) => (
                            <div key={field} className='border rounded-lg p-4'>
                                <div className='flex justify-between items-center mb-3'>
                                    <h3 className='font-semibold'>{field}</h3>
                                    <div className='text-sm text-gray-500'>
                                        {entryCount} entry-level, {expCount}{' '}
                                        erfarne
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4 mb-3'>
                                    <div className='bg-orange-50 p-3 rounded'>
                                        <div className='text-orange-800 font-medium'>
                                            🌱 Entry-level
                                        </div>
                                        <div className='text-lg font-bold text-orange-600'>
                                            {entryLevel.toLocaleString()} kr
                                        </div>
                                    </div>
                                    <div className='bg-green-50 p-3 rounded'>
                                        <div className='text-green-800 font-medium'>
                                            🌳 Erfarne (5+ år)
                                        </div>
                                        <div className='text-lg font-bold text-green-600'>
                                            {experienced.toLocaleString()} kr
                                        </div>
                                    </div>
                                    <div className='bg-purple-50 p-3 rounded'>
                                        <div className='text-purple-800 font-medium'>
                                            📈 Vekstpotensial
                                        </div>
                                        <div className='text-lg font-bold text-purple-600'>
                                            +{growth}%
                                        </div>
                                    </div>
                                </div>

                                <div className='w-full bg-gray-200 rounded-full h-3'>
                                    <div
                                        className='bg-gradient-to-r from-orange-400 to-green-400 h-3 rounded-full'
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                (experienced /
                                                    Math.max(
                                                        ...fieldComparison.map(
                                                            (item) =>
                                                                item.experienced
                                                        )
                                                    )) *
                                                    100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Salary Distribution */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>💰 Lønnsfordeling</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {salaryRanges.map(({ range, count, percentage }) => (
                        <div
                            key={range}
                            className='border rounded-lg p-4 text-center'
                        >
                            <div className='text-lg font-semibold mb-2'>
                                {range}
                            </div>
                            <div className='text-3xl font-bold text-blue-600 mb-2'>
                                {count}
                            </div>
                            <div className='text-sm text-gray-600 mb-3'>
                                {percentage}% av alle
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2'>
                                <div
                                    className='bg-blue-500 h-2 rounded-full'
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getExperienceGroup(years: number): string {
    if (years === 0) return '0 år (nyutdannet)';
    if (years <= 2) return '1-2 år (entry-level)';
    if (years <= 5) return '3-5 år (junior)';
    if (years <= 10) return '6-10 år (senior)';
    if (years <= 15) return '11-15 år (lead)';
    return '15+ år (expert)';
}

function getGroupOrder(group: string): number {
    const order = {
        '0 år (nyutdannet)': 1,
        '1-2 år (entry-level)': 2,
        '3-5 år (junior)': 3,
        '6-10 år (senior)': 4,
        '11-15 år (lead)': 5,
        '15+ år (expert)': 6,
    };
    return order[group as keyof typeof order] || 999;
}

function getFieldComparison(data: SalaryData[]) {
    const fields = [...new Set(data.map((item) => item.fag))];

    return fields
        .map((field) => {
            const fieldData = data.filter((item) => item.fag === field);
            const entryLevelData = fieldData.filter(
                (item) => item['års erfaring'] <= 2
            );
            const experiencedData = fieldData.filter(
                (item) => item['års erfaring'] >= 5
            );

            if (entryLevelData.length === 0 || experiencedData.length === 0) {
                return null;
            }

            const entryLevel = Math.round(
                entryLevelData.reduce((sum, item) => sum + item.lønn, 0) /
                    entryLevelData.length
            );
            const experienced = Math.round(
                experiencedData.reduce((sum, item) => sum + item.lønn, 0) /
                    experiencedData.length
            );
            const growth = Math.round(
                ((experienced - entryLevel) / entryLevel) * 100
            );

            return {
                field,
                entryLevel,
                experienced,
                growth,
                entryCount: entryLevelData.length,
                expCount: experiencedData.length,
            };
        })
        .filter(Boolean)
        .sort((a, b) => (b?.growth || 0) - (a?.growth || 0)) as Array<{
        field: string;
        entryLevel: number;
        experienced: number;
        growth: number;
        entryCount: number;
        expCount: number;
    }>;
}

function getSalaryDistribution(data: SalaryData[]) {
    const ranges = [
        { min: 0, max: 500000, label: 'Under 500k' },
        { min: 500000, max: 700000, label: '500k - 700k' },
        { min: 700000, max: 900000, label: '700k - 900k' },
        { min: 900000, max: 1200000, label: '900k - 1.2M' },
        { min: 1200000, max: 1500000, label: '1.2M - 1.5M' },
        { min: 1500000, max: Infinity, label: 'Over 1.5M' },
    ];

    return ranges.map(({ min, max, label }) => {
        const count = data.filter(
            (item) => item.lønn >= min && item.lønn < max
        ).length;
        const percentage = Math.round((count / data.length) * 100);

        return {
            range: label,
            count,
            percentage,
        };
    });
}
