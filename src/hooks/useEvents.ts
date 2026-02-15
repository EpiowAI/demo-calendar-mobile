import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchEvents,
	createEvent,
	deleteEvent,
	type CreateEventInput,
} from "../lib/api";

export function useEvents(from: string, to: string) {
	return useQuery({
		queryKey: ["events", from, to],
		queryFn: () => fetchEvents(from, to),
	});
}

export function useCreateEvent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateEventInput) => createEvent(input),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
	});
}

export function useDeleteEvent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteEvent(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
	});
}
