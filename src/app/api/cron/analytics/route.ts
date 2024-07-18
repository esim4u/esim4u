export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST() {
    let response = await fetch(
        process.env.NEXT_PUBLIC_WEB_APP_URL + "/api/admin/analytics/send",
        {
            cache: "no-store",
        },
    );

    if (!response.ok) {
        return Response.json(
            {
                message: "An error occurred while fetching orders",
                description: response.statusText,
            },
            { status: 500 },
        );
    }

    return Response.json(
        {
            message: "Successfully fetched orders",
        },
        { status: 200 },
    );
}
