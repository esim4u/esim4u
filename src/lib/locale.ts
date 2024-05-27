interface Translations {
    [language: string]: {
        [key: string]: string;
    };
}

import t from "@/assets/translations.json";
const translations: Translations = t as Translations;

export function getPreferredLanguage() {
    if (typeof window !== "undefined") {
        let language = window.localStorage.getItem("language");

        return language || "";
    }
}

export function resetLanguage(router: any) {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem("language");
        router.refresh();
    }
}

export function initLanguage(user_lang = "en") {
    if (typeof window !== "undefined") {
        let language = window.localStorage.getItem("language");

        if (!language || !translations[user_lang]) {
            window.localStorage.setItem("language", user_lang);
        }
    }
}

export function setLanguage(language: string, router: any) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem("language", language);
        router.refresh();
    }
}

export function l(key: string) {
    if (typeof window !== "undefined") {
        let value = "undefined";

        //get language from local storage
        let language = window.localStorage.getItem("language");

        if (!language || !translations[language]) {
            language = "en";
        }

        if (!translations[language][key]) {
            if (translations["en"][key]) {
                value = translations["en"][key];
            } else {
                value = "l('" + key + "')";
            }
        } else {
            value = translations[language][key];
        }

        return value;
    }
}
