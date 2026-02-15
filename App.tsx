import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarScreen } from "./src/screens/CalendarScreen";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 30_000 },
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<CalendarScreen />
		</QueryClientProvider>
	);
}
