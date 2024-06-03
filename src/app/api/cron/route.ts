export async function GET() {
    let response = await fetch(
        process.env.NEXT_PUBLIC_WEB_APP_URL + "api/esims/sync",
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        return Response.json(
            {
                message: "An error occurred while fetching orders",
                description: response.statusText,
            },
            { status: 500 }
        );
    }
    const result = await response.json();

    console.log(
        "cron finished processing esims orders: " +
            result.data.map((o: any) => o.id).join(", ")
    );
    return Response.json(
        {
            result: result.data,
        },
        { status: 200 }
    );
}

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";