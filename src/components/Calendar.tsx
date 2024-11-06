import { useState } from "react"
import { daysNames } from "../constants/days"
import { daysOfEachMonthType } from "../types/daysOfEachMonthType"
import { getDaysOfYear } from "../utils/getDaysOfYear"

const Calendar = () => {
    const year: number = 2024
    const months: daysOfEachMonthType = getDaysOfYear(year)
    const [chosenDate, setChosenDate] = useState<string | null>(null)

    const handleNewDateSetting = (day: string, month: string, year: number) => {
        const newDate = month + ' ' + day + ', ' + year
        setChosenDate(newDate)
    }

    return (
        <>
            <div className="w-[300px] text-sm py-1.5 px-2 mb-5 rounded-md border border-white/60 flex items-center gap-3">
                <img src="/assets/images/calendar.svg" className="cursor-pointer max-w-5" title="Pick a date" />
                {chosenDate ?
                    <span>{chosenDate}</span> :
                    <span className="text-white/60">Pick a date</span>
                }
            </div>
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
                                    <li className="rounded py-0.5 px-1 cursor-pointer text-center" key={index}>
                                        {day ? <span onClick={() => handleNewDateSetting(day, month, year)}>{day}</span> : ' '}
                                        {/* {day || ' '} */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Calendar