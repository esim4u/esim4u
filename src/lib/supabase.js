import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getUserById = async (id) => {
    const { data, error } = await supabase
        .from("tg_bot_users")
        .select("*")
        .eq("telegram_id", id)
        .single();
    return data;
};

export const createUser = async (user) => {
    const { data, error } = await supabase.from("tg_bot_users").insert([
        {
            telegram_id: user.id || null,
            created_at: new Date(),
            status: "active",
            username: user.username || null,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            photo_url: user.photo_url || null,
            is_premium: user.is_premium ? true : false,
        },
    ]);

    return data;
};

export const updateUser = async (user) => {
    const { data, error } = await supabase
        .from("tg_bot_users")
        .update({
            username: user.username || null,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            photo_url: user.photo_url || null,
            is_premium: user.is_premium ? true : false,
        })
        .eq("telegram_id", user.id);

    return data;
};

export const addUserPhotoUrl = async (id, photo_url) => {
    const { data, error } = await supabase
        .from("tg_bot_users")
        .update({ photo_url: photo_url })
        .eq("telegram_id", id);

    return data;
};
