import { DAYS, MONTHS } from './constants';

function getCurrentWeekNo(calendar) {
  let time = new Date();
  let day = time.getDay();
  let weekDay = DAYS[day];
  let monthDay = time.getDate();
  let currentMonth = time.getMonth();
  let month = MONTHS[currentMonth];

  for (let i = 0; i < calendar.length; i++) {
    for (let w = 0; w < calendar[i].length; w++) {
      if (calendar[i][w].weekDay === weekDay && calendar[i][w].monthDay === monthDay && calendar[i][w].month === month) {
        return i;
      }
    }
  }
}

export default getCurrentWeekNo;
