import { DevicesGroup } from "../types";

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

export const groupDevicesByBrand = (devices: any[]) => {
	const group: DevicesGroup = {};
	devices.forEach((device: any) => {
		const brand = device.brand.toLowerCase();
		if (!group[brand]) {
			group[brand] = [];
		}
		// Check if the device name already exists in the array
		const existingDevice = group[brand].find(
			(existingDevice) => existingDevice.name === device.name
		);
		if (!existingDevice) {
			group[brand].push(device);
		}
	});

	return group;
};

export const searchInGroupedDevices = (
	groupedDevices: DevicesGroup,
	search: string
) => {
	const query = search.trim().toLowerCase();
	if (!query) {
		return groupedDevices;
	}

	const filtered: DevicesGroup = {};
	Object.keys(groupedDevices).forEach((brand) => {
		const devices = groupedDevices[brand].filter((device) => {
			return (
				device.model.toLowerCase().includes(query) ||
				device.brand.toLowerCase().includes(query) ||
				device.name.toLowerCase().includes(query)
			);
		});

		if (devices.length > 0) {
			filtered[brand] = devices;
		}
	});
	return filtered;
};
