import { type ClassValue, clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Custom hook for handling localStorage
 * @param key Storage key
 * @param initialValue Initial value
 * @returns [value, setter, reset function]
 */
export function createLocalStorageStateHook<T extends unknown[]>(
	key: string,
	initialValue: T,
) {
	// Custom hook for state that persists in localStorage
	const usePersistedState = () => {
		const [value, setValue] = useState<T>(() => {
			// Only run in browser context
			if (typeof window === "undefined") return initialValue;

			try {
				// Get stored value from localStorage
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			} catch (error) {
				console.warn(`Error reading localStorage key "${key}":`, error);
				return initialValue;
			}
		});

		// Initialize visited state (for favorites)
		useEffect(() => {
			if (typeof window === "undefined") return;
		}, []);

		// Function to set value
		const setPersistedValue = useCallback(
			(newValue: T | ((val: T) => T)) => {
				try {
					// If new value is a function, execute it with current value as argument
					const valueToStore =
						newValue instanceof Function ? newValue(value) : newValue;

					// Update state
					setValue(valueToStore);

					// Save to localStorage
					if (typeof window !== "undefined") {
						window.localStorage.setItem(key, JSON.stringify(valueToStore));
					}
				} catch (error) {
					console.error(`Error setting localStorage key "${key}":`, error);
				}
			},
			[value, key],
		);

		// Function to toggle specific ID (for favorites or visited lists)
		const toggleId = useCallback(
			(id: string) => {
				setPersistedValue((currentValue: T): T => {
					if (!Array.isArray(currentValue)) {
						console.error("toggleId can only be used with array values");
						return currentValue;
					}

					return (
						currentValue.includes(id)
							? currentValue.filter((item) => item !== id)
							: [...currentValue, id]
					) as T;
				});
			},
			[setPersistedValue],
		);

		// Function to check if ID is included
		const includes = useCallback(
			(id: string): boolean => {
				return Array.isArray(value) && value.includes(id);
			},
			[value],
		);

		// Function to reset value
		const reset = useCallback(() => {
			setPersistedValue(initialValue);
		}, [setPersistedValue, initialValue]);

		return {
			value,
			setValue: setPersistedValue,
			toggleId,
			includes,
			reset,
		};
	};

	return usePersistedState;
}
