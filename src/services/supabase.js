import { createClient } from "@supabase/supabase-js";
import { getPhotoUrlFromFileId, sendWelcomeMessageToUser } from "./grammy";
import { sendTgLog } from "./tg-logger";
import { platform } from "os";
import { send } from "process";
import { create } from "domain";
import { STORY_STATUS } from "@/enums";

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

export const updateUser = async (tgUser, dbUser, platform) => {
    let lastLoginDates = dbUser.last_login_date.dates || [];
    lastLoginDates.unshift(new Date().toISOString());

    //only keep the last 5 login dates
    if (lastLoginDates.length > 5) {
        lastLoginDates = lastLoginDates.slice(0, 5);
    }
    let lastLoginDate = {
        counter: dbUser.last_login_date.counter
            ? dbUser.last_login_date.counter + 1
            : 1,
        dates: lastLoginDates,
    };

    const { data, error } = await supabase
        .from("users")
        .update([
            {
                username: tgUser.username || null,
                first_name: tgUser.first_name || null,
                last_name: tgUser.last_name || null,
                language_code: tgUser.language_code || null,
                is_premium: tgUser.is_premium ? true : false,
                platform: platform || null,
                last_login_date: lastLoginDate,
            },
        ])
        .eq("telegram_id", tgUser.id);

    return data;
};

export const createUser = async (user, parent_id) => {
    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", user.id);

    if (users.data.length > 0) {
        const updatedUser = await supabase
            .from("users")
            .update([
                {
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

        if (updatedUser.error) {
            console.error("Update user error: " + updatedUser.error);
            await sendTgLog("Update user error: " + updatedUser.error);
        }

        return updatedUser.data;
    }

    const createdUser = await supabase.from("users").insert([
        {
            telegram_id: user.id || null,
            created_date: new Date(),
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

    if (createdUser.error) {
        console.error("Create user error: " + createdUser.error);
        await sendTgLog("Update user error: " + createdUser.error);
    }

    await sendWelcomeMessageToUser(user.id);

    return createdUser.data;
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

export const addReferrerToUser = async (id, username, referrer_id) => {
    const referrer = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", referrer_id);

    if (referrer.error) {
        return referrer.error;
    }
    if (referrer?.data?.length == 0) {
        return "Referrer not found";
    }

    const user = await supabase.from("users").select("*").eq("telegram_id", id);

    if (user.error) {
        return user.error;
    }
    if (user.data.length > 0) {
        return "User already exists";
    }

    const newUser = await supabase
        .from("users")
        .insert({
            telegram_id: id,
            username: username,
            parent_id: referrer_id,
            created_date: new Date(),
            onboarding: false,
        })
        .select("*");

    if (newUser.error) {
        return newUser.error;
    }
    if (newUser.data.length == 0) {
        return "User not created";
    }

    return newUser.data;
};

// ORDERS

export const getOrderById = async (id) => {
    const orders = await supabase
        .from("orders")
        .select(`*`)
        .eq("id", id)
        .eq("status", "CREATED")
        .order("created_at", { ascending: false });

    if (orders.error || orders.data.length === 0) {
        return [];
    }

    const transactions = await supabase
        .from("transactions")
        .select(`checkout_id`)
        .eq("id", orders.data[0].transaction_id);

    if (transactions.error || transactions.data.length === 0) {
        return [];
    }

    return { ...orders.data[0], checkout_id: transactions.data[0].checkout_id };
};

// STORIES

export const getStories = async () => {
    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("status", STORY_STATUS.ENABLED)
        .order("created_at", { ascending: false });

    return data;
};

export const incrementStoryTotalViews = async (id) => {
    const { data, error } = await supabase.rpc(
        "increment_stories_total_views",
        {
            row_id: +id,
        }
    );
};

export const incrementStoryUniqueViews = async (id) => {
    const { data, error } = await supabase.rpc(
        "increment_stories_unique_views",
        {
            row_id: +id,
        }
    );
};

// WALLET

export const createWallet = async (telegram_id, wallet_address) => {
    await sendTgLog(
        `Creating wallet for ${telegram_id} with address ${wallet_address}`
    );

    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegram_id);

    console.log(users);

    if (users.data.length === 0) {
        return;
    }

    const wallets = await supabase
        .from("wallet")
        .select("*")
        .eq("telegram_id", telegram_id);

    if (wallets.data.length > 0) {
        const updatedWallet = await supabase
            .from("wallet")
            .update({ address: wallet_address })
            .eq("telegram_id", telegram_id)
            .select();

        if (updatedWallet.error) {
            console.error(updatedWallet.error);
        }

        return updatedWallet.data;
    }

    const createdWallet = await supabase.from("wallet").insert({
        telegram_id,
        amount: 0,
        address: wallet_address,
    });

    if (createdWallet.error) {
        console.error(createdWallet.error);
        return createdWallet;
    }

    return createdWallet.data;
};
