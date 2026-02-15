import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	ScrollView,
	StyleSheet,
	Modal,
	ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import { colors, eventColors } from "../lib/colors";
import { useCreateEvent } from "../hooks/useEvents";

const COLOR_OPTIONS = ["blue", "purple", "rose", "amber", "emerald", "cyan"] as const;

interface Props {
	visible: boolean;
	date: Date;
	onClose: () => void;
}

export function CreateEventSheet({ visible, date, onClose }: Props) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startHour, setStartHour] = useState("09");
	const [startMin, setStartMin] = useState("00");
	const [endHour, setEndHour] = useState("10");
	const [endMin, setEndMin] = useState("00");
	const [selectedColor, setSelectedColor] = useState<string>("blue");
	const createEvent = useCreateEvent();

	const handleCreate = async () => {
		if (!title.trim()) return;
		const dateStr = format(date, "yyyy-MM-dd");
		await createEvent.mutateAsync({
			title: title.trim(),
			description: description.trim() || undefined,
			startAt: new Date(`${dateStr}T${startHour}:${startMin}:00`).toISOString(),
			endAt: new Date(`${dateStr}T${endHour}:${endMin}:00`).toISOString(),
			color: selectedColor,
		});
		setTitle("");
		setDescription("");
		setStartHour("09");
		setStartMin("00");
		setEndHour("10");
		setEndMin("00");
		setSelectedColor("blue");
		onClose();
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.backdrop}>
				<View style={styles.sheet}>
					<View style={styles.handle} />

					<View style={styles.headerRow}>
						<Text style={styles.sheetTitle}>New Event</Text>
						<Pressable onPress={onClose} hitSlop={8}>
							<Text style={styles.closeBtn}>✕</Text>
						</Pressable>
					</View>

					<Text style={styles.dateLabel}>{format(date, "EEEE, d MMMM yyyy")}</Text>

					<ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 16 }}>
						{/* Title */}
						<Text style={styles.label}>Title</Text>
						<TextInput
							value={title}
							onChangeText={setTitle}
							placeholder="Meeting with the team…"
							placeholderTextColor={colors.textMuted}
							style={styles.input}
							autoFocus
						/>

						{/* Time row */}
						<View style={styles.timeRow}>
							<View style={{ flex: 1 }}>
								<Text style={styles.label}>Start</Text>
								<View style={styles.timeInputRow}>
									<TextInput
										value={startHour}
										onChangeText={setStartHour}
										style={[styles.timeInput, { flex: 1 }]}
										keyboardType="number-pad"
										maxLength={2}
									/>
									<Text style={styles.timeSep}>:</Text>
									<TextInput
										value={startMin}
										onChangeText={setStartMin}
										style={[styles.timeInput, { flex: 1 }]}
										keyboardType="number-pad"
										maxLength={2}
									/>
								</View>
							</View>
							<View style={{ width: 16 }} />
							<View style={{ flex: 1 }}>
								<Text style={styles.label}>End</Text>
								<View style={styles.timeInputRow}>
									<TextInput
										value={endHour}
										onChangeText={setEndHour}
										style={[styles.timeInput, { flex: 1 }]}
										keyboardType="number-pad"
										maxLength={2}
									/>
									<Text style={styles.timeSep}>:</Text>
									<TextInput
										value={endMin}
										onChangeText={setEndMin}
										style={[styles.timeInput, { flex: 1 }]}
										keyboardType="number-pad"
										maxLength={2}
									/>
								</View>
							</View>
						</View>

						{/* Description */}
						<Text style={styles.label}>Notes</Text>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Optional details…"
							placeholderTextColor={colors.textMuted}
							style={[styles.input, { height: 60, textAlignVertical: "top" }]}
							multiline
						/>

						{/* Color */}
						<Text style={styles.label}>Color</Text>
						<View style={styles.colorRow}>
							{COLOR_OPTIONS.map((c) => (
								<Pressable
									key={c}
									onPress={() => setSelectedColor(c)}
									style={[
										styles.colorDot,
										{
											backgroundColor: eventColors[c],
											transform: [{ scale: selectedColor === c ? 1.2 : 1 }],
											borderWidth: selectedColor === c ? 2 : 0,
											borderColor: "#fff",
										},
									]}
								/>
							))}
						</View>

						{/* Create button */}
						<Pressable
							onPress={handleCreate}
							disabled={createEvent.isPending || !title.trim()}
							style={[
								styles.createBtn,
								(!title.trim() || createEvent.isPending) && { opacity: 0.5 },
							]}
						>
							{createEvent.isPending ? (
								<ActivityIndicator color="#fff" size="small" />
							) : (
								<Text style={styles.createBtnText}>Create Event</Text>
							)}
						</Pressable>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	sheet: {
		backgroundColor: colors.surfaceRaised,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 24,
		paddingBottom: 40,
		maxHeight: "85%",
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.borderSubtle,
		alignSelf: "center",
		marginTop: 12,
		marginBottom: 16,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	sheetTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	closeBtn: {
		fontSize: 16,
		color: colors.textMuted,
		padding: 4,
	},
	dateLabel: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 4,
	},
	label: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.textSecondary,
		marginBottom: 6,
		marginTop: 14,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.borderSubtle + "66",
		padding: 14,
		fontSize: 14,
		color: colors.textPrimary,
	},
	timeRow: {
		flexDirection: "row",
	},
	timeInputRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.borderSubtle + "66",
		paddingHorizontal: 12,
	},
	timeInput: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		textAlign: "center",
		paddingVertical: 10,
	},
	timeSep: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textMuted,
		marginHorizontal: 2,
	},
	colorRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 4,
	},
	colorDot: {
		width: 28,
		height: 28,
		borderRadius: 14,
	},
	createBtn: {
		backgroundColor: colors.accent,
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 24,
		shadowColor: colors.accent,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	createBtnText: {
		fontSize: 15,
		fontWeight: "700",
		color: "#fff",
	},
});
