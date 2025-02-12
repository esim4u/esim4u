import { clientEnvs } from "@/env/client";
import React from "react";

const EnvModeLabel = () => {
	if (clientEnvs.NEXT_PUBLIC_ENV_MODE == "production") return null;
	return (
		<div className="fixed left-1/2 -translate-x-1/2 container overflow-hidden z-50 h-16  p-0">
			<div className="absolute bg-redish px-2.5 py-0.5 rounded-br-xl">
				<h3 className=" font-mono font-bold text-white">DEV BUILD</h3>
			</div>
		</div>
	);
};

export default EnvModeLabel;
