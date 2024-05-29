
export async function POST(req: Request) {
    const { telegram_id, wallet_address } = await req.json();
    try {
        return Response.json({ telegram_id, wallet_address });
    } catch (error) {
        return Response.json(error);
    }

}
