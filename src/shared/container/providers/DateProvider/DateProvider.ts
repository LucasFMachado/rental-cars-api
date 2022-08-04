import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from './interfaces/IDateProvider';

dayjs.extend(utc);

class DateProvider implements IDateProvider {
  comapreInHours(start_date: Date, end_date: Date): number {
    const startDateUtc = this.convertToUTC(start_date);
    const endDateUtc = this.convertToUTC(end_date);

    return dayjs(endDateUtc).diff(startDateUtc, 'hours');
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  getDateNow(): Date {
    return dayjs().toDate();
  }
}

export { DateProvider };
