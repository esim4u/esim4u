import { PremiumIcon, TonIcon } from "@/components/icons";
type Props = {
	referrals: any;
};
const ReferralsList = ({ referrals }: Props) => {
	return (
		<div className="flex w-full flex-col gap-1">
			{referrals?.map((referral: any, index: number) => (
				<div
					key={referral.telegram_id}
					onClick={() => {
						if (!referral.username) {
							return;
						}
					}}
					className="flex h-10 cursor-pointer items-center justify-between rounded-lg bg-white p-4 transition-transform active:scale-95"
				>
					<span className="max-w-28 truncate font-medium text-tgaccent">
						@{referral.username || referral.first_name}
					</span>
					<div className=" grid w-40 grid-cols-5 gap-1 ">
						<div className=" col-span-2 -mr-4 flex items-center justify-center">
							{!!referral.orders &&
								referral.orders[0].count > 0 && (
									<span className="  flex min-w-9 items-center justify-center rounded-md  bg-gradient-to-r from-violet-500 to-purple-500 px-1 font-medium text-white">
										{referral.orders[0].count}
									</span>
								)}
						</div>
						<div className="col-span-2  flex items-center justify-center">
							<span className=" flex items-center font-semibold text-purple-500">
								{0.0}
								<TonIcon className="ml-1 h-4 w-4" />
							</span>
						</div>

						<div className="col-span-1  flex items-center justify-center">
							{referral.is_premium && (
								<PremiumIcon className="h-6 w-6" />
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ReferralsList;
