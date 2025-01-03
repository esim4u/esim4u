import axios from "axios";

export async function GET() {
    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.AIRALO_API_URL + "/v1/compatible-devices",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
        },
        params: {
            limit: 300,
        },
    };

    const response = await axios(config).catch(function (error) {
        console.log(error.response);
    });

    if (response?.data && response.data.data) {
        return Response.json(response.data.data);
    }
    return Response.json([]);
}
