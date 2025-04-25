import { useCallback, useEffect, useState } from "react";

// Change function name from useVisitedVenues to useVisitedStores
export function useVisitedStores() {
	const [visitedStores, setVisitedStores] = useState<string[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("visitedStores");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					setVisitedStores(parsed);
				}
			} catch (e) {
				console.error("Failed to parse visited stores:", e);
			}
		}
	}, []);

	// Toggle visited status
	const toggleVisited = useCallback((id: string) => {
		setVisitedStores((prev) => {
			const newState = prev.includes(id)
				? prev.filter((storeId) => storeId !== id)
				: [...prev, id];

			localStorage.setItem("visitedStores", JSON.stringify(newState));
			return newState;
		});
	}, []);

	// Check if a store is visited
	const isVisited = useCallback(
		(id: string) => {
			return visitedStores.includes(id);
		},
		[visitedStores],
	);

	// Mark a store as visited
	const markAsVisited = useCallback((id: string) => {
		setVisitedStores((prev) => {
			if (prev.includes(id)) return prev;

			const newState = [...prev, id];
			localStorage.setItem("visitedStores", JSON.stringify(newState));
			return newState;
		});
	}, []);

	return { visitedStores, toggleVisited, isVisited, markAsVisited };
}
