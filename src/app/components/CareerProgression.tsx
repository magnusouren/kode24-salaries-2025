import { SalaryData } from '../page';

interface CareerProgressionProps {
    data: SalaryData[];
}

export default function CareerProgression({ data }: CareerProgressionProps) {
    if (data.length === 0) {
        return null;
    }

    // Calculate career milestones
    const careerMilestones = calculateCareerMilestones(data);

    // Education ROI analysis
    const educationROI = calculateEducationROI(data);

    // Skills that pay well for beginners
    const beginnerFriendlySkills = getBeginnerFriendlySkills(data);

    // Career path suggestions
    const careerPaths = getCareerPaths();

    return (
        <div className='space-y-8'>
            {/* Career Milestones */}
            <div className='bg-white shadow rounded-lg p-6'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-3'>
                        🎯 Karrieremilepæler og progresjon
                    </h2>
                    <p className='text-gray-600 text-sm mb-4'>
                        Basert på lønnsdata viser denne seksjonen typiske
                        karrieremilepæler i IT-bransjen. Tallene representerer
                        gjennomsnittslønninger på ulike nivåer basert på
                        erfaring og ansvar.
                    </p>
                    <div className='bg-blue-50 rounded-lg p-3 text-xs text-gray-700'>
                        <strong>Tips:</strong> Disse milepælene er veiledende og
                        kan variere betydelig basert på fagområde, arbeidssted,
                        og individuelle ferdigheter.
                    </div>
                </div>
                <div className='space-y-6'>
                    {careerMilestones.map((milestone, index) => (
                        <div key={index} className='relative'>
                            {/* Timeline line */}
                            {index < careerMilestones.length - 1 && (
                                <div className='absolute left-6 top-16 w-0.5 h-20 bg-gray-300'></div>
                            )}

                            <div className='flex items-start space-x-4'>
                                {/* Timeline dot */}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                        index === 0
                                            ? 'bg-green-500'
                                            : index === 1
                                            ? 'bg-blue-500'
                                            : index === 2
                                            ? 'bg-purple-500'
                                            : index === 3
                                            ? 'bg-orange-500'
                                            : 'bg-red-500'
                                    }`}
                                >
                                    {milestone.years}år
                                </div>

                                <div className='flex-1 bg-gray-50 rounded-lg p-4'>
                                    <h3 className='font-semibold text-lg mb-2'>
                                        {milestone.title}
                                    </h3>
                                    <div className='grid md:grid-cols-3 gap-4 mb-3'>
                                        <div>
                                            <div className='text-sm text-gray-600'>
                                                Gjennomsnittlønn
                                            </div>
                                            <div className='text-xl font-bold text-green-600'>
                                                {milestone.avgSalary.toLocaleString()}{' '}
                                                kr
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-sm text-gray-600'>
                                                Antall stillinger
                                            </div>
                                            <div className='text-xl font-bold text-blue-600'>
                                                {milestone.jobCount}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-sm text-gray-600'>
                                                Lønnsområde
                                            </div>
                                            <div className='text-lg font-bold text-gray-700'>
                                                {milestone.salaryRange}
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-gray-700'>
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education ROI */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>
                    🎓 Utdanning vs. Lønn (Return on Investment)
                </h2>
                <div className='grid md:grid-cols-2 gap-6'>
                    {educationROI.map(
                        ({
                            level,
                            description,
                            avgSalary,
                            entryLevel,
                            experienced,
                            count,
                            roi,
                        }) => (
                            <div
                                key={level}
                                className='border-2 rounded-lg p-4 hover:shadow-lg transition-shadow'
                            >
                                <h3 className='font-semibold text-lg mb-2'>
                                    {description}
                                </h3>
                                <div className='space-y-3'>
                                    <div className='bg-blue-50 p-3 rounded'>
                                        <div className='text-sm text-blue-700'>
                                            Gjennomsnittlønn
                                        </div>
                                        <div className='text-xl font-bold text-blue-800'>
                                            {avgSalary.toLocaleString()} kr
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                        <div>
                                            <div className='text-gray-600'>
                                                Entry-level
                                            </div>
                                            <div className='font-semibold'>
                                                {entryLevel.toLocaleString()} kr
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-gray-600'>
                                                Erfarne (5+ år)
                                            </div>
                                            <div className='font-semibold'>
                                                {experienced.toLocaleString()}{' '}
                                                kr
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-green-50 p-2 rounded'>
                                        <div className='text-xs text-green-700'>
                                            Vekstpotensial
                                        </div>
                                        <div className='font-bold text-green-800'>
                                            +{roi}%
                                        </div>
                                    </div>

                                    <div className='text-xs text-gray-500'>
                                        Basert på {count} respondenter
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Beginner-Friendly Skills */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>
                    🌱 Best betalte fagområder for nybegynnere
                </h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {beginnerFriendlySkills.map(
                        ({
                            skill,
                            avgSalary,
                            entryJobs,
                            difficulty,
                            growth,
                        }) => (
                            <div
                                key={skill}
                                className='border rounded-lg p-4 hover:shadow-md transition-shadow'
                            >
                                <h3 className='font-semibold mb-3'>{skill}</h3>

                                <div className='space-y-3'>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-green-600 mb-1'>
                                            {avgSalary.toLocaleString()} kr
                                        </div>
                                        <div className='text-sm text-gray-600'>
                                            Gjennomsnitt entry-level
                                        </div>
                                    </div>

                                    <div className='flex justify-between text-sm'>
                                        <span>Tilgjengelige jobber:</span>
                                        <span className='font-semibold'>
                                            {entryJobs}
                                        </span>
                                    </div>

                                    <div className='flex justify-between text-sm'>
                                        <span>Inngangsterskel:</span>
                                        <span
                                            className={`font-semibold ${
                                                difficulty === 'Lav'
                                                    ? 'text-green-600'
                                                    : difficulty === 'Middels'
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {difficulty}
                                        </span>
                                    </div>

                                    <div className='flex justify-between text-sm'>
                                        <span>Vekstpotensial:</span>
                                        <span className='font-semibold text-purple-600'>
                                            +{growth}%
                                        </span>
                                    </div>

                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className='bg-green-500 h-2 rounded-full'
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    (avgSalary /
                                                        Math.max(
                                                            ...beginnerFriendlySkills.map(
                                                                (s) =>
                                                                    s.avgSalary
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

            {/* Career Paths */}
            <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6'>
                    🛤️ Karriereveier og lønnsprogresjon
                </h2>
                <div className='space-y-6'>
                    {careerPaths.map((path, index) => (
                        <div key={index} className='border rounded-lg p-6'>
                            <h3 className='font-semibold text-xl mb-4 text-center'>
                                {path.title}
                            </h3>

                            <div className='grid md:grid-cols-4 gap-4'>
                                {path.stages.map((stage, stageIndex) => (
                                    <div key={stageIndex} className='relative'>
                                        {stageIndex <
                                            path.stages.length - 1 && (
                                            <div className='hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2'>
                                                <div className='w-4 h-0.5 bg-gray-300'></div>
                                                <div className='w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2'></div>
                                            </div>
                                        )}

                                        <div className='bg-gray-50 rounded-lg p-4 text-center'>
                                            <div className='text-sm font-medium text-gray-600 mb-1'>
                                                {stage.experience}
                                            </div>
                                            <div className='font-semibold mb-2'>
                                                {stage.title}
                                            </div>
                                            <div className='text-lg font-bold text-green-600 mb-2'>
                                                {stage.salary.toLocaleString()}{' '}
                                                kr
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {stage.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4 bg-blue-50 p-4 rounded-lg'>
                                <h4 className='font-semibold text-blue-800 mb-2'>
                                    💡 Tips for denne karriereveien:
                                </h4>
                                <ul className='text-sm text-blue-700 space-y-1'>
                                    {path.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex}>• {tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function calculateCareerMilestones(data: SalaryData[]) {
    const milestones = [
        { years: 0, title: 'Nyutdannet / Første jobb' },
        { years: 2, title: 'Junior utvikler' },
        { years: 5, title: 'Senior utvikler' },
        { years: 10, title: 'Lead / Arkitekt' },
        { years: 15, title: 'Principal / Expert' },
    ];

    return milestones.map(({ years, title }) => {
        const yearData = data.filter((item) => {
            if (years === 0) return item['års erfaring'] === 0;
            if (years === 2)
                return item['års erfaring'] >= 1 && item['års erfaring'] <= 3;
            if (years === 5)
                return item['års erfaring'] >= 4 && item['års erfaring'] <= 7;
            if (years === 10)
                return item['års erfaring'] >= 8 && item['års erfaring'] <= 12;
            return item['års erfaring'] >= 13;
        });

        if (yearData.length === 0) {
            return {
                years,
                title,
                avgSalary: 0,
                jobCount: 0,
                salaryRange: 'Ingen data',
                description: 'Ingen tilgjengelig data for denne kategorien.',
            };
        }

        const salaries = yearData
            .map((item) => item.lønn)
            .sort((a, b) => a - b);
        const avgSalary = Math.round(
            salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length
        );
        const minSalary = salaries[0];
        const maxSalary = salaries[salaries.length - 1];

        const descriptions = {
            0: 'Starter karrieren med grunnleggende ferdigheter. Fokus på læring og tilpasning.',
            2: 'Har fått grunnleggende erfaring og begynner å ta på seg mer ansvar.',
            5: 'Selvstendig utvikler med solid erfaring. Kan mentorere yngre kolleger.',
            10: 'Leder tekniske prosjekter og tar arkitektur-beslutninger.',
            15: 'Ekspert på området med dyp kunnskap og strategisk oversikt.',
        };

        return {
            years,
            title,
            avgSalary,
            jobCount: yearData.length,
            salaryRange: `${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()} kr`,
            description:
                descriptions[years as keyof typeof descriptions] ||
                'Høy erfaring og ekspertise.',
        };
    });
}

function calculateEducationROI(data: SalaryData[]) {
    const educationLevels = [
        { level: 0, description: 'Selvlært / Bootcamp' },
        { level: 3, description: 'Bachelor (3 år)' },
        { level: 5, description: 'Master (5 år)' },
        { level: 8, description: 'PhD / Høyere grad' },
    ];

    return educationLevels
        .map(({ level, description }) => {
            const levelData = data.filter((item) => {
                if (level === 0) return item['års utdanning'] <= 1;
                if (level === 3)
                    return (
                        item['års utdanning'] >= 2 && item['års utdanning'] <= 4
                    );
                if (level === 5)
                    return (
                        item['års utdanning'] === 5 ||
                        item['års utdanning'] === 6
                    );
                return item['års utdanning'] >= 7;
            });

            if (levelData.length === 0) {
                return {
                    level,
                    description,
                    avgSalary: 0,
                    entryLevel: 0,
                    experienced: 0,
                    count: 0,
                    roi: 0,
                };
            }

            const avgSalary = Math.round(
                levelData.reduce((sum, item) => sum + item.lønn, 0) /
                    levelData.length
            );

            const entryLevelData = levelData.filter(
                (item) => item['års erfaring'] <= 2
            );
            const experiencedData = levelData.filter(
                (item) => item['års erfaring'] >= 5
            );

            const entryLevel =
                entryLevelData.length > 0
                    ? Math.round(
                          entryLevelData.reduce(
                              (sum, item) => sum + item.lønn,
                              0
                          ) / entryLevelData.length
                      )
                    : 0;
            const experienced =
                experiencedData.length > 0
                    ? Math.round(
                          experiencedData.reduce(
                              (sum, item) => sum + item.lønn,
                              0
                          ) / experiencedData.length
                      )
                    : 0;

            const roi =
                entryLevel > 0 && experienced > 0
                    ? Math.round(
                          ((experienced - entryLevel) / entryLevel) * 100
                      )
                    : 0;

            return {
                level,
                description,
                avgSalary,
                entryLevel,
                experienced,
                count: levelData.length,
                roi,
            };
        })
        .filter((item) => item.count > 0);
}

function getBeginnerFriendlySkills(data: SalaryData[]) {
    const entryLevelData = data.filter((item) => item['års erfaring'] <= 2);
    const skills = [...new Set(entryLevelData.map((item) => item.fag))];

    const skillDifficulty: Record<string, string> = {
        frontend: 'Lav',
        fullstack: 'Middels',
        backend: 'Middels',
        app: 'Lav',
        'UX / design': 'Lav',
        'data science': 'Høy',
        'AI / maskinlæring': 'Høy',
        sikkerhet: 'Høy',
        'devops / drift': 'Middels',
        'embedded / IOT / maskinvare': 'Høy',
    };

    return skills
        .map((skill) => {
            const skillEntryData = entryLevelData.filter(
                (item) => item.fag === skill
            );
            const skillAllData = data.filter((item) => item.fag === skill);
            const skillExperiencedData = skillAllData.filter(
                (item) => item['års erfaring'] >= 5
            );

            if (skillEntryData.length < 3) return null;

            const avgSalary = Math.round(
                skillEntryData.reduce((sum, item) => sum + item.lønn, 0) /
                    skillEntryData.length
            );
            const avgExperienced =
                skillExperiencedData.length > 0
                    ? Math.round(
                          skillExperiencedData.reduce(
                              (sum, item) => sum + item.lønn,
                              0
                          ) / skillExperiencedData.length
                      )
                    : 0;

            const growth =
                avgExperienced > 0
                    ? Math.round(
                          ((avgExperienced - avgSalary) / avgSalary) * 100
                      )
                    : 0;

            return {
                skill,
                avgSalary,
                entryJobs: skillEntryData.length,
                difficulty: skillDifficulty[skill] || 'Middels',
                growth,
            };
        })
        .filter(Boolean)
        .sort((a, b) => (b?.avgSalary || 0) - (a?.avgSalary || 0)) as Array<{
        skill: string;
        avgSalary: number;
        entryJobs: number;
        difficulty: string;
        growth: number;
    }>;
}

function getCareerPaths() {
    const paths = [
        {
            title: 'Frontend-utvikler til Full-stack',
            stages: [
                {
                    experience: '0-1 år',
                    title: 'Junior Frontend',
                    salary: 650000,
                    description: 'HTML, CSS, JavaScript',
                },
                {
                    experience: '2-3 år',
                    title: 'Frontend Developer',
                    salary: 750000,
                    description: 'React/Vue, responsiv design',
                },
                {
                    experience: '4-6 år',
                    title: 'Senior Frontend',
                    salary: 900000,
                    description: 'Arkitektur, mentoring',
                },
                {
                    experience: '7+ år',
                    title: 'Full-stack Lead',
                    salary: 1200000,
                    description: 'Full-stack, teamledelse',
                },
            ],
            tips: [
                'Start med grunnleggende HTML, CSS og JavaScript',
                'Lær et moderne framework som React eller Vue',
                'Utvikle forståelse for UX/UI-prinsipper',
                'Gradvis lær backend-teknologier som Node.js',
            ],
        },
        {
            title: 'Backend-utvikler til Arkitekt',
            stages: [
                {
                    experience: '0-1 år',
                    title: 'Junior Backend',
                    salary: 680000,
                    description: 'API-utvikling, databaser',
                },
                {
                    experience: '2-3 år',
                    title: 'Backend Developer',
                    salary: 800000,
                    description: 'Microservices, caching',
                },
                {
                    experience: '4-6 år',
                    title: 'Senior Backend',
                    salary: 950000,
                    description: 'Systemdesign, skalering',
                },
                {
                    experience: '7+ år',
                    title: 'Solution Architect',
                    salary: 1300000,
                    description: 'Arkitektur, strategiske beslutninger',
                },
            ],
            tips: [
                'Mestre minst ett backend-språk godt (Java, Python, C#, etc.)',
                'Forstå databaser og datamodellering',
                'Lær om cloud-teknologier (AWS, Azure, GCP)',
                'Utvikle ferdigheter innen systemarkitektur og skalering',
            ],
        },
        {
            title: 'Fra Student til Data Scientist',
            stages: [
                {
                    experience: '0-1 år',
                    title: 'Data Analyst',
                    salary: 620000,
                    description: 'SQL, Excel, grunnleggende analyse',
                },
                {
                    experience: '2-3 år',
                    title: 'Junior Data Scientist',
                    salary: 750000,
                    description: 'Python, machine learning',
                },
                {
                    experience: '4-6 år',
                    title: 'Data Scientist',
                    salary: 950000,
                    description: 'Deep learning, deployment',
                },
                {
                    experience: '7+ år',
                    title: 'Principal Data Scientist',
                    salary: 1400000,
                    description: 'Strategi, research',
                },
            ],
            tips: [
                'Lær Python og R for dataanalyse',
                'Forstå statistikk og machine learning-algoritmer',
                'Bygg et portfolio med reelle prosjekter',
                'Spesialiser deg innen et domene (finance, healthcare, etc.)',
            ],
        },
    ];

    return paths;
}
