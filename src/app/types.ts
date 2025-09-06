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
