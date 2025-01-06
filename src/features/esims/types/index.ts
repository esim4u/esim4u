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
