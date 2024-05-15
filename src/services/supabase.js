import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


// USER

export const getUserById = async (id) => {
    const { data, error } = await supabase
        .from("tg_bot_users")
        .select("*")
        .eq("telegram_id", id)
        .eq("welcome_showed", true)
        .single();
    return data;
};

export const createUser = async (user) => {
    const { data: dbUser, error: userError } = await supabase
        .from("tg_bot_users")
        .select("*")
        .eq("telegram_id", user.id);

    if (dbUser.length > 0) {
        const { data, error } = await supabase
            .from("tg_bot_users")
            .update([
                {
                    created_at: new Date(),
                    status: "active",
                    username: user.username || null,
                    first_name: user.first_name || null,
                    last_name: user.last_name || null,
                    is_premium: user.is_premium ? true : false,
                    welcome_showed: true,
                },
            ])
            .eq("telegram_id", user.id);

        return data;
    }
    const { data, error } = await supabase.from("tg_bot_users").insert([
        {
            telegram_id: user.id || null,
            created_at: new Date(),
            status: "active",
            username: user.username || null,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            is_premium: user.is_premium ? true : false,
            welcome_showed: true,
        },
    ]);

    return data;
};

export const addUserPhotoUrl = async (id, photo_url) => {
    const { data: user, error: userError } = await supabase
        .from("tg_bot_users")
        .select("*")
        .eq("telegram_id", id);

    if (user.length > 0) {
        const { data, error } = await supabase
            .from("tg_bot_users")
            .update({ photo_url: photo_url })
            .eq("telegram_id", id);

        return data;
    }

    const { data, error } = await supabase.from("tg_bot_users").insert({
        telegram_id: id,
        photo_url: photo_url,
    });

    return data;
};


// ORDERS

export const getOrderById = async (id) => {
    const { data, error } = await supabase
        .from("airalo-esim")
        .select("*")
        .eq("id", id)
        .is("status", null)
        .order("created_at", { ascending: false });
    return data;
}