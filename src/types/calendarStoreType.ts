export type calendarStoreType = {
    year: number;
    daysOfMonthsOfTheYear: { [month: string]: string[] };
    selectedStart: string | null;
    selectedEnd: string | null;
    setNewYear: (newYear: number) => void;
    setDaysOfMonthsOfTheNewYear: () => void;
    setSelectedStart: (day: string, month: string, year: number) => void;
    setSelectedEnd: (day: string, month: string, year: number) => void;
    voidSelectedStart: () => void;
    voidSelectedEnd: () => void;
    status: null | 'start' | 'end';
    setStatus: (newStatus: null | 'start' | 'end') => void;
}