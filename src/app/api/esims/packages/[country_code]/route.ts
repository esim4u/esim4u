import { ceil } from "@/lib/utils";
import axios from "axios";
import dummy_data from "@/assets/data/dummy_country.json";

export async function GET(
    request: Request,
    { params }: { params: { country_code: string } }
) {
    const country_code = params.country_code;

    if (country_code == "TEST") {
        return Response.json(dummy_data);
    }

    let config;

    if (country_code.length == 2) {
        config = {
            method: "get",
            maxBodyLength: Infinity,
            url: process.env.AIRALO_API_URL + "/v2/packages",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
            },
            params: {
                limit: 300,
                "filter[country]": country_code.toUpperCase(),
            },
        };
    } else {
        config = {
            method: "get",
            maxBodyLength: Infinity,
            url: process.env.AIRALO_API_URL + "/v2/packages",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
            },
            params: {
                limit: 300,
                "filter[type]": "global",
            },
        };
    }
    let response = await axios(config).catch(function (error) {
        console.log(error.response);
    });

    if (response?.data && response.data.data) {
        if (country_code.length > 2) {
            response.data.data = response.data.data.filter(
                (country: any) => country.slug === country_code
            );
        }

        const marginRate = 0.2;
        //add total_price field to each package
        response.data.data.forEach((country: any) => {
            country.operators.forEach((operator: any) => {
                operator.packages.forEach((p: any) => {
                    p.total_price =
                        ceil(p.price + p.price * marginRate, 0) - 0.01; //ceil to whole number
                    p.total_price_eur = ceil(p.total_price * 0.92, 2);
                });
            });
        });

        return Response.json(response.data.data);
    }

    return Response.json([]);
}
