import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from "date-fns"
import { daysOfEachMonthType } from "../types/daysOfEachMonthType"

export const getDaysOfYear = (year: number) => {
    const months = Array.from({ length: 12 }, (_, i) => i) // create an array for months, from 0 (jun) to 11 (dec)
    const daysOfEachMonth: daysOfEachMonthType = {} // ex: { [jun]: [1, 2, 3, ..., 31] }

    months.forEach((monthIndex: number) => {
        // get the first day of that (index) month in 2024 (year)
        // const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
        //=> Mon Sep 01 2014 00:00:00
        const start = startOfMonth(new Date(year, monthIndex))

        // get the last day of that (index) month in 2024 (year)
        // const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
        //=> Tue Sep 30 2014 23:59:59.999
        const end = endOfMonth(start)

        // Find the weekday of the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = getDay(start) - 1 === -1 ? 0 : getDay(start) - 1

        // get all days in that month
        const daysInThatMonth = eachDayOfInterval({ start, end })
            .map((date) => format(date, 'dd'))

        // Add placeholders for alignment
        const alignedDays = Array(firstDayOfWeek).fill("").concat(daysInThatMonth)

        // get the name of that month also
        const monthName = format(start, 'MMMM')

        // add the month and its days to daysOfEachMonth
        daysOfEachMonth[monthName] = alignedDays
    })

    return daysOfEachMonth
}