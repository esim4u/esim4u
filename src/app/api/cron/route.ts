export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    const response = await fetch(
        process.env.NEXT_PUBLIC_WEB_APP_URL + "/api/esims/sync",
        {
            cache: "no-store",
        },
    );

    return Response.json(
        {
            message: "Cron job executed successfully",
        },
        { status: 200 },
    );
}
