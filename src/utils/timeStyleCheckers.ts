import dayjs from "dayjs";

//compare input date to current/local time/date
export const isPast = (dateTime: Date) => {
	return dayjs().diff(dayjs(dateTime)) > 0;
};
