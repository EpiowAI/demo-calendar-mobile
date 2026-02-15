import { useState, useMemo, useCallback } from "react";
import {
	View,
	Text,
	Pressable,
	FlatList,
	StyleSheet,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import {
	startOfMonth,
	endOfMonth,
	format,
} from "date-fns";
import { colors, eventColors } from "../lib/colors";
import { useEvents, useDeleteEvent } from "../hooks/useEvents";
import { EventCard } from "../components/EventCard";
import { CreateEventSheet } from "../components/CreateEventSheet";
import type { CalendarEvent } from "../lib/api";

export function CalendarScreen() {
	const today = format(new Date(), "yyyy-MM-dd");
	const [selectedDate, setSelectedDate] = useState(today);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [showCreate, setShowCreate] = useState(false);

	const from = startOfMonth(currentMonth).toISOString();
	const to = endOfMonth(currentMonth).toISOString();
	const { data: events = [], isLoading } = useEvents(from, to);
	const deleteEvent = useDeleteEvent();

	// Build marked dates for calendar
	const markedDates = useMemo(() => {
		const marks: Record<string, any> = {};

		// Group events by date
		for (const ev of events) {
			const key = format(new Date(ev.startAt), "yyyy-MM-dd");
			if (!marks[key]) {
				marks[key] = { dots: [], marked: true };
			}
			if (marks[key].dots.length < 3) {
				marks[key].dots.push({
					key: ev.id,
					color: eventColors[ev.color] || eventColors.blue,
				});
			}
		}

		// Always highlight selected date
		marks[selectedDate] = {
			...(marks[selectedDate] || {}),
			selected: true,
			selectedColor: colors.accent + "30",
			selectedTextColor: colors.accent,
		};

		return marks;
	}, [events, selectedDate]);

	// Events for selected day
	const dayEvents = useMemo(() => {
		return events
			.filter((ev) => format(new Date(ev.startAt), "yyyy-MM-dd") === selectedDate)
			.sort(
				(a, b) =>
					new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
			);
	}, [events, selectedDate]);

	const handleDayPress = useCallback((day: DateData) => {
		setSelectedDate(day.dateString);
	}, []);

	const handleDelete = useCallback(
		(id: string) => {
			deleteEvent.mutate(id);
		},
		[deleteEvent],
	);

	const selectedDateObj = new Date(selectedDate + "T00:00:00");

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* Header */}
			<View style={styles.header}>
				<View>
					<View style={styles.liveBadge}>
						<View style={styles.liveDot} />
						<Text style={styles.liveText}>Live</Text>
					</View>
					<Text style={styles.title}>Calendar</Text>
				</View>
			</View>

			{/* Calendar */}
			<View style={styles.calendarWrapper}>
				<Calendar
					current={format(currentMonth, "yyyy-MM-dd")}
					onDayPress={handleDayPress}
					onMonthChange={(m: DateData) =>
						setCurrentMonth(new Date(m.year, m.month - 1))
					}
					markingType="multi-dot"
					markedDates={markedDates}
					theme={{
						backgroundColor: "transparent",
						calendarBackground: "transparent",
						textSectionTitleColor: colors.textMuted,
						dayTextColor: colors.textPrimary,
						todayTextColor: colors.accent,
						todayBackgroundColor: colors.accent + "15",
						monthTextColor: colors.textPrimary,
						textMonthFontWeight: "700",
						textMonthFontSize: 18,
						textDayFontSize: 14,
						textDayFontWeight: "500",
						arrowColor: colors.textSecondary,
						textDisabledColor: colors.textMuted + "50",
						textDayHeaderFontSize: 11,
						textDayHeaderFontWeight: "600",
					}}
					style={{ borderRadius: 20 }}
				/>
			</View>

			{/* Day detail */}
			<View style={styles.dayHeader}>
				<View>
					<Text style={styles.dayOfWeek}>
						{format(selectedDateObj, "EEEE")}
					</Text>
					<Text style={styles.dayDate}>
						{format(selectedDateObj, "d MMM")}
					</Text>
				</View>
				<Pressable
					onPress={() => setShowCreate(true)}
					style={styles.addBtn}
				>
					<Text style={styles.addBtnText}>+ New Event</Text>
				</Pressable>
			</View>

			{/* Events list */}
			{dayEvents.length === 0 ? (
				<View style={styles.emptyState}>
					<Text style={styles.emptyEmoji}>📅</Text>
					<Text style={styles.emptyText}>Nothing scheduled</Text>
					<Text style={styles.emptySubtext}>Tap + to add an event</Text>
				</View>
			) : (
				<FlatList
					data={dayEvents}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<EventCard event={item} onDelete={handleDelete} />
					)}
					contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
					showsVerticalScrollIndicator={false}
				/>
			)}

			{/* Create sheet */}
			<CreateEventSheet
				visible={showCreate}
				date={selectedDateObj}
				onClose={() => setShowCreate(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.surface,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 8,
	},
	liveBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.accent + "18",
		alignSelf: "flex-start",
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginBottom: 6,
		gap: 6,
	},
	liveDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.accent,
	},
	liveText: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.accent,
	},
	title: {
		fontSize: 32,
		fontWeight: "800",
		color: colors.textPrimary,
		letterSpacing: -0.5,
	},
	calendarWrapper: {
		marginHorizontal: 16,
		backgroundColor: colors.surfaceRaised + "99",
		borderRadius: 24,
		borderWidth: 1,
		borderColor: colors.borderSubtle + "40",
		overflow: "hidden",
		marginBottom: 16,
	},
	dayHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		marginBottom: 12,
	},
	dayOfWeek: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textMuted,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	dayDate: {
		fontSize: 22,
		fontWeight: "800",
		color: colors.textPrimary,
	},
	addBtn: {
		backgroundColor: colors.accent,
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 10,
		shadowColor: colors.accent,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	addBtnText: {
		fontSize: 13,
		fontWeight: "700",
		color: "#fff",
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 40,
	},
	emptyEmoji: {
		fontSize: 40,
		marginBottom: 10,
	},
	emptyText: {
		fontSize: 14,
		color: colors.textMuted,
	},
	emptySubtext: {
		fontSize: 12,
		color: colors.textMuted + "80",
		marginTop: 4,
	},
});
