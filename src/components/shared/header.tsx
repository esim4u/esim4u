"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTelegram } from "@/providers/telegram-provider";
import { MdArrowForwardIos } from "react-icons/md";
import { hapticFeedback } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services/supabase";
import { Badge } from "../ui/badge";

type Props = {};

const Header = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser.id);
            return data;
        },
    });

    return (
        <section className="w-full">
            <div className="flex gap-5 justify-between w-full">
                <div
                    onClick={() => {
                        hapticFeedback(webApp);
                        router.push("/profile");
                    }}
                    className="flex items-center gap-2  cursor-pointer transition-transform active:scale-95"
                >
                    <Avatar>
                        <AvatarImage
                            src={tgUser?.photo_url || dbUserData?.photo_url}
                            alt="@shadcn"
                        />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.first_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <h2 className="flex text-neutral-500 font-medium items-center gap-1 leading-3">
                            {tgUser?.username
                                ? `@${tgUser?.username}`
                                : "@user"}
                            <MdArrowForwardIos className="w-[14px] h-[14px]" />
                        </h2>

                        <Badge className="normal-case w-fit py-0.5 px-2 text-[8px] font-medium">
                            {dbUserData?.badge || "New user"}
                        </Badge>
                    </div>
                </div>
                <div
                    onClick={() => {
                        hapticFeedback(webApp);
                        router.push("/test");
                    }}
                    className="bg-white h-10 p-2 pr-3 gap-1 flex items-center rounded-full cursor-pointer active:scale-95 transition-transform"
                >
                    <svg
                        width="24"
                        height="28"
                        viewBox="0 0 24 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M22.7159 13.7129C22.708 13.7299 22.7001 13.7468 22.6921 13.7638C22.3805 14.4269 21.3837 14.1636 21.4451 13.4335C21.5573 12.0992 21.3922 10.72 20.9115 9.37698C19.3509 5.01762 14.1114 0.0539104 9.47163 4.32545e-05C8.97616 -0.00569893 8.69168 0.56152 8.98409 0.961504C9.37396 1.49471 9.69054 2.09578 9.91471 2.75509C10.6505 4.91935 10.1976 7.22355 8.90201 8.93549C8.36191 9.64916 7.21511 9.2967 7.19625 8.4019L7.19587 8.38243C7.18826 7.90808 7.26608 7.45264 7.41538 7.03083C7.48122 6.84484 7.30879 6.6618 7.1199 6.71873C4.4896 7.51154 2.48951 11.3821 2.48951 14.1429C2.48951 14.3445 2.50073 14.5435 2.52156 14.7396C2.5242 15.1167 2.5898 15.4906 2.71565 15.8461L2.7297 15.8856C2.7701 15.9977 2.81255 16.1091 2.85701 16.2196C2.23022 15.4538 1.70209 14.6123 1.28502 13.7149C1.09028 13.2956 0.473897 13.3788 0.39821 13.8349C0.263351 14.6473 0.192749 15.4396 0.192749 16.1928C0.192749 22.7137 5.47901 28 11.9999 28C18.5209 28 23.8071 22.7137 23.8071 16.1928C23.8071 15.4395 23.7365 14.6472 23.6016 13.8347C23.5261 13.3797 22.9101 13.2944 22.7159 13.7129Z"
                            fill="url(#paint0_linear_2001_554)"
                        />
                        <path
                            d="M2.48951 14.1428C2.48951 14.3445 2.50073 14.5435 2.52156 14.7396C2.52421 15.1166 2.58981 15.4906 2.71565 15.846L2.7297 15.8854C2.7701 15.9976 2.81255 16.1089 2.85701 16.2195C2.23022 15.4537 1.70209 14.6122 1.28502 13.7148C1.09028 13.2954 0.473897 13.3787 0.39821 13.8348C0.263351 14.6471 0.192749 15.4395 0.192749 16.1927C0.192694 22.7137 5.47895 27.9999 11.9999 27.9999C18.5208 27.9999 23.8071 22.7137 23.8071 16.1927C23.8071 15.4395 23.7365 14.6471 23.6016 13.8347C23.526 13.3796 22.91 13.2943 22.7158 13.7128C22.7079 13.7298 22.7 13.7468 22.692 13.7637C22.3804 14.4268 21.3835 14.1635 21.445 13.4335C21.4708 13.1232 21.4815 12.8119 21.4771 12.5006H2.69137C2.55979 13.0686 2.48951 13.6252 2.48951 14.1428Z"
                            fill="url(#paint1_linear_2001_554)"
                        />
                        <path
                            d="M2.48951 14.1428C2.48951 14.3445 2.50073 14.5435 2.52156 14.7396C2.52421 15.1166 2.58981 15.4906 2.71565 15.846L2.7297 15.8854C2.7701 15.9976 2.81255 16.1089 2.85701 16.2195C2.23022 15.4537 1.70209 14.6122 1.28502 13.7148C1.09028 13.2954 0.473897 13.3787 0.39821 13.8348C0.263351 14.6471 0.192749 15.4395 0.192749 16.1927C0.192694 22.7137 5.47895 27.9999 11.9999 27.9999C18.5208 27.9999 23.8071 22.7137 23.8071 16.1927C23.8071 15.4395 23.7365 14.6471 23.6016 13.8347C23.526 13.3796 22.91 13.2943 22.7158 13.7128C22.7079 13.7298 22.7 13.7468 22.692 13.7637C22.3804 14.4268 21.3835 14.1635 21.445 13.4335C21.4708 13.1232 21.4815 12.8119 21.4771 12.5006H2.69137C2.55979 13.0686 2.48951 13.6252 2.48951 14.1428Z"
                            fill="url(#paint2_linear_2001_554)"
                        />
                        <path
                            d="M23.8071 16.1928C23.8071 15.4395 23.7365 14.6472 23.6016 13.8347C23.526 13.3797 22.91 13.2944 22.7158 13.7129C22.7079 13.7299 22.7 13.7468 22.692 13.7638C22.3804 14.4269 21.3836 14.1636 21.445 13.4335C21.5572 12.0992 21.3922 10.72 20.9114 9.37698C19.3509 5.01762 14.1113 0.0539104 9.47159 4.32545e-05C8.97612 -0.00569893 8.69163 0.56152 8.98405 0.961559C9.37391 1.49476 9.6905 2.09583 9.91466 2.75515C10.6504 4.9194 10.1975 7.22361 8.90196 8.93554C8.63301 9.2909 8.21367 9.38179 7.85803 9.27313V27.2523C9.14691 27.7352 10.5424 28 11.9999 28C18.5208 28 23.8071 22.7137 23.8071 16.1928Z"
                            fill="url(#paint3_linear_2001_554)"
                        />
                        <path
                            d="M22.9073 20.7199L15.2317 13.0443L7.39746 24.3074L11.0521 27.9621C11.3648 27.9869 11.6808 28 11.9999 28C16.9169 28 21.1313 24.9941 22.9073 20.7199Z"
                            fill="url(#paint4_linear_2001_554)"
                        />
                        <path
                            d="M17.9816 18.206C17.9772 18.2155 17.9728 18.225 17.9683 18.2345C17.7944 18.6046 17.238 18.4576 17.2722 18.0501C17.3348 17.3053 17.2427 16.5354 16.9743 15.7857C16.1032 13.3523 13.1784 10.5815 10.5885 10.5514C10.3119 10.5482 10.1531 10.8648 10.3164 11.0881C10.5394 11.3936 10.7145 11.7312 10.8359 12.0893C11.2466 13.2974 10.9937 14.5837 10.2705 15.5393C9.96905 15.9377 9.32894 15.7409 9.31838 15.2414L9.31816 15.2305C9.31367 14.9737 9.35518 14.7182 9.44072 14.4761C9.47747 14.3723 9.38122 14.2701 9.27578 14.3018C7.80753 14.7444 6.69108 16.905 6.69108 18.446C6.69108 18.5586 6.69737 18.6697 6.70897 18.7791C6.71045 18.9896 6.74706 19.1983 6.8173 19.3967L6.82512 19.4188C6.84766 19.4817 6.87161 19.5437 6.89616 19.6053C6.54629 19.1778 6.25148 18.7081 6.01865 18.2071C5.90993 17.973 5.56589 18.0195 5.52362 18.2741C5.44831 18.7276 5.40894 19.1698 5.40894 19.5903C5.40894 23.2303 8.35976 26.1812 11.9998 26.1812C15.6399 26.1812 18.5907 23.2303 18.5907 19.5903C18.5907 19.1698 18.5513 18.7275 18.476 18.274C18.4339 18.02 18.09 17.9725 17.9816 18.206Z"
                            fill="url(#paint5_linear_2001_554)"
                        />
                        <path
                            d="M18.5908 19.5903C18.5908 19.1698 18.5513 18.7275 18.476 18.2741C18.4339 18.02 18.09 17.9725 17.9816 18.206C17.9772 18.2155 17.9728 18.225 17.9683 18.2345C17.7944 18.6046 17.238 18.4576 17.2722 18.0501C17.3348 17.3053 17.2427 16.5354 16.9743 15.7857C16.1032 13.3523 13.1785 10.5815 10.5885 10.5514C10.3119 10.5482 10.1531 10.8648 10.3164 11.0881C10.5394 11.3936 10.7145 11.7312 10.8359 12.0893C11.2466 13.2974 10.9937 14.5837 10.2706 15.5393C10.1204 15.7376 9.88638 15.7884 9.68787 15.7278V25.7638C10.4073 26.0334 11.1863 26.1812 11.9999 26.1812C15.6399 26.1812 18.5908 23.2303 18.5908 19.5903Z"
                            fill="url(#paint6_linear_2001_554)"
                        />
                        <path
                            d="M6.69108 18.446C6.69108 18.5586 6.69737 18.6696 6.70897 18.7791C6.71045 18.9896 6.74706 19.1983 6.8173 19.3967L6.82512 19.4188C6.84766 19.4817 6.87161 19.5437 6.89616 19.6052C6.54629 19.1778 6.25148 18.708 6.01865 18.2071C5.90993 17.973 5.56589 18.0195 5.52362 18.2741C5.44831 18.7276 5.40894 19.1698 5.40894 19.5903C5.40894 23.2303 8.35976 26.1811 11.9998 26.1811C15.6399 26.1811 18.5907 23.2303 18.5907 19.5903C18.5907 19.1698 18.5513 18.7274 18.476 18.274C18.4338 18.02 18.0899 17.9724 17.9815 18.2059C17.9771 18.2155 17.9727 18.2249 17.9682 18.2344C17.7943 18.6045 17.2379 18.4576 17.2721 18.05C17.2866 17.8776 17.2924 17.7039 17.2901 17.5293H6.80379C6.73035 17.8464 6.69108 18.1571 6.69108 18.446Z"
                            fill="url(#paint7_linear_2001_554)"
                        />
                        <path
                            d="M6.69108 18.446C6.69108 18.5586 6.69737 18.6696 6.70897 18.7791C6.71045 18.9896 6.74706 19.1983 6.8173 19.3967L6.82512 19.4188C6.84766 19.4817 6.87161 19.5437 6.89616 19.6052C6.54629 19.1778 6.25148 18.708 6.01865 18.2071C5.90993 17.973 5.56589 18.0195 5.52362 18.2741C5.44831 18.7276 5.40894 19.1698 5.40894 19.5903C5.40894 23.2303 8.35976 26.1811 11.9998 26.1811C15.6399 26.1811 18.5907 23.2303 18.5907 19.5903C18.5907 19.1698 18.5513 18.7274 18.476 18.274C18.4338 18.02 18.0899 17.9724 17.9815 18.2059C17.9771 18.2155 17.9727 18.2249 17.9682 18.2344C17.7943 18.6045 17.2379 18.4576 17.2721 18.05C17.2866 17.8776 17.2924 17.7039 17.2901 17.5293H6.80379C6.73035 17.8464 6.69108 18.1571 6.69108 18.446Z"
                            fill="url(#paint8_linear_2001_554)"
                        />
                        <path
                            d="M1.45491 9.80676C2.31881 9.98395 3.00722 9.0955 2.66236 8.28383C2.40462 7.67723 2.44509 6.95722 2.83386 6.36484L2.83577 6.36189C2.93405 6.2127 2.85557 6.01189 2.68128 5.97262C1.87595 5.79123 1.00708 6.11257 0.52736 6.84347C-0.090827 7.78541 0.171618 9.05016 1.11356 9.66841C1.21905 9.73753 1.33416 9.78199 1.45491 9.80676Z"
                            fill="url(#paint9_linear_2001_554)"
                        />
                        <path
                            d="M1.45491 9.80676C2.31881 9.98395 3.00722 9.0955 2.66236 8.28383C2.40462 7.67723 2.44509 6.95722 2.83386 6.36484L2.83577 6.36189C2.93405 6.2127 2.85557 6.01189 2.68128 5.97262C1.87595 5.79123 1.00708 6.11257 0.52736 6.84347C-0.090827 7.78541 0.171618 9.05016 1.11356 9.66841C1.21905 9.73753 1.33416 9.78199 1.45491 9.80676Z"
                            fill="url(#paint10_linear_2001_554)"
                        />
                        <path
                            d="M1.45491 9.80676C2.31881 9.98395 3.00722 9.0955 2.66236 8.28383C2.40462 7.67723 2.44509 6.95722 2.83386 6.36484L2.83577 6.36189C2.93405 6.2127 2.85557 6.01189 2.68128 5.97262C1.87595 5.79123 1.00708 6.11257 0.52736 6.84347C-0.090827 7.78541 0.171618 9.05016 1.11356 9.66841C1.21905 9.73753 1.33416 9.78199 1.45491 9.80676Z"
                            fill="url(#paint11_linear_2001_554)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2001_554"
                                x1="5.88238"
                                y1="9.65654"
                                x2="17.4311"
                                y2="21.2052"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FFA1AE" />
                                <stop offset="1" stop-color="#FF4565" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2001_554"
                                x1="14.6307"
                                y1="20.3929"
                                x2="18.7242"
                                y2="25.344"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                            <linearGradient
                                id="paint2_linear_2001_554"
                                x1="11.6289"
                                y1="20.1939"
                                x2="10.8883"
                                y2="28.2249"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                            <linearGradient
                                id="paint3_linear_2001_554"
                                x1="14.8977"
                                y1="12.6541"
                                x2="22.2269"
                                y2="9.3014"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                            <linearGradient
                                id="paint4_linear_2001_554"
                                x1="20.8744"
                                y1="26.2185"
                                x2="11.9079"
                                y2="19.5911"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                            <linearGradient
                                id="paint5_linear_2001_554"
                                x1="9.29306"
                                y1="16.3416"
                                x2="14.595"
                                y2="22.5012"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FEF0AE" />
                                <stop offset="1" stop-color="#FAC600" />
                            </linearGradient>
                            <linearGradient
                                id="paint6_linear_2001_554"
                                x1="15.0027"
                                y1="17.2603"
                                x2="16.796"
                                y2="16.6365"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE9738" stop-opacity="0" />
                                <stop offset="1" stop-color="#FE9738" />
                            </linearGradient>
                            <linearGradient
                                id="paint7_linear_2001_554"
                                x1="10.1698"
                                y1="22.9168"
                                x2="8.8443"
                                y2="25.074"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE9738" stop-opacity="0" />
                                <stop offset="1" stop-color="#FE9738" />
                            </linearGradient>
                            <linearGradient
                                id="paint8_linear_2001_554"
                                x1="13.5785"
                                y1="23.1345"
                                x2="14.6181"
                                y2="25.3437"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE9738" stop-opacity="0" />
                                <stop offset="1" stop-color="#FE9738" />
                            </linearGradient>
                            <linearGradient
                                id="paint9_linear_2001_554"
                                x1="0.777938"
                                y1="6.87218"
                                x2="3.19502"
                                y2="8.89944"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FFA1AE" />
                                <stop offset="1" stop-color="#FF4565" />
                            </linearGradient>
                            <linearGradient
                                id="paint10_linear_2001_554"
                                x1="1.42183"
                                y1="8.38965"
                                x2="0.875993"
                                y2="9.81262"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                            <linearGradient
                                id="paint11_linear_2001_554"
                                x1="1.40783"
                                y1="7.69555"
                                x2="3.18162"
                                y2="8.22187"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#FE0364" stop-opacity="0" />
                                <stop
                                    offset="0.234"
                                    stop-color="#F90362"
                                    stop-opacity="0.234"
                                />
                                <stop
                                    offset="0.517"
                                    stop-color="#EA035B"
                                    stop-opacity="0.517"
                                />
                                <stop
                                    offset="0.824"
                                    stop-color="#D20250"
                                    stop-opacity="0.824"
                                />
                                <stop offset="1" stop-color="#C00148" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className=" flex flex-col">
                        <span className="text-[10px]  font-semibold leading-3">
                            Click to copy referral link
                        </span>
                        <span className="text-[9px] text-neutral-500  text-center leading-3">
                            and share with your friends
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;
