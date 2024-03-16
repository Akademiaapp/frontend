export interface CalendarEvent {
	name: string;
	start: Date;
	end: Date;
	x?: string;
}

export function toHoursAndMinutes(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return { hours, minutes };
}

export function prettyTime(totalMinutes: number) {
	const { hours, minutes } = toHoursAndMinutes(totalMinutes);
	return hours + ':' + minutes.toString().padStart(2, '0');
}
