import { useState } from "react"
import { daysNames } from "../constants/days"
import { daysOfEachMonthType } from "../types/daysOfEachMonthType"
import { getDaysOfYear } from "../utils/getDaysOfYear"
import { format } from "date-fns"

const Calendar = () => {
    const year: number = 2024
    const months: daysOfEachMonthType = getDaysOfYear(year)
    // Store the selected date and formatted date
    const [selectedDate, setSelectedDate] = useState<{ day: string, month: string, year: number } | null>(null)
    const [formattedDate, setFormattedDate] = useState<string | null>(null)

    const handleDateClick = (day: string, month: string, year: number) => {
        setSelectedDate({ day, month, year })

        // Format date as "Jan 5, 2024" using date-fns
        const date = new Date(`${month} ${day}, ${year}`)
        setFormattedDate(format(date, "MMM d, yyyy"))
    }

    return (
        <div className="flex flex-col">
            {/* Date Picker Display */}
            <div className="w-[300px] text-sm py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3">
                <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" />
                {formattedDate ? <span>{formattedDate}</span> : <span className="text-white/60">Pick a date</span>}
            </div>

            {/* Calendar Display */}
            <div className="pb-8 border px-4 rounded-lg h-[500px] w-[300px] overflow-y-scroll overflow-x-hidden bg-white text-black">
                {
                    Object.entries(months).map(([month, days]) => (
                        <div key={month}>
                            <h2 className="font-semibold my-5 text-center">{month} {year}</h2>
                            <div className="grid grid-cols-7 gap-1">
                                {
                                    daysNames.map((day) => <div key={day} className="font-thin text-sm text-center mb-2">{day}</div>)
                                }
                            </div>
                            <ul className="grid grid-cols-7 gap-1">
                                {days.map((day, index) => (
                                    day ?
                                        <li
                                            key={index} onClick={() => handleDateClick(day, month, year)}
                                            className={`rounded py-0.5 px-1 cursor-pointer text-center ${selectedDate?.day === day && selectedDate?.month === month ? "bg-blue-600 text-white" : ""}`}
                                        >
                                            {day ? <span >{day}</span> : null}
                                        </li>
                                        :
                                        <li key={index + day}></li>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Calendar