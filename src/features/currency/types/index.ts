export interface Currency {
	value: string;
	label: string;
	symbol: string;
	code: number;
}
export interface CurrencyList {
	[key: string]: Currency;
}
