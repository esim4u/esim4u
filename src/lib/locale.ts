import t from "@/assets/data/translations.json";
import { Translations } from "@/types";
const translations: Translations = t as Translations;

export function getSupportedLanguages() {
    let languages = Object.keys(translations);

    // convert ISO 639-1 language codes to classic country codes
    const covertMap: { [key: string]: string } = {
        uk: "ua",
        en: "us",
        kk: "kz",
    };
    const convertedLanguages = languages.map((lang) => {
        return {
            value: lang,
            country: lang in covertMap ? covertMap[lang] : lang,
        };
    }).sort((a, b) => {
        return a.value.localeCompare(b.value);
    });

    return convertedLanguages;
}

export function getPreferredLanguage() {
    if (typeof window !== "undefined") {
        let language = window.localStorage.getItem("language");

        return language || "en";
    }
}

export function resetLanguage(router: any) {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem("language");
        router.refresh();
    }
}

export function initLanguage(user_lang: string) {
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

export function l(key: string): string {
    let value = "undefined";
    let language: string;

    if (typeof window !== "undefined") {
        language = window.localStorage.getItem("language") || "en";
    } else {
        language = "en";
    }
    if (!translations[language]) {
        language = "en";
    }

    if (translations[language][key]) {
        value = translations[language][key];
    } else if (translations["en"][key]) {
        value = translations["en"][key];
    } else {
        value = `l('${key}')`;
    }

    return value;
}
