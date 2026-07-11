
export function getWIBDate(date?: Date | string | number): Date {
  const baseDate = date ? new Date(date) : new Date();
  // Add 7 hours to current absolute time to shift into WIB timezone
  const wibTime = new Date(baseDate.getTime() + 7 * 60 * 60 * 1000);
  // Extract the YYYY-MM-DD in UTC
  const wibDateString = wibTime.toISOString().split('T')[0];
  // Parse back as UTC midnight
  return new Date(`${wibDateString}T00:00:00.000Z`);
}

export function startOfWeekWIB(date: Date): Date {
  // Assuming the passed date is already a UTC midnight date like what getWIBDate returns
  const d = new Date(date);
  // getUTCDay() since we normalize to UTC midnight
  const day = d.getUTCDay();
  // Assuming Monday is the start of the week
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
