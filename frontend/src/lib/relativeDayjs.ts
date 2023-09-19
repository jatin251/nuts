import initialDayjs from 'dayjs';
import relative from 'dayjs/plugin/relativeTime';
initialDayjs.extend(relative);

/** A dayjs object with pre-extended with relative time. */
export const dayjs = initialDayjs;
