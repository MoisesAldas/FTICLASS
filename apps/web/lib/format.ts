/**
 * Formats a time string (e.g., "08:00:00" or "08:00") to 12h format (e.g., "8:00 AM").
 */
export function formatTimeTo12h(time: string | undefined | null): string {
  if (!time) return "--:--";
  
  // Split parts (handles HH:mm:ss or HH:mm)
  const parts = (time as string).split(':');
  const hoursStr = parts[0] || "0";
  const minutesStr = parts[1];
  
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  
  if (isNaN(hours)) return time;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes} ${ampm}`;
}
