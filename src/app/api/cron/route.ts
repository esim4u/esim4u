export async function GET() {
    const result = await fetch(
        process.env.NEXT_PUBLIC_WEB_APP_URL + "api/esims/sync",
        {
            cache: "no-store",
        }
    );

    console.log("Cron job executed successfully");
    return Response.json({
        message: "Cron job executed successfully",
    });
}
