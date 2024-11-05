import { daysNames } from "../constants/days"
import { daysOfEachMonthType } from "../types/daysOfEachMonthType"
import { getDaysOfYear } from "../utils/getDaysOfYear"

const Calendar = () => {
    const months: daysOfEachMonthType = getDaysOfYear(2024)
    return (
        <div className="pb-8 border px-4 rounded-lg h-[500px] overflow-y-scroll overflow-x-hidden">
            {
                Object.entries(months).map(([month, days]) => (
                    <div key={month}>
                        <h2 className="font-semibold mt-5 mb-1 text-center">{month}</h2>
                        <div className="grid grid-cols-7 gap-1">
                            {
                                daysNames.map((day) => <div key={day} className="italic">{day}</div>)
                            }
                        </div>
                        <ul className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => (
                                <li className="border rounded py-0.5 px-1 cursor-pointer" key={index}>
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