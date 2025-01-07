"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import Dot from "@/components/ui/dot";
import { l } from "@/features/locale/lib/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const EsimActivationManualCollapse = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className=" flex flex-col rounded-2xl bg-white p-5 shadow-md">
			<Button
				variant={"unstyled"}
				size={"fit"}
				className="flex cursor-pointer items-center justify-between w-full"
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			>
				<h2 className="flex cursor-pointer items-center gap-1 text-xs font-medium uppercase text-neutral-500">
					{l("title_guide")}
					<Badge className="capitalize ">{l("badge_guide")}</Badge>
				</h2>
				<MdArrowForwardIos
					className={cn(
						"text-neutral-500 transition-transform",
						isOpen && " rotate-90"
					)}
				/>
			</Button>

			<Collapse isOpen={isOpen}>
				<div className="flex flex-col gap-2 pt-2 text-sm font-bold">
					<div className="flex flex-row gap-2">
						<h3 className="w-4">1.</h3>
						<h3 className="">{l("instruction_1")}</h3>
					</div>
					<div className="flex flex-row gap-2">
						<h3 className="w-4">2.</h3>
						<h3 className="text-sm">{l("instruction_2")}</h3>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex flex-row gap-2">
							<h3 className="w-4">3.</h3>
							<h3 className="text-sm">{l("instruction_3")}</h3>
						</div>
						<div className="flex flex-row gap-2">
							<div className="py-2 pl-4">
								<Dot className="size-1.5" />
							</div>
							<h3 className="text-sm">
								{l("instruction_3_auto")}
							</h3>
						</div>
						<div className="flex flex-row gap-2">
							<div className="py-2 pl-4">
								<Dot className="size-1.5" />
							</div>
							<h3 className="text-sm">{l("instruction_3_qr")}</h3>
						</div>
						<div className="flex flex-row gap-2">
							<div className="py-2 pl-4">
								<Dot className="size-1.5" />
							</div>
							<h3 className="text-sm">
								{l("instruction_3_manual")}
							</h3>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<h3 className="w-4">4.</h3>
						<h3 className="text-sm">{l("instruction_4")}</h3>
					</div>
					<div className="flex flex-row gap-2">
						<h3 className="w-4"> 5. </h3>
						<h3 className="text-sm">{l("instruction_5")}</h3>
					</div>
				</div>
			</Collapse>
		</div>
	);
};

export default EsimActivationManualCollapse;
