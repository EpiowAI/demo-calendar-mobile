import { View, Text, Pressable, StyleSheet } from "react-native";
import { format } from "date-fns";
import { colors, eventColors, eventColorsBg } from "../lib/colors";
import type { CalendarEvent } from "../lib/api";

interface Props {
	event: CalendarEvent;
	onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: Props) {
	const accent = eventColors[event.color] || eventColors.blue;
	const bg = eventColorsBg[event.color] || eventColorsBg.blue;
	const start = new Date(event.startAt);
	const end = new Date(event.endAt);

	return (
		<View style={[styles.card, { backgroundColor: bg, borderLeftColor: accent }]}>
			<View style={styles.header}>
				<View style={{ flex: 1 }}>
					<Text style={styles.title}>{event.title}</Text>
					<Text style={[styles.time, { color: accent }]}>
						{format(start, "HH:mm")} — {format(end, "HH:mm")}
					</Text>
				</View>
				<Pressable
					onPress={() => onDelete(event.id)}
					style={styles.deleteBtn}
					hitSlop={8}
				>
					<Text style={styles.deleteText}>✕</Text>
				</Pressable>
			</View>
			{event.description ? (
				<Text style={styles.description} numberOfLines={2}>
					{event.description}
				</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderLeftWidth: 3,
		borderRadius: 16,
		padding: 14,
		marginBottom: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	title: {
		fontSize: 15,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	time: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: 2,
	},
	description: {
		fontSize: 12,
		color: colors.textSecondary,
		marginTop: 6,
	},
	deleteBtn: {
		padding: 4,
		borderRadius: 8,
	},
	deleteText: {
		fontSize: 12,
		color: colors.textMuted,
	},
});
