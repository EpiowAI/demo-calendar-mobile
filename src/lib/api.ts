const API_BASE = "https://demo-taskboard.vercel.app/api";

export interface CalendarEvent {
	id: string;
	title: string;
	description: string | null;
	startAt: string;
	endAt: string;
	color: "blue" | "purple" | "rose" | "amber" | "emerald" | "cyan";
	createdAt: string;
	updatedAt: string;
}

export interface CreateEventInput {
	title: string;
	description?: string;
	startAt: string;
	endAt: string;
	color?: string;
}

export async function fetchEvents(
	from: string,
	to: string,
): Promise<CalendarEvent[]> {
	const res = await fetch(`${API_BASE}/events?from=${from}&to=${to}`);
	const data = await res.json();
	return data.events;
}

export async function createEvent(
	input: CreateEventInput,
): Promise<CalendarEvent> {
	const res = await fetch(`${API_BASE}/events`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
	await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
}
