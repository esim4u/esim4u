import { clientEnvs } from "@/env/client";
import React from "react";

const EnvModeLabel = () => {
	if (clientEnvs.NEXT_PUBLIC_ENV_MODE == "production") return null;
	return (
		<div className="fixed left-1/2 -translate-x-1/2 container overflow-hidden z-50 h-16  p-0">
			<div className=" flex justify-between w-fit rounded-b-xl bg-redish px-5 py-1.5">
				<h3 className=" font-mono font-bold text-white">DEV</h3>
				{/* <h3 className=" font-mono font-bold text-white">BUILD</h3> */}
			</div>
		</div>
	);
};

export default EnvModeLabel;
