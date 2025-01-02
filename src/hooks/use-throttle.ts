import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle(value: any, interval = 500) {
	const [throttledValue, setThrottledValue] = useState(value);
	const lastUpdated = useRef<number | null>(null);

	useEffect(() => {
		const now = Date.now();

		if (lastUpdated.current && now >= lastUpdated.current + interval) {
			lastUpdated.current = now;
			setThrottledValue(value);
		} else {
			const id = window.setTimeout(() => {
				lastUpdated.current = now;
				setThrottledValue(value);
			}, interval);

			return () => window.clearTimeout(id);
		}
	}, [value, interval]);

	return throttledValue;
}
