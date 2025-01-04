import React from "react";
import { useGetUserReferrals } from "../hooks/use-users";
import Collapse from "@/components/ui/collapse";
import ReferralsList from "./referrals-list";

const UserReferralsCollapse = ({
	telegram_id,
	isOpen,
}: {
	telegram_id: number;
	isOpen: boolean;
}) => {
	const { data: userReferrals } = useGetUserReferrals(telegram_id);
	return (
		<Collapse className="" isOpen={isOpen}>
			<div className="mt-2">
				<ReferralsList referrals={userReferrals} />
			</div>
		</Collapse>
	);
};

export default UserReferralsCollapse;
