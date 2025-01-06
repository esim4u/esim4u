export const generateEsimActivationLink = (
	sm_dp: string,
	confiramtion_code: string
) => {
	return `LPA:1$${sm_dp}$${confiramtion_code}`;
};

export const detectIOSVersion = () => {
	const userAgent = window.navigator.userAgent;
	const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
	if (iOS) {
		const version = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
		if (!version) return 0;
		return parseFloat(`${version[1]}.${version[2]}${+version[3] | 0}`);
	}
	return 0;
};
