"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sendTgLog } from "@/services/tg-logger";
import { createTransaction } from "@/services/tonconnect";
import { useMutation } from "@tanstack/react-query";
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
} from "@tonconnect/ui-react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { RiTokenSwapFill } from "react-icons/ri";

import { cn, donationErrorToast, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import CustomInput from "@/components/ui/custom-input";
import { TonIcon } from "@/components/icons";

type Props = {};

const Donation = (props: Props) => {
    const { tgUser } = useTelegram();
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const rawAddress = useTonAddress();

    const router = useRouter();

    const [donationAmount, setDonationAmount] = useState<number | string>(1);
    const [isDonationError, setIsDonationError] = useState(false);

    const tonPayment = useMutation({
        mutationFn: async (transaction: any) => {
            return await tonConnectUI.sendTransaction(transaction);
        },
        onSuccess: (data) => {
            if (data.boc) {
                donate.mutate(data.boc);
                sendTgLog(JSON.stringify(data));
            }
        },
        onError: (error) => {
            console.log(error);
            sendTgLog(JSON.stringify(error));
        },
    });

    const donate = useMutation({
        mutationFn: async (boc: string) => {
            return await axios.post(
                "/api/pay/tonconnect/donate",
                {
                    telegram_id: tgUser?.id,
                    amount: donationAmount,
                    boc: boc,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN}`,
                    },
                },
            );
        },
        onSuccess: (data) => {
            router.push("/esims/pay/success");
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const transaction = useMemo(() => {
        if (+donationAmount >= 1) {
            return createTransaction(
                +donationAmount,
                `t.me/esim4u_bot - Experience seamless connectivity`,
            );
        }
        return null;
    }, [donationAmount]);

    const handlePayButtonClick = async () => {
        if (transaction) {
            tonPayment.mutate(transaction);
        }
    };

    useEffect(() => {
        if (+donationAmount >= 1) {
            setIsDonationError(false);
        } else {
            setIsDonationError(true);
        }
    }, [donationAmount]);

    return (
        <main className="flex h-dvh flex-col gap-4 overflow-x-hidden p-5">
            <DonationBanner />
            <DonationPriceCarousel
                donationAmount={donationAmount}
                setDonationAmount={setDonationAmount}
            />
            <div className="flex flex-col gap-2">
                <h2
                    className={cn(
                        "pl-2 text-sm font-medium uppercase text-neutral-500",
                    )}
                >
                    OR ENTER CUSTOM AMOUNT
                </h2>
                <CustomInput
                    type={"number"}
                    value={donationAmount}
                    setValue={(value) => {
                        setDonationAmount(value);
                    }}
                    placeholder="Enter amount"
                    isError={isDonationError}
                    onClear={() => setDonationAmount(1)}
                />
            </div>

            {rawAddress ? (
                tonPayment.isPending || donate.isPending ? (
                    <Button className="w-full gap-1 rounded-xl text-base text-white">
                        <BiLoaderAlt className="animate-spin" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            if (+donationAmount < 1) {
                                hapticFeedback("error");
                                donationErrorToast();
                                return;
                            }
                            hapticFeedback("medium");
                            handlePayButtonClick();
                        }}
                        size={"lg"}
                        className="w-full rounded-xl text-base"
                    >
                        Donate {donationAmount} <TonIcon className="size-3" />
                    </Button>
                )
            ) : (
                <TonConnectButton />
            )}
        </main>
    );
};

const DonationPriceCarousel = ({
    donationAmount,
    setDonationAmount,
}: {
    donationAmount: number | string;
    setDonationAmount: (amount: number) => void;
}) => {
    const [api, setApi] = useState<CarouselApi>();
    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            console.log("selected", api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className={cn("flex flex-col gap-1", "-mx-5")}>
            <h2
                className={cn(
                    "pl-2 text-sm font-medium uppercase text-neutral-500",
                    "px-7",
                )}
            >
                Recommended
            </h2>
            <Carousel setApi={setApi}>
                <CarouselContent className={cn("ml-1", "mr-4 pl-4")}>
                    {[1, 5, 10, 25, 50].map((amount: number, index: number) => {
                        return (
                            <CarouselItem
                                key={index}
                                className="basis-[122px] cursor-pointer pl-1"
                            >
                                <div
                                    onClick={() => {
                                        hapticFeedback();
                                        setDonationAmount(amount);
                                        api?.scrollTo(index);
                                    }}
                                    className={cn(
                                        "flex h-16  w-28 flex-col items-center justify-center rounded-3xl  border-[2px] border-neutral-400 p-5 transition-all active:border-4 active:border-tgaccent ",
                                        donationAmount === amount &&
                                            "border-4 border-tgaccent",
                                    )}
                                >
                                    <h2 className="flex items-center text-2xl font-bold">
                                        {amount}
                                        <span className="text-xl">TON</span>
                                        {/* <TonIcon className="size-[18px]"/> */}
                                    </h2>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

const DonationBanner = () => {
    return (
        <div className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3">
            <div className="p-2">
                <RiTokenSwapFill className=" h-12 w-12 text-amber-500 " />
            </div>

            <div className="flex-1 flex-col">
                <h2 className="text-center font-bold uppercase">
                    donate to get NFT!
                </h2>
                <p className="text-pretty text-center text-sm leading-4">
                    Donate and receive free esim4u NFTs on launch{" "}
                </p>
            </div>
        </div>
    );
};

export default Donation;
