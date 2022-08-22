interface IDateProvider {
  comapreInHours(start_date: Date, end_date: Date): number;
  compareInDays(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  getDateNow(): Date;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  compareIfBefore(initial_date: Date, final_date: Date): boolean;
}

export { IDateProvider };
