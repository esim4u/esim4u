import { clientEnvs } from "@/env/client";
import React from "react";

const EnvModeLabel = () => {
	if (clientEnvs.NEXT_PUBLIC_ENV_MODE == "production") return null;
	return (
		<div className=" flex justify-between w-fit rounded-lg bg-redish px-2 py-1.5">
			<h3 className=" font-mono font-bold text-white leading-3">DEV</h3>
		</div>
	);
};

export default EnvModeLabel;
