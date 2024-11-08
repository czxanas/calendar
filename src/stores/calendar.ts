import { eachDayOfInterval, endOfMonth, format, getDay, parse, startOfMonth, startOfToday } from "date-fns";
import { create } from "zustand";
import { calendarStoreType } from "../types/calendarStoreType";

const handleFormattedDate = (day: string, month: string, year: number) => {
    const parsedDate = parse(`${day} ${month} ${year}`, 'd MMMM yyyy', new Date())
    return format(parsedDate, 'MMM d, yyyy')
}

const useCalendarStore = create<calendarStoreType>((set, get) => {
    // setter to update the year
    const setNewYear = (newYear: number) => {
        const currentYear = parseInt(format(startOfToday(), 'yyyy'));
        if (get().year !== currentYear) {
            set({ year: currentYear });
            setDaysOfMonthsOfTheNewYear(); // Update days of each month for the new year
        }
    }
    // setter to update the daysOfMonthsOfTheYear
    const setDaysOfMonthsOfTheNewYear = () => {
        const months: number[] = Array.from({ length: 12 }, (_, i: number) => i + parseInt(format(startOfToday(),'dd MM yyyy').split(' ')[1])-1) // [0, 1, ..., 11]
        const daysOfEachMonth: { [month: string]: string[] } = {}
        months.forEach((month: number) => {
            const start: Date = startOfMonth(new Date(get().year, month)) //=> Mon Sep 01 2014
            const end: Date = endOfMonth(start) //=> Mon Sep 03 2014
            const days: string[] = eachDayOfInterval({ start, end }).map((date) => format(date, 'dd')) // array of days (numbers)
            const monthName: string = format(new Date(get().year, month), 'MMMM')
            const firstDayOfWeek = getDay(start) - 1 === -1 ? 0 : getDay(start) - 1
            const alignedDays = Array(firstDayOfWeek).fill('').concat(days)
            daysOfEachMonth[monthName] = alignedDays
        })
        set({ daysOfMonthsOfTheYear: daysOfEachMonth })
    }
    // setter to update the selectedStart
    const setSelectedStart = (day: string, month: string, year: number) => {
        const formattedDate = handleFormattedDate(day, month, year)
        // Ensure end date is after the start date
        set({ selectedStart: formattedDate })
    }
    // setter to update the selectedEnd 
    const setSelectedEnd = (day: string, month: string, year: number) => {
        const formattedDate = handleFormattedDate(day, month, year)
        set({ selectedEnd: formattedDate })
    }

    //set selectedStart to null
    const voidSelectedStart = () => set({ selectedStart: null })

    //set selectedStart to null
    const voidSelectedEnd = () => set({ selectedEnd: null })

    //set status to a new value
    const setStatus = (newStatus: null | 'start' | 'end') => set({status: newStatus})

    return {
        year: parseInt(format(startOfToday(),'dd MM yyyy').split(' ')[2]), // get the actuel year, 2024
        daysOfMonthsOfTheYear: {}, // get all month & their days, { [junuary]: [1, 2, ..., 31], ... }
        selectedStart: null, // this is for check-in, Jun 2, 2024
        selectedEnd: null, // this is for check-out, Jun 10, 2024
        setDaysOfMonthsOfTheNewYear,
        setSelectedStart,
        setSelectedEnd,
        voidSelectedStart,
        voidSelectedEnd,
        setNewYear,
        status: null,
        setStatus
    }
})

export default useCalendarStore