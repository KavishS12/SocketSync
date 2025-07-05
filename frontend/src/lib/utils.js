export function formatMessageTime(date) {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const dateString = isToday ? 'Today' : `${day}-${month}-${year}`;
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timeString = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  return `${dateString} ${timeString}`;
}

export function getDateLabel(date) {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return `${day}-${month}-${year}`;
}

export function canEditMessage(messageDate) {
  const messageTime = new Date(messageDate).getTime();
  const currentTime = Date.now();
  const oneMinute = 60 * 1000; // 1 minute in milliseconds
  return currentTime - messageTime <= oneMinute;
}

export function canDeleteMessage(messageDate) {
  const messageTime = new Date(messageDate).getTime();
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  return currentTime - messageTime <= fiveMinutes;
}
