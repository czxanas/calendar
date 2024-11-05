import { format } from "date-fns"

const Calendar = () => {
    const result = format(new Date(), 'dd/MM/yyyy')
    return (
        <div>
            <span className="font-semibold">Calendar:</span>
            &nbsp;
            <span>{result}</span>
        </div>
    )
}

export default Calendar