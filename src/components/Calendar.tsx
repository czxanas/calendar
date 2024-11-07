import { useCallback, useEffect, useState } from "react"
import { daysNames } from "../constants/days"
import useCalendarStore from "../stores/calendar"
import { format, isAfter, isBefore, parse } from "date-fns"

const Calendar = () => {
    const { year, daysOfMonthsOfTheYear: months, setDaysOfMonthsOfTheNewYear, selectedStart, selectedEnd, setSelectedStart, setSelectedEnd, voidSelectedStart, voidSelectedEnd } = useCalendarStore()
    const [status, setStatus] = useState<null | 'start' | 'end'>(null)

    const handleDateClick = useCallback((day: string, month: string) => {
        if (status === 'start') {
            const formattedDate = format(parse(`${day} ${month} ${year}`, 'd MMMM yyyy', new Date()), 'MMM d, yyyy')
            // Check if the new start date is after the current end date
            if (selectedEnd && isAfter(parse(formattedDate, 'MMM d, yyyy', new Date()), parse(selectedEnd, 'MMM d, yyyy', new Date()))) {
                voidSelectedEnd() // Clear end date if start date is newer
            }
            setSelectedStart(day, month, year)
            setStatus(null)
        }
        if (status === 'end') {
            const formattedDate = format(parse(`${day} ${month} ${year}`, 'd MMMM yyyy', new Date()), 'MMM d, yyyy')
            // Check if end date is after start date
            if (selectedStart && isBefore(parse(formattedDate, 'MMM d, yyyy', new Date()), parse(selectedStart, 'MMM d, yyyy', new Date()))) {
                return
            }
            setSelectedEnd(day, month, year)
            setStatus(null)
        }
    }, [status, year, setSelectedStart, selectedStart, setSelectedEnd, selectedEnd, voidSelectedEnd])

    useEffect(() => {
        setDaysOfMonthsOfTheNewYear()
    }, [setDaysOfMonthsOfTheNewYear])

    return (
        <div className="flex flex-col">
            {/* Date Picker Display */}
            <div className="w-[325px] text-sm grid grid-cols-2 gap-2">
                <div onClick={() => setStatus('start')} className="py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3">
                    <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" />
                    {selectedStart ? <span>{selectedStart}</span> : <span className="text-white/60">Check-in</span>}
                    <span onClick={(e) => { e.stopPropagation(); voidSelectedStart() }} className="ms-auto cursor-pointer">&#10006;</span>
                </div>
                <div onClick={() => setStatus('end')} className="py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3">
                    <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" />
                    {selectedEnd ? <span>{selectedEnd}</span> : <span className="text-white/60">Check-out</span>}
                    <span onClick={(e) => { e.stopPropagation(); voidSelectedEnd() }} className="ms-auto cursor-pointer">&#10006;</span>
                </div>
            </div>

            {/* Calendar Display */}
            {
                status &&
                <div className="pb-8 border px-4 rounded-lg h-[500px] w-[325px] overflow-y-scroll overflow-x-hidden bg-white text-black">
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
                                    {days.map((day: string, index: number) => {
                                        if (!day) return <li key={index + day}></li>

                                        const date = format(parse(`${day} ${month} ${year}`, 'd MMMM yyyy', new Date()), 'MMM d, yyyy')
                                        const isStart = selectedStart === date
                                        const isEnd = selectedEnd === date
                                        const isBetween = selectedStart && selectedEnd &&
                                            isAfter(parse(date, 'MMM d, yyyy', new Date()), parse(selectedStart, 'MMM d, yyyy', new Date())) &&
                                            isBefore(parse(date, 'MMM d, yyyy', new Date()), parse(selectedEnd, 'MMM d, yyyy', new Date()))

                                        return (
                                            <li
                                                key={index}
                                                onClick={() => handleDateClick(day, month)}
                                                className={`rounded py-0.5 px-1 cursor-pointer text-center
                                                    ${isStart ? 'bg-blue-500 text-white' : ''}
                                                    ${isEnd ? 'bg-blue-500 text-white' : ''}
                                                    ${isBetween ? 'bg-gray-200' : ''}
                                                `}
                                            >
                                                {day}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Calendar