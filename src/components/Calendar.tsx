import { daysOfEachMonthType } from "../types/daysOfEachMonthType"
import { getDaysOfYear } from "../utils/getDaysOfYear"

const Calendar = () => {
    const months: daysOfEachMonthType = getDaysOfYear(2024)
    return (
        <div>
            {
                Object.entries(months).map(([month, days]) => (
                    <div key={month}>
                        <h2 className="font-semibold mt-2.5 mb-1">{month}</h2>
                        <ul className="grid grid-cols-7 gap-1">
                            {days.map((day) => (
                                <li className="border rounded py-0.5 px-1 cursor-pointer"
                                    key={day}>
                                    {day}
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