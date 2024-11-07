import { memo, useCallback, useEffect } from "react"
import { daysNames } from "../constants/days"
import useCalendarStore from "../stores/calendar"
import { format, isAfter, isBefore, parse } from "date-fns"


// memoize my component to avoid future re-renders
const SelectDate = memo(({ check }: { check: 'check-in' | 'check-out' }) => {
    const { setStatus, selectedStart, voidSelectedStart, selectedEnd, voidSelectedEnd } = useCalendarStore()

    const handleStartClick = () => setStatus('start')
    const handleEndClick = () => setStatus('end')
    const handleVoidStart = (e: React.MouseEvent) => { e.stopPropagation(); voidSelectedStart() }
    const handleVoidEnd = (e: React.MouseEvent) => { e.stopPropagation(); voidSelectedEnd() }

    const renderDateField = (
        label: 'check-in' | 'check-out',
        selectedDate: string | null,
        handleDateClick: () => void,
        handleClearClick: (e: React.MouseEvent) => void
    ) => (
        <div onClick={handleDateClick} className="py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3">
            <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" aria-label="Calendar icon for picking a date" />
            {selectedDate ? <span>{selectedDate}</span> : <span className="text-white/60">{label}</span>}
            <span onClick={handleClearClick} className="ms-auto cursor-pointer" role="button" aria-label={`Clear selected ${label} date`}>&#10006;</span>
        </div>
    )

    return (
        <>
            {check === 'check-in' && renderDateField('check-in', selectedStart, handleStartClick, handleVoidStart)}
            {check === 'check-out' && renderDateField('check-out', selectedEnd, handleEndClick, handleVoidEnd)}
        </>
    )
})


const CalendarDays = () => {
    const { status, year, daysOfMonthsOfTheYear: months, selectedStart, selectedEnd, voidSelectedEnd, setSelectedStart, setStatus, setSelectedEnd } = useCalendarStore()

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
    }, [status, year, selectedStart, selectedEnd, setSelectedEnd, setSelectedStart, voidSelectedEnd, setStatus])

    return (
        <>
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
        </>
    )
}


const Calendar = () => {
    const { setDaysOfMonthsOfTheNewYear } = useCalendarStore()

    useEffect(() => {
        setDaysOfMonthsOfTheNewYear()
    }, [setDaysOfMonthsOfTheNewYear])

    return (
        <div className="flex flex-col">
            {/* Date Picker Display */}
            <div className="w-[325px] text-sm grid grid-cols-2 gap-2">
                <SelectDate check="check-in" />
                <SelectDate check="check-out" />
            </div>

            {/* Calendar Display */}
            <CalendarDays />
        </div>
    )
}

export default Calendar