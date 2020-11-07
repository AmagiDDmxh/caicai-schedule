import dj from "dayjs";
import isLeapYearPlugin from "dayjs/plugin/isLeapYear";
dj.extend(isLeapYearPlugin);

const getCurrentMonthDays = () => {
  const now = dj();
  const month = now.month() + 1;
  const isLeapYear = now.isLeapYear();
  const isFeb = month === 2;
  if (isFeb) {
    if (isLeapYear) return 29;
    return 28;
  }
  const ordinaryMonths = [1, 3, 5, 7, 8, 10, 12];
  if (ordinaryMonths.includes(month)) return 31;
  return 31;
};

export const generateMonth = () =>
  Array(getCurrentMonthDays())
    .fill(0)
    .map((_, i) => i + 1);