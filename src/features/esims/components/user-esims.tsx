import React from "react";
import { useGetUserEsims } from "../hooks/use-esims";
import { useTgUser } from "@/hooks/use-telegram";
import { Skeleton } from "@/components/ui/skeleton";
import { l } from "@/features/locale/lib/locale";
import { cn } from "@/lib/utils";
import { RiHistoryFill, RiSimCard2Fill } from "react-icons/ri";
import { useRouter, useSearchParams } from "next/navigation";
import { Esim } from "../types";
import EsimCard from "./esim-card";

const UserEsims = () => {
	const router = useRouter();
    const searchParams = useSearchParams();
    const iccid = searchParams.get("iccid");

	const { tgUser } = useTgUser();
	const { data: esims, isPending } = useGetUserEsims(tgUser?.id || 0);

	if (!esims && isPending) {
		return (
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center  gap-2 pl-4 font-medium uppercase text-neutral-500">
					<h2>{l("title_esims")}</h2>
				</div>
				<div className="flex w-full flex-col gap-2">
					{Array(2)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								className="h-36 w-full rounded-2xl"
								key={index}
							/>
						))}
				</div>
			</div>
		);
	}

	if (!esims) {
		return (
			<div className=" w-full">
				<div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
					<div
						className={cn(
							"absolute left-4 top-4 flex  items-center gap-2 font-medium uppercase text-neutral-500"
						)}
					>
						<h2>{l("title_esims")}</h2>{" "}
					</div>
					<div className="mt-1 flex flex-col items-center justify-center gap-2">
						<RiSimCard2Fill className=" size-[52px]  -scale-x-100 text-neutral-300/75 " />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center  justify-between gap-2 px-4 font-medium uppercase text-neutral-500">
				<h2>{l("title_esims")}</h2>{" "}
				<h2
					onClick={() => {
						router.push("/profile/history");
					}}
					className="flex cursor-pointer underline underline-offset-4 active:scale-95 active:bg-white/50"
				>
					<RiHistoryFill className="h-6 w-6" />
				</h2>
			</div>
			<div className="flex w-full flex-col gap-2">
				{esims?.map((esim: Esim) => (
					<EsimCard
						key={esim.iccid}
						package_id={esim.package_id}
						iccid={esim.iccid}
						state={esim.state}
						coverage={esim.coverage}
						image_url={esim.image_url}
						validity={esim.validity}
						data={esim.data}
						sm_dp={esim.sm_dp}
						confirmation_code={esim.confirmation_code}
						type={esim.type}
						usage={esim.usage}
						expired_at={esim.expired_at}
						available_topups={esim.available_topups}
						open_iccid={iccid || ""}
					/>
				))}
			</div>
		</div>
	);
};

export default UserEsims;
