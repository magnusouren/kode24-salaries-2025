import { SalaryData } from '../page';

interface EntryLevelInsightsProps {
    data: SalaryData[];
}

export default function EntryLevelInsights({ data }: EntryLevelInsightsProps) {
    // Filter for entry-level positions (0-2 years experience)
    const entryLevelData = data.filter((item) => item['års erfaring'] <= 2);

    // Filter for fresh graduates (0 years experience)
    const freshGraduates = data.filter((item) => item['års erfaring'] === 0);

    if (entryLevelData.length === 0) {
        return (
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>
                    Innsikt for studenter og nyutdannede
                </h2>
                <p>Ingen data tilgjengelig for entry-level stillinger.</p>
            </div>
        );
    }

    // Calculate statistics for entry-level positions
    const entryLevelSalaries = entryLevelData.map((item) => item.lønn);
    const avgEntryLevelSalary = Math.round(
        entryLevelSalaries.reduce((sum, salary) => sum + salary, 0) /
            entryLevelSalaries.length
    );
    const medianEntryLevelSalary = Math.round(
        entryLevelSalaries.sort((a, b) => a - b)[
            Math.floor(entryLevelSalaries.length / 2)
        ]
    );

    // Fresh graduate statistics
    const freshGradSalaries = freshGraduates.map((item) => item.lønn);
    const avgFreshGradSalary =
        freshGradSalaries.length > 0
            ? Math.round(
                  freshGradSalaries.reduce((sum, salary) => sum + salary, 0) /
                      freshGradSalaries.length
              )
            : 0;

    // Top fields for entry-level
    const topEntryLevelFields = entryLevelData.reduce((acc, item) => {
        acc[item.fag] = (acc[item.fag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedEntryLevelFields = Object.entries(topEntryLevelFields)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

    // Salary by education level for entry-level
    const salaryByEducation = entryLevelData.reduce((acc, item) => {
        const eduLevel = item['års utdanning'];
        if (!acc[eduLevel]) {
            acc[eduLevel] = [];
        }
        acc[eduLevel].push(item.lønn);
        return acc;
    }, {} as Record<number, number[]>);

    const avgSalaryByEducation = Object.entries(salaryByEducation)
        .map(([edu, salaries]) => ({
            education: parseInt(edu),
            avgSalary: Math.round(
                salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length
            ),
            count: salaries.length,
        }))
        .sort((a, b) => a.education - b.education);

    // Location analysis for entry-level
    const locationStats = entryLevelData.reduce((acc, item) => {
        if (!acc[item.arbeidssted]) {
            acc[item.arbeidssted] = [];
        }
        acc[item.arbeidssted].push(item.lønn);
        return acc;
    }, {} as Record<string, number[]>);

    const topLocations = Object.entries(locationStats)
        .map(([location, salaries]) => ({
            location,
            avgSalary: Math.round(
                salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length
            ),
            count: salaries.length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    return (
        <div className='bg-white shadow rounded-lg p-6'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold mb-3'>
                    📚 Innsikt for studenter og nyutdannede
                </h2>
                <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4'>
                    <p className='text-sm text-gray-700 mb-2'>
                        <strong>Entry-level stillinger</strong> defineres som
                        jobber som krever 0-2 års yrkeserfaring. Dette er typisk
                        hvor studenter og nyutdannede starter sin karriere i
                        IT-bransjen.
                    </p>
                    <p className='text-sm text-gray-600'>
                        Dataene under viser lønnsstatistikk, populære fagområder
                        og beste arbeidsplasser for de som er i starten av sin
                        teknologikarriere.
                    </p>
                </div>
            </div>

            {/* Key statistics */}
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-blue-800'>
                        Entry-level stillinger
                    </h3>
                    <p className='text-2xl font-bold text-blue-600'>
                        {entryLevelData.length}
                    </p>
                    <p className='text-xs text-blue-600'>
                        Jobber som krever 0-2 års erfaring
                    </p>
                </div>

                <div className='bg-green-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-green-800'>
                        Gjennomsnittlig startlønn
                    </h3>
                    <p className='text-2xl font-bold text-green-600'>
                        {avgEntryLevelSalary.toLocaleString()} kr
                    </p>
                    <p className='text-xs text-green-600'>
                        Median: {medianEntryLevelSalary.toLocaleString()} kr/år
                    </p>
                </div>

                <div className='bg-purple-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-purple-800'>
                        Nyutdannede
                    </h3>
                    <p className='text-2xl font-bold text-purple-600'>
                        {freshGraduates.length}
                    </p>
                    <p className='text-xs text-purple-600'>
                        {avgFreshGradSalary > 0
                            ? `Snitt: ${avgFreshGradSalary.toLocaleString()} kr/år`
                            : 'Ingen data tilgjengelig'}
                    </p>
                </div>

                <div className='bg-orange-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-orange-800'>
                        Variabel lønn
                    </h3>
                    <p className='text-lg font-bold text-orange-600'>
                        {Math.round(
                            (entryLevelData.filter(
                                (item) =>
                                    item['inkludert bonus?'] ||
                                    item['inkludert provisjon?']
                            ).length /
                                entryLevelData.length) *
                                100
                        )}
                        %
                    </p>
                    <p className='text-xs text-orange-600'>
                        mottar bonus eller provisjon i tillegg til fastlønn
                    </p>
                </div>
            </div>

            <div className='grid lg:grid-cols-2 gap-8'>
                {/* Top fields for entry-level */}
                <div>
                    <h3 className='text-lg font-semibold mb-3'>
                        🔥 Mest etterspurte fagområder
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                        Fagområder med flest entry-level stillinger og deres
                        gjennomsnittslønninger. Dette gir deg oversikt over hvor
                        det er best muligheter som nyutdannet.
                    </p>
                    <div className='space-y-3'>
                        {sortedEntryLevelFields.map(([field, count]) => {
                            const fieldData = entryLevelData.filter(
                                (item) => item.fag === field
                            );
                            const avgFieldSalary = Math.round(
                                fieldData.reduce(
                                    (sum, item) => sum + item.lønn,
                                    0
                                ) / fieldData.length
                            );
                            const percentage = Math.round(
                                (count / entryLevelData.length) * 100
                            );

                            return (
                                <div
                                    key={field}
                                    className='border rounded-lg p-3'
                                >
                                    <div className='flex justify-between items-start mb-2'>
                                        <span className='font-medium text-sm'>
                                            {field}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {count} stillinger
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-green-600 font-medium'>
                                            {avgFieldSalary.toLocaleString()} kr
                                        </span>
                                        <span className='text-gray-500'>
                                            {percentage}% av entry-level
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                                        <div
                                            className='bg-blue-500 h-2 rounded-full'
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Salary by education level */}
                <div>
                    <h3 className='text-lg font-semibold mb-3'>
                        🎓 Utdanning og lønnspåvirkning
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>
                        Sammenheng mellom utdanningslengde og startlønn for
                        entry-level stillinger. Viser hvor mye ekstra utdanning
                        kan påvirke lønnen din som nyutdannet.
                    </p>
                    <div className='space-y-3'>
                        {avgSalaryByEducation.map(
                            ({ education, avgSalary, count }) => (
                                <div
                                    key={education}
                                    className='border rounded-lg p-3'
                                >
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='font-medium'>
                                            {education === 0
                                                ? 'Ingen formell utdanning'
                                                : education === 1
                                                ? '1 år'
                                                : education <= 3
                                                ? `${education} år (bachelor-nivå)`
                                                : education <= 5
                                                ? `${education} år (master-nivå)`
                                                : `${education} år (PhD/høyere)`}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {count} personer
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-lg font-bold text-green-600'>
                                            {avgSalary.toLocaleString()} kr
                                        </span>
                                        <div className='w-32 bg-gray-200 rounded-full h-3'>
                                            <div
                                                className='bg-green-500 h-3 rounded-full'
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (avgSalary /
                                                            Math.max(
                                                                ...avgSalaryByEducation.map(
                                                                    (item) =>
                                                                        item.avgSalary
                                                                )
                                                            )) *
                                                            100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Top locations for entry-level */}
            <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-3'>
                    📍 Best betalte arbeidsplasser
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                    Geografiske områder og byer med høyest
                    gjennomsnittslønninger for entry-level stillinger. Nyttig
                    for å planlegge hvor du vil starte karrieren din.
                </p>
                <div className='grid md:grid-cols-2 gap-4'>
                    {topLocations.map(({ location, avgSalary, count }) => (
                        <div
                            key={location}
                            className='border rounded-lg p-4 hover:shadow-md transition-shadow'
                        >
                            <div className='flex justify-between items-center mb-2'>
                                <h4 className='font-medium'>{location}</h4>
                                <span className='text-xs text-gray-500'>
                                    {count} stillinger
                                </span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-xl font-bold text-blue-600'>
                                    {avgSalary.toLocaleString()} kr
                                </span>
                                <div className='text-right'>
                                    <div className='text-sm text-gray-600'>
                                        gjennomsnitt
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips for students */}
            <div className='mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-3 text-blue-800'>
                    💡 Karrieretips for studenter og jobbsøkere
                </h3>
                <p className='text-sm text-blue-700 mb-4'>
                    Basert på lønnsanalysen over, her er noen praktiske tips for
                    å maksimere dine karrieremuligheter og startlønn i
                    IT-bransjen.
                </p>
                <div className='grid md:grid-cols-2 gap-4 text-sm'>
                    <div>
                        <h4 className='font-medium text-blue-700 mb-2'>
                            Høyest betalte entry-level fagområder:
                        </h4>
                        <ul className='space-y-1 text-blue-600'>
                            {sortedEntryLevelFields
                                .slice(0, 3)
                                .map(([field]) => {
                                    const fieldData = entryLevelData.filter(
                                        (item) => item.fag === field
                                    );
                                    const avgSalary = Math.round(
                                        fieldData.reduce(
                                            (sum, item) => sum + item.lønn,
                                            0
                                        ) / fieldData.length
                                    );
                                    return (
                                        <li key={field}>
                                            • {field}:{' '}
                                            {avgSalary.toLocaleString()} kr
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                    <div>
                        <h4 className='font-medium text-blue-700 mb-2'>
                            Beste steder å starte karrieren:
                        </h4>
                        <ul className='space-y-1 text-blue-600'>
                            {topLocations
                                .slice(0, 3)
                                .map(({ location, avgSalary }) => (
                                    <li key={location}>
                                        • {location}:{' '}
                                        {avgSalary.toLocaleString()} kr
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
