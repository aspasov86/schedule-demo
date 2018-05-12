import { DAYS, MONTHS } from './constants';

function getCalendar(year) {
  let wholeYear = [];
  let yearByWeeks = [];

  for (let i = 0; i < 12; i++) {
    wholeYear.push(...getDaysForOneMonth(year, i))
  }


  function getYearByWeeks(wholeYear, year) {
    let yearByWeeks = [];
    //for 2018, this should be 365/7 => around 53
    let noOfWeeks = Math.ceil(getTotalDaysInYear(year) / 7);

    for (let i = 0; i < noOfWeeks; i++) {
      yearByWeeks[i] = [];
    }
    let weekCounter = 0;
    for (var i = 0; i < wholeYear.length; i++) {
      if (wholeYear[i].weekDay === "Sat") {
        yearByWeeks[weekCounter].push(wholeYear[i]);
        weekCounter++;
      } else {
        yearByWeeks[weekCounter].push(wholeYear[i]);
      }
    }
    return yearByWeeks;
  }

  function getTotalDaysInYear(year) {
    let totalDays = 0;
    for (let i = 0; i < 12; i++) {
      totalDays += new Date(year, i, 0).getDate();
    }
    return totalDays;
  }


  function getDaysForOneMonth(year, month) {
    //dayCounter is the current day in a week
    let dayCounter = new Date(year, month, 1).getDay();
    let totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    let theMonth = [];

    for (let i = 0; i < totalDaysInMonth; i++) {
      theMonth.push({
        weekDay: DAYS[dayCounter],
        monthDay: i + 1,
        month: MONTHS[month]
      });
      //if it reaches the end of the week, it should reset itself
      dayCounter === DAYS.length - 1 ? dayCounter = 0 : dayCounter++;
    }
    return theMonth;
  }

  yearByWeeks = getYearByWeeks(wholeYear, year);
  return yearByWeeks;
}

export default getCalendar;
