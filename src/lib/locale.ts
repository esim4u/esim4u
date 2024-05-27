interface Translations {
    [language: string]: {
        [key: string]: string;
    };
}

import t from "@/assets/translations.json";
const translations: Translations = t as Translations;

export function resetLanguage(router: any) {
    localStorage.removeItem("language");
    router.refresh();
}

export function initLanguage(user_lang = "en") {
    let language = localStorage.getItem("language");

    if (!language || !translations[user_lang]) {
        localStorage.setItem("language", user_lang);
    }
}

export function setLanguage(language: string, router: any) {
    localStorage.setItem("language", language);
    router.refresh();
}

export function l(key: string) {
    let value = "undefined";

    //get language from local storage
    let language = localStorage.getItem("language");

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
