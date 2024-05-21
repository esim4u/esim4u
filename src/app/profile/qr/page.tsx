import RefLinkQr from "@/components/shared/ref-link-qr";
import Qr from "@/components/ui/qr";
import React from "react";

type Props = {};

const page = (props: Props) => {
    return (
        <div className="w-full h-dvh flex flex-col items-center justify-center gap-5 p-5">
            <div>
                <RefLinkQr showShareButton />
            </div>
            <div>
                <h2 className="text-center font-bold text-lg text-balance px-5">
                    Share this link with your friends to get bonuses for their
                    purchases!
                </h2>
            </div>
        </div>
    );
};

export default page;
