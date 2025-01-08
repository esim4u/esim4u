import { ESIM_STATE } from "../enums";

export interface Esim {
	package_id: string;
	iccid: string;
	coverage: string;
	image_url: string;
	state: ESIM_STATE;
	validity: string;
	data: string;
	sm_dp: string;
	confirmation_code: string;
	type: string;
	usage: {
		remaining: number;
		total: number;
	};
	expired_at: string;
	available_topups: any[];

	open_iccid?: string;
}

export interface NewEsim {
	net_price: number;
	original_price: number;
	total_price: number;
	total_price_eur: number;
	total_price_ton: number;
	telegram_id: number;
	package_id: number;
	image_url: string;
	coverage: string;
	validity: number;
	data: number;
}

export interface NewTopup {
	iccid: string;
	net_price: number;
	original_price: number;
	total_price: number;
	total_price_eur: number;
	total_price_ton: number;
	telegram_id: number;
	package_id: number;
	image_url: string;
	coverage: string;
	validity: number;
	data: number;
}

export interface DevicesGroup {
	[brand: string]: any[];
}
