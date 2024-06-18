import { ESIM_STATE, ORDER_STATUS } from "@/enums";

export interface Esim {
    package_id: string;
    iccid: string;
    coverage: string;
    image_url: string;
    state: ESIM_STATE;
    validity: string;
    data: string;
    sm_dp: string;
    confirmation_code: string;
    type: string;
    usage: {
        remaining: number;
        total: number;
    };
    expired_at: string;
    available_topups: any[];

    open_iccid?: string;
}

export interface ShowPromiseResult {
    done: boolean; // true if user watch till the end, otherwise false
    description: string; // event description
    state: "load" | "render" | "playing" | "destroy"; // banner state
    error: boolean; // true if event was emitted due to error, otherwise false
}

// types.ts
export interface ITelegramUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    photo_url: string;
}

export interface IWebApp {
    initData: string;
    initDataUnsafe: {
        query_id: string;
        user: ITelegramUser;
        auth_date: string;
        hash: string;
    };
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: {
        link_color: string;
        button_color: string;
        button_text_color: string;
        secondary_bg_color: string;
        hint_color: string;
        bg_color: string;
        text_color: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    isClosingConfirmationEnabled: boolean;
    headerColor: string;
    backgroundColor: string;
    BackButton: {
        isVisible: boolean;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isProgressVisible: boolean;
        isActive: boolean;
    };
    HapticFeedback: any;
}

export interface Translations {
    [language: string]: {
        [key: string]: string;
    };
}

export interface Icon {
    className?: string;
    onClick?: () => void;
}
