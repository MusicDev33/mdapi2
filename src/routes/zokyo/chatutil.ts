/*
This is just for various chat functions. I just NEED them out of my creation.ts file.
*/

export const getDate = (): string => {
  const date: Date = new Date();

  const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month: string = months[date.getMonth()];

  const suffixes: string[] = ['st', 'nd', 'rd', 'th'];
  let day: number = date.getDate();
  let suffix: string;
  if (day < 4 || day > 20) {
    suffix = suffixes[day % 10 - 1] || suffixes[3];
  } else {
    suffix = suffixes[3];
  }
  const dayString: string = `${day}${suffix}`;

  const year: number = date.getFullYear();

  let hours: number = date.getHours();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  const minutes: number = date.getMinutes();

  const dateString: string = `${month} ${dayString}, ${year}, ${hours}:${minutes} ${ampm}`;

  const utcString: string = date.toUTCString();

  return `${dateString} (${utcString})`;
};
