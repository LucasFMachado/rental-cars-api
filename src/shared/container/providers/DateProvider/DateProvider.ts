import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { injectable } from 'tsyringe';

import { IDateProvider } from './interfaces/IDateProvider';

dayjs.extend(utc);

@injectable()
class DateProvider implements IDateProvider {
  comapreInHours(start_date: Date, end_date: Date): number {
    const startDateUtc = this.convertToUTC(start_date);
    const endDateUtc = this.convertToUTC(end_date);

    return dayjs(endDateUtc).diff(startDateUtc, 'hours');
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const startDateUtc = this.convertToUTC(start_date);
    const endDateUtc = this.convertToUTC(end_date);

    return dayjs(endDateUtc).diff(startDateUtc, 'days');
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  getDateNow(): Date {
    return dayjs().toDate();
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hours').toDate();
  }

  compareIfBefore(initial_date: Date, final_date: Date): boolean {
    return dayjs(initial_date).isBefore(final_date);
  }
}

export { DateProvider };
