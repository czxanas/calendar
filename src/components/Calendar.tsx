import { memo, useCallback, useEffect } from "react"
import { daysNames } from "../constants/days"
import useCalendarStore from "../stores/calendar"
import { format, isAfter, isBefore, isToday, parse, startOfToday } from "date-fns"
import { AiOutlineLine } from "react-icons/ai";

// inputs where user can click then select the date
// memoize my component to avoid future re-renders
const SelectDate = memo(({ check }: { check: 'check-in' | 'check-out' }) => {
    const { status, setStatus, selectedStart, voidSelectedStart, selectedEnd, voidSelectedEnd, setNewXLeft, setNewYTop } = useCalendarStore()

    useEffect(() => {
        const el = document.querySelector('.inputLeft')
        let animationFrameId: number
        const updatePosition = () => {
            if (el) {
                const rect = el.getBoundingClientRect()
                setNewXLeft(rect.left)
                setNewYTop(rect.top)
            }
            // Schedule the next frame
            animationFrameId = requestAnimationFrame(updatePosition)
        }
        // Start the loop
        updatePosition()
        // return to cancel all animationFrameId(s)
        return () => cancelAnimationFrame(animationFrameId)

    }, [setNewXLeft, setNewYTop])

    const handleStartClick = () => setStatus('start')
    const handleEndClick = () => setStatus('end')
    const handleVoidStart = (e: React.MouseEvent) => { e.stopPropagation(); voidSelectedStart() }
    const handleVoidEnd = (e: React.MouseEvent) => { e.stopPropagation(); voidSelectedEnd() }

    const renderDateField = (
        state: 'start' | 'end',
        label: 'check-in' | 'check-out',
        selectedDate: string | null,
        handleDateClick: () => void,
        handleClearClick: (e: React.MouseEvent) => void
    ) => (
        <div onClick={handleDateClick} className={`calendar-el py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3 inputLeft ${(status && status === state) ? 'ring-blue-500 ring-2' : ''}`}>
            <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" aria-label="Calendar icon for picking a date" />
            {selectedDate ? <span className="whitespace-nowrap">{selectedDate}</span> : <span className="text-white/60 capitalize whitespace-nowrap">{label}</span>}
            <span onClick={handleClearClick} className="ms-auto cursor-pointer" role="button" aria-label={`Clear selected ${label} date`}>&#10006;</span>
        </div>
    )

    return (
        <>
            {check === 'check-in' && renderDateField('start', 'check-in', selectedStart, handleStartClick, handleVoidStart)}
            {check === 'check-out' && renderDateField('end', 'check-out', selectedEnd, handleEndClick, handleVoidEnd)}
        </>
    )
})


// get the list of all days
const CalendarDays = () => {
    const { status, year, daysOfMonthsOfTheYear: months, selectedStart, selectedEnd, voidSelectedEnd, setSelectedStart, setStatus, setSelectedEnd, setNewYear, xLeft, yTop } = useCalendarStore()
    let selectedYear = year
    const monthIndex: { [key: string]: number } = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
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

    const parseDate = (day: string, month: string) => parse(`${day} ${month} ${year}`, 'd MMMM yyyy', new Date())
    const formatDate = (date: Date) => format(date, 'MMM d, yyyy')

    const getDateStatuses = useCallback((date: string) => {
        const isStart = selectedStart === date
        const isEnd = selectedEnd === date
        const isBetween = selectedStart && selectedEnd &&
            isAfter(parse(date, 'MMM d, yyyy', new Date()), parse(selectedStart, 'MMM d, yyyy', new Date())) &&
            isBefore(parse(date, 'MMM d, yyyy', new Date()), parse(selectedEnd, 'MMM d, yyyy', new Date()))

        return { isStart, isEnd, isBetween }
    }, [selectedStart, selectedEnd])

    if (!status) return null

    return (
        <>
            {
                status &&
                <div className={`calendar-popup fixed top-0 left-0 calendar-el pb-8 border px-4 rounded-lg h-[500px] w-[325px] overflow-y-scroll overflow-x-hidden bg-white text-black`}
                    style={{ top: `${yTop + 40}px`, left: `${xLeft}px` }}>
                    {Object.entries(months).map(([month, days]) => {
                        if (month === 'January' && format(startOfToday(), 'd MMMM yyyy').split(' ')[1] != "January") {
                            selectedYear += 1
                            setNewYear(selectedYear)
                        }
                        return (
                            <div key={month}>
                                <h2 className="font-semibold my-5 text-center">{month} {selectedYear}</h2>
                                <div className="grid grid-cols-7 gap-1">
                                    {daysNames.map((day) => <div key={day} className="font-thin text-sm text-center mb-2">{day}</div>)}
                                </div>
                                <ul className="grid grid-cols-7 gap-1">
                                    {days.map((day: string, index: number) => {
                                        if (!day) return <li key={index + day} />
                                        const date = formatDate(parseDate(day, month))
                                        const { isStart, isEnd, isBetween } = getDateStatuses(date)
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
                                                {isBefore(new Date(selectedYear, monthIndex[month], Number(day)), startOfToday()) && <div className="flex justify-center items-center h-[100%]"><AiOutlineLine /></div>}
                                                {isToday(new Date(selectedYear, monthIndex[month], Number(day))) && <div className="border-2 rounded-full border-[#d8e2dc]">{day}</div>}
                                                {isAfter(new Date(selectedYear, monthIndex[month], Number(day)), startOfToday()) && <div className="">{day}</div>}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            }
        </>
    )
}


const Calendar = () => {
    const { setDaysOfMonthsOfTheNewYear, setStatus } = useCalendarStore()

    useEffect(() => {
        setDaysOfMonthsOfTheNewYear()
    }, [setDaysOfMonthsOfTheNewYear])

    useEffect(() => {
        const handleClickOutsideCalendar = (event: MouseEvent) => {
            const calendarElements = document.querySelectorAll('.calendar-el')
            const target = event.target as HTMLElement
            const isOutside = !Array.from(calendarElements).some(element => element.contains(target))
            if (isOutside) setStatus(null)
        }
        document.addEventListener('click', handleClickOutsideCalendar)
        return () => document.removeEventListener('click', handleClickOutsideCalendar)
    }, [setStatus])

    return (
        <div className="flex flex-col">
            {/* Date Picker Display */}
            <div className="relative w-[325px] text-sm grid grid-cols-2 gap-2">
                <SelectDate check="check-in" />
                <SelectDate check="check-out" />
            </div>

            {/* Calendar Display */}
            <CalendarDays />
        </div>
    )
}

export default Calendar