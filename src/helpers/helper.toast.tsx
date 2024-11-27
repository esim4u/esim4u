import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

export function showConfirmationToast({
	title = "Are you sure?",
	description = "",
	onYes,
	onNo,
}: {
	title?: string;
	description?: string;
	onYes: () => void;
	onNo: () => void;
}) {
	toast({
		duration: 10000, // 10 seconds
		title: title,
		description: (
			<div className="-mt-1 flex">
				<span className="text-xs leading-[14px]">{description}</span>
			</div>
		),
		action: (
			<div className="flex w-1/2 items-center gap-2">
				<Button
					asChild
					onClick={() => {
						onYes();
					}}
					variant={"ghost"}
					className="w-1/3 rounded-xl border-none px-0 text-base underline underline-offset-4 hover:bg-white/60"
				>
					<ToastAction altText="yes">Yes</ToastAction>
				</Button>

				<Button
					onClick={() => {
						onNo();
					}}
					variant={"secondary"}
					className="w-2/3 rounded-xl text-base"
					asChild
				>
					<ToastAction altText="undo">No</ToastAction>
				</Button>
			</div>
		),
		variant: "esim4u",
		hideClose: true,
	});
}
