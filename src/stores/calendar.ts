import { getYear } from "date-fns";
import { create } from "zustand";
import { calendarStoreType } from "../types/calendarStoreType";

const useCalendarStore = create<calendarStoreType>(() => {
    // const variable = value 

    return {
        year: getYear(new Date()),
        numberL: 2
    }
})

export default useCalendarStore