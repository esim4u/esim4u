import axios from "axios";

export async function GET(request: Request, { params }: { params: { country_code: string } }) {
    const country_code = params.country_code;

    let config;

    if(country_code.length == 2) {
        config = {
            method: "get",
            maxBodyLength: Infinity,
            url: process.env.AIRALO_API_URL + "/packages",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
            },
            params: {
                limit: 300,
                'filter[country]': country_code.toUpperCase(),
            },
        };

    }
    else{
        config = {
            method: "get",
            maxBodyLength: Infinity,
            url: process.env.AIRALO_API_URL + "/packages",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
            },
            params: {
                limit: 300,
                'filter[type]': 'global',
            },
        };
    }
    let response = await axios(config).catch(function (error) {
        console.log(error.response);
    });
    const ceil = (number: number, degree = 2) => {
        return Math.ceil(number * 10 ** degree) / 10 ** degree;
    };

    if (response?.data && response.data.data) {
        if(country_code.length > 2){
            response.data.data = response.data.data.filter((country: any) => country.slug === country_code);
        }

        const exchangeRate = 0.93;
        const marginRate = 0.2;
        //add total_price field to each package
        response.data.data.forEach((country: any) => {
            country.operators.forEach((operator: any) => {
                operator.packages.forEach((p: any) => {
                    p.price_eur = ceil(p.price * exchangeRate);
                    p.total_price_eur =
                        ceil(p.price_eur + p.price_eur * marginRate, 0) - 0.01; //ceil to whole number
                });
            });
        });

        return Response.json(response.data.data);
    }

    return Response.json([]);
}
