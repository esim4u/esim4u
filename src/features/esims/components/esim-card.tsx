"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TbHandClick } from "react-icons/tb";

import { Esim } from "../types";
import CircleProgressBar from "@/components/ui/circle-progress";
import Collapse from "@/components/ui/collapse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { l } from "@/features/locale/lib/locale";
import dayjs from "dayjs";

import CopyBadge from "./copy-badge";
import TopUpCarousel from "./top-up-carousel";
import { Button } from "@/components/ui/button";

const EsimCard = ({
	package_id,
	iccid,
	coverage,
	image_url,
	state,
	validity,
	sm_dp,
	confirmation_code,
	usage,
	expired_at,
	available_topups,
}: Esim) => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const activationLink = "aa";

	return (
		<div className="relative flex flex-col">
			<Button
                variant={"unstyled"}
                size={"fit"}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
				className="z-10 w-full flex cursor-pointer flex-row items-center justify-between rounded-3xl bg-white px-5 py-2"
			>
				<div className="flex flex-col font-bold ">
					<div className="flex items-center gap-0.5">
						<span className="capitalize">{l("label_status")}:</span>{" "}
						<StatusText status={state} />
					</div>
					{state == "NOT_ACTIVE" && (
						<h2 className="flex items-center gap-0.5">
							<span className="first-letter:capitalize">
								{l("text_click_to_activate")}
							</span>
							<TbHandClick className="h-5 w-5" />
						</h2>
					)}
					{expired_at && (
						<h2>
							Valid until:{" "}
							<ValidUntilText expired_at={expired_at} />
						</h2>
					)}
				</div>
				<div>
					<CircleProgressBar
						size={76}
						percent={
							usage?.remaining > 0
								? (usage?.remaining / usage?.total) * 100
								: 0
						}
						strokeWidth={9}
					>
						<div className="mt-1 flex flex-col text-center leading-4">
							<span className=" font-bold ">
								{(usage?.remaining / 1024).toFixed(1)}
							</span>{" "}
							<span className=" text-xs font-bold">Gb</span>
						</div>
					</CircleProgressBar>
				</div>
			</Button>
			<div className="relative -mt-5 overflow-hidden rounded-b-2xl bg-sky-300 pt-5">
				{usage &&
					state != "EXPIRED" &&
					(usage.remaining == 0 ||
						usage.remaining / usage.total < 0.5) && (
						<TopUpCarousel
							topUps={available_topups}
							iccid={iccid}
							image_url={image_url}
							coverage={coverage}
						/>
					)}

				<Collapse className=" px-4  duration-200" isOpen={isOpen}>
					<div className="w-full py-2 pt-4">
						<Tabs defaultValue={"auto"}>
							<TabsList className="w-full">
								{
									<TabsTrigger
										onClick={() => {}}
										className="w-full capitalize"
										value="auto"
									>
										{l("nav_activation_auto")}
									</TabsTrigger>
								}
								<TabsTrigger
									onClick={() => {}}
									className="w-full capitalize"
									value="manual"
								>
									{l("nav_activation_manual")}
								</TabsTrigger>
							</TabsList>
							<TabsContent value="auto">
								<div className="flex items-center justify-center">
									<div className="flex flex-col gap-6 px-2 pt-2 text-sm font-bold">
										<div className="flex flex-col gap-2">
											<div className=" rounded-lg border-2 border-redish bg-white/10 px-2 py-1">
												<h2 className="font-semibold text-redish">
													{l("important_note")}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="manual">
								<div className="flex h-72 flex-col gap-3 px-2 pt-2 text-sm font-bold">
									<div className=" rounded-lg border-2 border-redish bg-white/10 px-2 py-1">
										<h2 className="font-semibold text-redish text-shadow-sm">
											{l("important_note")}
										</h2>
									</div>
									<h2>
										1. Open settings -&gt; Cellular -&gt;
										Add
									</h2>
									<h2>
										2. Click “Use QR code” -&gt; Add manual
									</h2>
									<div className="flex flex-col gap-1">
										<h2>3. Your SM-DP+ </h2>
										<CopyBadge text={sm_dp} />
									</div>
									<div className="flex flex-col gap-1">
										<h2>4. Your Activation code</h2>
										<CopyBadge text={confirmation_code} />
									</div>
									<h2>5. Turn On Roaming</h2>
									<div className="flex items-center justify-between">
										<h2>6. Select network</h2>{" "}
										<span
											onClick={() => {
												router.push(
													"/esims/networks/" +
														package_id
												);
											}}
											className=" text-tgaccent underline underline-offset-2"
										>
											Check list
										</span>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</Collapse>
				<div className=" flex items-center justify-between px-4 py-3 text-sm font-semibold text-white">
					<div className="flex items-center gap-2">
						<Image
							width={28}
							height={28}
							src={image_url}
							alt={coverage}
							className="esim-mask rounded-sm"
						/>
						<h3 className="uppercase">{coverage}</h3>
					</div>
					<div>
						<h3 className=" uppercase">
							{validity} {l("text_days")}
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EsimCard;

const StatusText = ({ status }: { status: string }) => {
	if (status === "ACTIVE")
		return (
			<span className="text-green-500">{l("text_status_active")}</span>
		);
	if (status === "NOT_ACTIVE")
		return (
			<span className="text-yellow-500">
				{l("text_status_not_active")}
			</span>
		);
	if (status === "EXPIRED")
		return <span className="text-red-500">{l("text_status_expired")}</span>;
	if (status === "FINISHED")
		return <span className="text-red-500">OUT OF DATA</span>;
	return <span className="">{status}</span>;
};

const ValidUntilText = ({ expired_at }: { expired_at: string }) => {
	const formatedDate = dayjs(expired_at).format("D MMMM YYYY");
	const date = new Date(expired_at);
	const now = new Date();
	const diff = date.getTime() - now.getTime();
	const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
	if (days < 0) return <span className="text-red-500">{formatedDate}</span>;
	if (days < 7) return <span className="text-red-500">{formatedDate}</span>;
	if (days < 30)
		return <span className="text-yellow-500">{formatedDate}</span>;
};
