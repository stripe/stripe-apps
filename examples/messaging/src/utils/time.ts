import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getEpochMsDisplayText = (date: number) => dayjs(date).fromNow();
