export const convertToCents = (amount: number) => {
	return Math.round(amount * 100);
};

export const convertCentsToDollars = (amount: number) => {
	return amount / 100;
};
