interface IDateProvider {
  comapreInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  getDateNow(): Date;
}

export { IDateProvider };
