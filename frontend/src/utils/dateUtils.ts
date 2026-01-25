import { format, startOfDay, isSameDay, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const isToday = (date: Date | string): boolean => {
  return isSameDay(new Date(date), new Date());
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getWeekDates = (date: Date = new Date()): Date[] => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return eachDayOfInterval({ start, end });
};

export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = new Date();
  const start = subDays(end, days - 1);
  return { start: startOfDay(start), end: startOfDay(end) };
};

export const getDayName = (date: Date | string): string => {
  return format(new Date(date), 'EEEE');
};

export const getShortDayName = (date: Date | string): string => {
  return format(new Date(date), 'EEE');
};
