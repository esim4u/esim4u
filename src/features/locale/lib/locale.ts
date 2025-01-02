import t from "@/assets/data/translations.json";
import { Translations } from "@/features/locale/types/translations.types";

const translations: Translations = t as Translations;
const covertMap: { [key: string]: string } = {
    uk: "ua",
    en: "us",
    kk: "kz",
};

export function getSupportedLanguages() {
    const languages = Object.keys(translations);

    const convertedLanguages = languages
        .map((lang) => {
            return {
                value: lang,
                country: lang in covertMap ? covertMap[lang] : lang,
            };
        })
        .sort((a, b) => {
            return a.value.localeCompare(b.value);
        });

    return convertedLanguages;
}

export function getCountryFromLanguage(language: string) {
    language = language.toLowerCase();
    return language in covertMap ? covertMap[language] : language;
}

export function getPreferredLanguage() {
    if (typeof window !== "undefined") {
        const language = window.localStorage.getItem("language");

        return language || "en";
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resetLanguage(router: any) {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem("language");
        router.refresh();
    }
}

export function initLanguage(user_lang: string) {
    if (typeof window !== "undefined") {
        const language = window.localStorage.getItem("language");

        if (!language || !translations[user_lang]) {
            window.localStorage.setItem("language", user_lang);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLanguage(language: string, router: any) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem("language", language);
        router.refresh();
    }
}

export function l(key: string, initial_language: string = "en"): string {
    let value = "undefined";
    let language: string;

    if (typeof window !== "undefined") {
        language = window.localStorage.getItem("language") || initial_language;
    } else {
        language = initial_language;
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
