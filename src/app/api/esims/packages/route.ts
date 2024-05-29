import axios from "axios";
import { NextRequest } from "next/server";
import t from "@/assets/data/country-translations.json";
import { Translations } from "@/types";
const translations: Translations = t as Translations;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang");
    let supportedTranslations = Object.keys(translations);

    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.AIRALO_API_URL + "/v2/packages",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
        },
        params: {
            limit: 300,
        },
    };

    let response = await axios(config).catch(function (error) {
        console.log(error.response);
    });

    const ceil = (number: number, degree = 2) => {
        return Math.ceil(number * 10 ** degree) / 10 ** degree;
    };

    if (response?.data && response.data.data) {
        const exchangeRate = 0.93;
        const marginRate = 0.2;
        //add total_price field to each package
        response.data.data.forEach((country: any) => {
            if (
                lang &&
                lang !== "en" &&
                supportedTranslations.includes(lang) &&
                translations[lang][country.country_code.toLowerCase()]
            ) {
                country.translation =
                    translations[lang][country.country_code.toLowerCase()];
            }

            country.operators.forEach((operator: any) => {
                operator.packages.forEach((p: any) => {
                    p.price_eur = ceil(p.price * exchangeRate);
                    p.total_price_eur =
                        ceil(p.price_eur + p.price_eur * marginRate, 0) - 0.01; //ceil to whole number
                });
                operator.countries.forEach((c: any) => {
                    if (
                        lang &&
                        lang !== "en" &&
                        supportedTranslations.includes(lang) &&
                        translations[lang][c.country_code.toLowerCase()]
                    ) {
                        c.translation =
                            translations[lang][c.country_code.toLowerCase()];
                    }
                });
            });
        });

        return Response.json(response.data.data);
    }
    return Response.json([]);
}
