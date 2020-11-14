import dj from "dayjs";

const getCurrentDysInMonth = () => {
  const prevDaysInMonth = dj().month(dj().month() - 1).daysInMonth()
  const prevDaysArray = Array.from({ length: prevDaysInMonth - 25 }).map((_, index) => 26 + index)
  const currDaysArray = Array.from({ length: 25 }).map((_, index) => index + 1)
  return prevDaysArray.concat(currDaysArray)
};

export const MONTH = getCurrentDysInMonth()
