import { daysNames } from "../constants/days"
import { daysOfEachMonthType } from "../types/daysOfEachMonthType"
import { getDaysOfYear } from "../utils/getDaysOfYear"

const Calendar = () => {
    const year: number = 2024
    const months: daysOfEachMonthType = getDaysOfYear(year)
    return (
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
                                    {day || ' '}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </div>
    )
}

export default Calendar