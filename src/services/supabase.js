import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// USER

export const getUserById = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", id)
        .eq("onboarding", true)
        .single();
    return data;
};

export const createUser = async (user) => {
    const { data: dbUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", user.id);

    if (dbUser.length > 0) {
        const { data, error } = await supabase
            .from("users")
            .update([
                {
                    status: "active",
                    username: user.username || null,
                    first_name: user.first_name || null,
                    last_name: user.last_name || null,
                    language_code: user.language_code || null,
                    is_premium: user.is_premium ? true : false,
                    onboarding: true,
                },
            ])
            .eq("telegram_id", user.id);

        if (error) {
            alert(JSON.stringify(error));
            console.error(error);
        }

        return data;
    }
    const { data, error } = await supabase.from("users").insert([
        {
            telegram_id: user.id || null,
            created_date: new Date(),
            status: "active",
            username: user.username || null,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            language_code: user.language_code || null,
            is_premium: user.is_premium ? true : false,
            onboarding: true,
        },
    ]);

    if (error) {
        alert(JSON.stringify(error));
        console.error(error);
    }

    alert(JSON.stringify(error));
    console.log(data);
    return data;
};

export const addUserPhotoFileId = async (id, photo_url) => {
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", id);

    if (user.length > 0) {
        const { data, error } = await supabase
            .from("users")
            .update({ photo_url: photo_url })
            .eq("telegram_id", id);

        return data;
    }

    const { data, error } = await supabase.from("users").insert({
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

    if (data.length > 0) {
        return data[0];
    }
    return [];
};
