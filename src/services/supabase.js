import { createClient } from "@supabase/supabase-js";
import { getPhotoUrlFromFileId } from "./grammy";
import { sendTgLog } from "./tg-logger";
import { platform } from "os";

// Initialize Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// USER

export const getUserById = async (id) => {
    let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", id)
        .eq("onboarding", true)
        .single();

    if (data && data.photo) {
        const photoUrl = await getPhotoUrlFromFileId(data.photo);
        data.photo_url = photoUrl;
    }

    return data;
};

export const createUser = async (user, parent_id) => {
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
                    platform: user.platform || null,
                },
            ])
            .eq("telegram_id", user.id);

        if (dbUser[0].parent_id === null && parent_id) {
            const { data, error } = await supabase
                .from("users")
                .update([{ parent_id: parent_id }])
                .eq("telegram_id", user.id);
        }

        if (error) {
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
            platform: user.platform || null,
            parent_id: parent_id || null,
        },
    ]);

    if (error) {
        console.error(error);
    }

    console.log(data);

    return data;
};

export const addUserPhotoFileId = async (id, username, photo_url) => {
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", id);

    if (user && user?.length > 0) {
        const { data, error } = await supabase
            .from("users")
            .update({ photo: photo_url, username: username })
            .eq("telegram_id", id);

        return data;
    }

    const { data, error } = await supabase.from("users").insert({
        telegram_id: id,
        photo: photo_url,
        onboarding: false,
        username: username,
    });

    return data;
};

// ORDERS

export const getOrderById = async (id) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .is("status", null)
        .order("created_at", { ascending: false });

    if (data.length > 0) {
        return data[0];
    }
    return [];
};


// STORIES

export const getStories= async () => {
    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

    return data;
};