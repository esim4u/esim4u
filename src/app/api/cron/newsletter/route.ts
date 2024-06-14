export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    let response = await fetch(
        process.env.NEXT_PUBLIC_WEB_APP_URL + "api/admin/newsletter/send",
        {
            cache: "no-store",
        },
    );

    if (!response.ok) {
        return Response.json(
            {
                message: "An error occurred while sending newsletters",
                description: response.statusText,
            },
            { status: 500 },
        );
    }

    return Response.json(
        {
            message: "Newsletters sent successfully",
        },
        { status: 200 },
    );
}
