import axios from "axios";

export async function GET() {
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.AIRALO_API_URL + "/packages",
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
