import React from "react";
import { RUNNING_LINE_COUNTRIES } from "../constants";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/lib/utils";


const RunningCountriesLines = () => {
	return (
		<div className="flex flex-col">
			{Array(4)
				.fill(null)
				.map((_, rowIndex) => (
					<div
						key={rowIndex}
						className="group relative flex gap-3 overflow-hidden p-2"
						style={{
							maskImage:
								"linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 100%)",
						}}
					>
						{Array(5)
							.fill(null)
							.map((index) => (
								<div
									key={index}
									className={cn(
										"flex shrink-0 flex-row justify-around gap-3",
										rowIndex % 2 === 0
											? "animate-logo-cloud"
											: "animate-logo-cloud-reverse"
									)}
								>
									{RUNNING_LINE_COUNTRIES[rowIndex].map(
										(c: any, key: number) => (
											<ReactCountryFlag
												countryCode={c}
												svg
												className="h-10 w-10 rounded-full object-cover"
												key={key}
												style={{
													fontSize: "36px",
												}}
											/>
										)
									)}
								</div>
							))}
					</div>
				))}
		</div>
	);
};

export default RunningCountriesLines;
