import { SalaryData } from '../types';

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
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100'>
                        📈 Lønnsutvikling etter erfaring
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                        Oversikt over hvordan lønnen utvikler seg med økt
                        yrkeserfaring. Gruppene viser både gjennomsnitt og
                        median for å gi et komplett bilde.
                    </p>
                    <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 border border-yellow-200 dark:border-yellow-800'>
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
                                    className='border rounded-lg p-4 dark:border-gray-700'
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
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                Gjennomsnitt
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-xl font-semibold text-blue-600 mb-1'>
                                                {medianSalary.toLocaleString()}{' '}
                                                kr
                                            </div>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                Median
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full bg-gray-200 rounded-full h-4 mb-2 dark:bg-gray-700'>
                                        <div
                                            className='bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full flex items-center justify-end pr-2'
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <span className='text-white text-xs font-medium'>
                                                {avgSalary.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
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
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
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
                                    className='border border-gray-200 dark:border-gray-600 rounded-lg p-4'
                                >
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                                            {group}
                                        </h3>
                                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                                            {maleCount} menn, {femaleCount}{' '}
                                            kvinner
                                        </div>
                                    </div>

                                    <div className='grid md:grid-cols-2 gap-4 mb-3'>
                                        <div className='bg-blue-50 dark:bg-blue-900/30 p-3 rounded border border-blue-200 dark:border-blue-800'>
                                            <div className='text-blue-800 dark:text-blue-200 font-medium'>
                                                👨 Menn
                                            </div>
                                            <div className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                                                {maleAvg.toLocaleString()} kr
                                            </div>
                                        </div>
                                        <div className='bg-pink-50 dark:bg-pink-900/30 p-3 rounded border border-pink-200 dark:border-pink-800'>
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
                                                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                                                : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200'
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
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>
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
                            <div
                                key={field}
                                className='border rounded-lg p-4 dark:border-gray-700'
                            >
                                <div className='flex justify-between items-center mb-3'>
                                    <h3 className='font-semibold'>{field}</h3>
                                    <div className='text-sm text-gray-500'>
                                        {entryCount} entry-level, {expCount}{' '}
                                        erfarne
                                    </div>
                                </div>

                                <div className='grid md:grid-cols-3 gap-4 mb-3'>
                                    <div className='bg-orange-50 p-3 rounded dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800'>
                                        <div className='text-orange-800 font-medium dark:text-orange-200'>
                                            🌱 Entry-level
                                        </div>
                                        <div className='text-lg font-bold text-orange-600 dark:text-orange-400'>
                                            {entryLevel.toLocaleString()} kr
                                        </div>
                                    </div>
                                    <div className='bg-green-50 p-3 rounded dark:bg-green-900/30 border border-green-200 dark:border-green-800'>
                                        <div className='text-green-800 font-medium dark:text-green-200'>
                                            🌳 Erfarne (5+ år)
                                        </div>
                                        <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                                            {experienced.toLocaleString()} kr
                                        </div>
                                    </div>
                                    <div className='bg-purple-50 p-3 rounded dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800'>
                                        <div className='text-purple-800 font-medium dark:text-purple-200'>
                                            📈 Vekstpotensial
                                        </div>
                                        <div className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                                            +{growth}%
                                        </div>
                                    </div>
                                </div>

                                <div className='w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700'>
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
            <div className='shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>💰 Lønnsfordeling</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {salaryRanges.map(({ range, count, percentage }) => (
                        <div
                            key={range}
                            className='border rounded-lg p-4 text-center dark:border-gray-700'
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
                            <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
                                <div
                                    className='bg-blue-500 h-2 rounded-full'
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Salary Trend Line Chart */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium mb-6 text-gray-900 dark:text-white'>
                    💹 Salary Progression Trend
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                    Average and median salary progression over years of
                    experience. Shows career growth patterns.
                </p>

                <div className='relative h-80'>
                    <svg viewBox='0 0 800 300' className='w-full h-full'>
                        {(() => {
                            const trendData = createSalaryTrendData(data);
                            if (trendData.length === 0) return null;

                            const maxSalary = Math.max(
                                ...trendData.map((d) => d.maxSalary)
                            );
                            const minSalary = Math.min(
                                ...trendData.map((d) => d.minSalary)
                            );
                            const maxYears = Math.max(
                                ...trendData.map((d) => d.years)
                            );

                            const scaleX = (years: number) =>
                                (years / maxYears) * 700 + 50;
                            const scaleY = (salary: number) =>
                                250 -
                                ((salary - minSalary) /
                                    (maxSalary - minSalary)) *
                                    200;

                            // Create path for average salary line
                            const avgPath = trendData
                                .map(
                                    (d, i) =>
                                        `${i === 0 ? 'M' : 'L'} ${scaleX(
                                            d.years
                                        )} ${scaleY(d.avgSalary)}`
                                )
                                .join(' ');

                            // Create path for median salary line
                            const medianPath = trendData
                                .map(
                                    (d, i) =>
                                        `${i === 0 ? 'M' : 'L'} ${scaleX(
                                            d.years
                                        )} ${scaleY(d.medianSalary)}`
                                )
                                .join(' ');

                            return (
                                <>
                                    {/* Grid lines */}
                                    {[
                                        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20,
                                    ].map((year) => (
                                        <line
                                            key={year}
                                            x1={scaleX(year)}
                                            y1={50}
                                            x2={scaleX(year)}
                                            y2={250}
                                            stroke='currentColor'
                                            strokeWidth={
                                                year % 5 === 0 ? '1' : '0.5'
                                            }
                                            className='text-gray-200 dark:text-gray-600'
                                            opacity={
                                                year % 5 === 0 ? '0.5' : '0.2'
                                            }
                                        />
                                    ))}

                                    {/* Salary grid lines */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <line
                                                key={i}
                                                x1={50}
                                                y1={scaleY(salary)}
                                                x2={750}
                                                y2={scaleY(salary)}
                                                stroke='currentColor'
                                                strokeWidth='0.5'
                                                className='text-gray-200 dark:text-gray-600'
                                                opacity='0.3'
                                            />
                                        );
                                    })}

                                    {/* Average salary line */}
                                    <path
                                        d={avgPath}
                                        fill='none'
                                        stroke='#3B82F6'
                                        strokeWidth='3'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />

                                    {/* Median salary line */}
                                    <path
                                        d={medianPath}
                                        fill='none'
                                        stroke='#10B981'
                                        strokeWidth='3'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeDasharray='5,5'
                                    />

                                    {/* Data points for average */}
                                    {trendData.map((d, i) => (
                                        <circle
                                            key={`avg-${i}`}
                                            cx={scaleX(d.years)}
                                            cy={scaleY(d.avgSalary)}
                                            r='4'
                                            fill='#3B82F6'
                                            className='hover:r-6 transition-all cursor-pointer'
                                        />
                                    ))}

                                    {/* Data points for median */}
                                    {trendData.map((d, i) => (
                                        <circle
                                            key={`median-${i}`}
                                            cx={scaleX(d.years)}
                                            cy={scaleY(d.medianSalary)}
                                            r='3'
                                            fill='#10B981'
                                            className='hover:r-5 transition-all cursor-pointer'
                                        />
                                    ))}

                                    {/* X-axis labels */}
                                    {[0, 5, 10, 15, 20].map((year) => (
                                        <text
                                            key={year}
                                            x={scaleX(year)}
                                            y={270}
                                            textAnchor='middle'
                                            className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                        >
                                            {year}
                                        </text>
                                    ))}

                                    {/* Y-axis labels */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <text
                                                key={i}
                                                x={40}
                                                y={scaleY(salary) + 3}
                                                textAnchor='end'
                                                className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                            >
                                                {(salary / 1000).toFixed(0)}k
                                            </text>
                                        );
                                    })}

                                    {/* Axis labels */}
                                    <text
                                        x={400}
                                        y={295}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                    >
                                        Years of Experience
                                    </text>
                                    <text
                                        x={20}
                                        y={150}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                        transform='rotate(-90 20 150)'
                                    >
                                        Salary (NOK)
                                    </text>
                                </>
                            );
                        })()}
                    </svg>

                    {/* Legend */}
                    <div className='flex justify-center mt-4 space-x-6'>
                        <div className='flex items-center'>
                            <div className='w-4 h-0.5 bg-blue-500 mr-2'></div>
                            <span className='text-sm text-gray-600 dark:text-gray-300'>
                                Average Salary
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <div className='w-4 h-0.5 bg-green-500 mr-2 border-dashed border-t-2 border-green-500'></div>
                            <span className='text-sm text-gray-600 dark:text-gray-300'>
                                Median Salary
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Distribution Dot Chart */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium mb-6 text-gray-900 dark:text-white'>
                    🎯 Salary Distribution & Outliers
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                    Each dot represents an individual salary. Red dots indicate
                    statistical outliers (very high/low salaries).
                </p>

                <div className='relative h-96'>
                    <svg viewBox='0 0 800 350' className='w-full h-full'>
                        {(() => {
                            const outliers = detectOutliers(data);
                            const normalData = data.filter(
                                (item) => !outliers.includes(item)
                            );

                            const maxSalary = Math.max(
                                ...data.map((d) => d.lønn)
                            );
                            const minSalary = Math.min(
                                ...data.map((d) => d.lønn)
                            );
                            const maxExp = Math.max(
                                ...data.map((d) => d['års erfaring'])
                            );

                            const scaleX = (exp: number) =>
                                (exp / Math.min(maxExp, 25)) * 700 + 50;
                            const scaleY = (salary: number) =>
                                300 -
                                ((salary - minSalary) /
                                    (maxSalary - minSalary)) *
                                    250;

                            // Add some jitter to prevent overlapping
                            const addJitter = () => (Math.random() - 0.5) * 20;

                            return (
                                <>
                                    {/* Grid lines */}
                                    {[0, 5, 10, 15, 20, 25].map((exp) => (
                                        <line
                                            key={exp}
                                            x1={scaleX(exp)}
                                            y1={50}
                                            x2={scaleX(exp)}
                                            y2={300}
                                            stroke='currentColor'
                                            strokeWidth={
                                                exp % 5 === 0 ? '1' : '0.5'
                                            }
                                            className='text-gray-200 dark:text-gray-600'
                                            opacity={
                                                exp % 5 === 0 ? '0.5' : '0.2'
                                            }
                                        />
                                    ))}

                                    {/* Salary grid lines */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <line
                                                key={i}
                                                x1={50}
                                                y1={scaleY(salary)}
                                                x2={750}
                                                y2={scaleY(salary)}
                                                stroke='currentColor'
                                                strokeWidth='0.5'
                                                className='text-gray-200 dark:text-gray-600'
                                                opacity='0.3'
                                            />
                                        );
                                    })}

                                    {/* Normal data points */}
                                    {normalData.slice(0, 500).map(
                                        (
                                            item,
                                            i // Limit for performance
                                        ) => (
                                            <circle
                                                key={`normal-${i}`}
                                                cx={
                                                    scaleX(
                                                        Math.min(
                                                            item[
                                                                'års erfaring'
                                                            ],
                                                            25
                                                        )
                                                    ) + addJitter()
                                                }
                                                cy={
                                                    scaleY(item.lønn) +
                                                    addJitter()
                                                }
                                                r='2'
                                                fill='#3B82F6'
                                                opacity='0.6'
                                                className='hover:r-4 hover:opacity-100 transition-all cursor-pointer'
                                            />
                                        )
                                    )}

                                    {/* Outlier data points */}
                                    {outliers.slice(0, 100).map(
                                        (
                                            item,
                                            i // Limit for performance
                                        ) => (
                                            <circle
                                                key={`outlier-${i}`}
                                                cx={
                                                    scaleX(
                                                        Math.min(
                                                            item[
                                                                'års erfaring'
                                                            ],
                                                            25
                                                        )
                                                    ) + addJitter()
                                                }
                                                cy={
                                                    scaleY(item.lønn) +
                                                    addJitter()
                                                }
                                                r='3'
                                                fill='#EF4444'
                                                opacity='0.8'
                                                className='hover:r-5 hover:opacity-100 transition-all cursor-pointer'
                                            />
                                        )
                                    )}

                                    {/* X-axis labels */}
                                    {[0, 5, 10, 15, 20, 25].map((exp) => (
                                        <text
                                            key={exp}
                                            x={scaleX(exp)}
                                            y={320}
                                            textAnchor='middle'
                                            className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                        >
                                            {exp}
                                        </text>
                                    ))}

                                    {/* Y-axis labels */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <text
                                                key={i}
                                                x={40}
                                                y={scaleY(salary) + 3}
                                                textAnchor='end'
                                                className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                            >
                                                {(salary / 1000).toFixed(0)}k
                                            </text>
                                        );
                                    })}

                                    {/* Axis labels */}
                                    <text
                                        x={400}
                                        y={345}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                    >
                                        Years of Experience
                                    </text>
                                    <text
                                        x={20}
                                        y={175}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                        transform='rotate(-90 20 175)'
                                    >
                                        Salary (NOK)
                                    </text>
                                </>
                            );
                        })()}
                    </svg>

                    {/* Legend and Statistics */}
                    <div className='flex justify-between items-center mt-4'>
                        <div className='flex space-x-6'>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-blue-500 rounded-full mr-2 opacity-60'></div>
                                <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Normal Range
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-3 h-3 bg-red-500 rounded-full mr-2'></div>
                                <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Outliers
                                </span>
                            </div>
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-300'>
                            {detectOutliers(data).length} outliers detected (
                            {(
                                (detectOutliers(data).length / data.length) *
                                100
                            ).toFixed(1)}
                            %)
                        </div>
                    </div>
                </div>
            </div>

            {/* Field Comparison Line Chart */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium mb-6 text-gray-900 dark:text-white'>
                    📈 Field-wise Salary Progression
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                    Compare salary growth across different tech fields. Shows
                    which specializations offer better long-term earning
                    potential.
                </p>

                <div className='relative h-80'>
                    <svg viewBox='0 0 800 300' className='w-full h-full'>
                        {(() => {
                            const fieldData = createFieldTrendData(data);
                            if (fieldData.length === 0) return null;

                            const allSalaries = fieldData.flatMap((field) =>
                                field.trend.map((t) => t.avgSalary)
                            );
                            const maxSalary = Math.max(...allSalaries);
                            const minSalary = Math.min(...allSalaries);
                            const maxYears = 15;

                            const scaleX = (years: number) =>
                                (years / maxYears) * 700 + 50;
                            const scaleY = (salary: number) =>
                                250 -
                                ((salary - minSalary) /
                                    (maxSalary - minSalary)) *
                                    200;

                            const colors = [
                                '#3B82F6',
                                '#10B981',
                                '#F59E0B',
                                '#EF4444',
                                '#8B5CF6',
                                '#F97316',
                            ];

                            return (
                                <>
                                    {/* Grid lines */}
                                    {[0, 3, 5, 7, 10, 15].map((year) => (
                                        <line
                                            key={year}
                                            x1={scaleX(year)}
                                            y1={50}
                                            x2={scaleX(year)}
                                            y2={250}
                                            stroke='currentColor'
                                            strokeWidth={
                                                year % 5 === 0 ? '1' : '0.5'
                                            }
                                            className='text-gray-200 dark:text-gray-600'
                                            opacity={
                                                year % 5 === 0 ? '0.5' : '0.2'
                                            }
                                        />
                                    ))}

                                    {/* Salary grid lines */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <line
                                                key={i}
                                                x1={50}
                                                y1={scaleY(salary)}
                                                x2={750}
                                                y2={scaleY(salary)}
                                                stroke='currentColor'
                                                strokeWidth='0.5'
                                                className='text-gray-200 dark:text-gray-600'
                                                opacity='0.3'
                                            />
                                        );
                                    })}

                                    {/* Field trend lines */}
                                    {fieldData.map((field, fieldIndex) => {
                                        const path = field.trend
                                            .map(
                                                (point, i) =>
                                                    `${
                                                        i === 0 ? 'M' : 'L'
                                                    } ${scaleX(
                                                        point.years
                                                    )} ${scaleY(
                                                        point.avgSalary
                                                    )}`
                                            )
                                            .join(' ');

                                        return (
                                            <g key={field.field}>
                                                <path
                                                    d={path}
                                                    fill='none'
                                                    stroke={
                                                        colors[
                                                            fieldIndex %
                                                                colors.length
                                                        ]
                                                    }
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                                {field.trend.map((point, i) => (
                                                    <circle
                                                        key={i}
                                                        cx={scaleX(point.years)}
                                                        cy={scaleY(
                                                            point.avgSalary
                                                        )}
                                                        r='3'
                                                        fill={
                                                            colors[
                                                                fieldIndex %
                                                                    colors.length
                                                            ]
                                                        }
                                                        className='hover:r-5 transition-all cursor-pointer'
                                                    />
                                                ))}
                                            </g>
                                        );
                                    })}

                                    {/* X-axis labels */}
                                    {[0, 5, 10, 15].map((year) => (
                                        <text
                                            key={year}
                                            x={scaleX(year)}
                                            y={270}
                                            textAnchor='middle'
                                            className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                        >
                                            {year}
                                        </text>
                                    ))}

                                    {/* Y-axis labels */}
                                    {Array.from({ length: 6 }, (_, i) => {
                                        const salary =
                                            minSalary +
                                            (maxSalary - minSalary) * (i / 5);
                                        return (
                                            <text
                                                key={i}
                                                x={40}
                                                y={scaleY(salary) + 3}
                                                textAnchor='end'
                                                className='fill-current text-xs text-gray-600 dark:text-gray-300'
                                            >
                                                {(salary / 1000).toFixed(0)}k
                                            </text>
                                        );
                                    })}

                                    {/* Axis labels */}
                                    <text
                                        x={400}
                                        y={295}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                    >
                                        Years of Experience
                                    </text>
                                    <text
                                        x={20}
                                        y={150}
                                        textAnchor='middle'
                                        className='fill-current text-sm text-gray-700 dark:text-gray-300'
                                        transform='rotate(-90 20 150)'
                                    >
                                        Salary (NOK)
                                    </text>
                                </>
                            );
                        })()}
                    </svg>

                    {/* Legend */}
                    <div className='grid grid-cols-3 gap-2 mt-4 text-sm'>
                        {createFieldTrendData(data).map((field, i) => {
                            const colors = [
                                '#3B82F6',
                                '#10B981',
                                '#F59E0B',
                                '#EF4444',
                                '#8B5CF6',
                                '#F97316',
                            ];
                            return (
                                <div
                                    key={field.field}
                                    className='flex items-center'
                                >
                                    <div
                                        className='w-4 h-0.5 mr-2'
                                        style={{
                                            backgroundColor:
                                                colors[i % colors.length],
                                        }}
                                    ></div>
                                    <span
                                        className='text-gray-600 dark:text-gray-300 truncate'
                                        title={field.field}
                                    >
                                        {field.field.length > 20
                                            ? field.field.substring(0, 20) +
                                              '...'
                                            : field.field}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
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

// Function to detect outliers using IQR method
function detectOutliers(data: SalaryData[]) {
    const salaries = data.map((item) => item.lønn).sort((a, b) => a - b);
    const q1Index = Math.floor(salaries.length * 0.25);
    const q3Index = Math.floor(salaries.length * 0.75);
    const q1 = salaries[q1Index];
    const q3 = salaries[q3Index];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return data.filter(
        (item) => item.lønn < lowerBound || item.lønn > upperBound
    );
}

// Function to create salary trend data for line chart
function createSalaryTrendData(data: SalaryData[]) {
    const experiencePoints = [
        ...new Set(data.map((item) => item['års erfaring'])),
    ]
        .sort((a, b) => a - b)
        .filter((exp) => exp <= 20); // Focus on first 20 years

    const trendData = experiencePoints
        .map((years) => {
            const yearData = data.filter(
                (item) => item['års erfaring'] === years
            );
            if (yearData.length === 0) return null;

            const salaries = yearData.map((item) => item.lønn);
            const avgSalary =
                salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length;
            const medianSalary = salaries.sort((a, b) => a - b)[
                Math.floor(salaries.length / 2)
            ];

            return {
                years,
                avgSalary: Math.round(avgSalary),
                medianSalary: Math.round(medianSalary),
                count: yearData.length,
                minSalary: Math.min(...salaries),
                maxSalary: Math.max(...salaries),
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

    return trendData;
}

// Function to create field-based trend data
function createFieldTrendData(data: SalaryData[]) {
    const fields = [...new Set(data.map((item) => item.fag))];
    const experienceYears = [0, 1, 2, 3, 5, 7, 10, 15];

    const fieldData = fields
        .map((field) => {
            const fieldDataItems = data.filter((item) => item.fag === field);
            if (fieldDataItems.length < 10) return null; // Only include fields with enough data

            const trendPoints = experienceYears
                .map((years) => {
                    const yearData = fieldDataItems.filter(
                        (item) =>
                            item['års erfaring'] >= years &&
                            item['års erfaring'] < years + 2
                    );
                    if (yearData.length === 0) return null;

                    const avgSalary =
                        yearData.reduce((sum, item) => sum + item.lønn, 0) /
                        yearData.length;
                    return {
                        years,
                        avgSalary: Math.round(avgSalary),
                        count: yearData.length,
                    };
                })
                .filter(
                    (item): item is NonNullable<typeof item> => item !== null
                );

            return {
                field,
                trend: trendPoints,
                totalCount: fieldDataItems.length,
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .slice(0, 6); // Top 6 fields

    return fieldData;
}
