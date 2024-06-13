import { STORY_STATUS } from "@/enums";
import { createClient } from "@supabase/supabase-js";

import {
    getPhotoUrlFromFileId,
    sendWelcomeMessageToUser,
    updateUserPhoto,
} from "./grammy";
import { sendTgLog } from "./tg-logger";

// Initialize Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

export const updateUser = async (tgUser, dbUser) => {
    let lastLoginDates = dbUser.last_login_date.dates || [];
    lastLoginDates.unshift(new Date().toISOString());

    await sendTgLog("Updating user: " + JSON.stringify(tgUser, null, 2));

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
                platform: tgUser.platform || null,
                last_login_date: lastLoginDate,
            },
        ])
        .eq("telegram_id", tgUser.id);

    await updateUserPhoto(tgUser.id);

    return data;
};

export const createUser = async (user, parent_id) => {
    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", user.id);

    await sendTgLog("Creating user: " + JSON.stringify(user, null, 2));

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
            platform: user.platform || null,
            parent_id: parent_id && !isNaN(parent_id) ? parent_id : null,
        },
    ]);

    if (parent_id && isNaN(parent_id)) {
        await addExternalAdUser(user.id, user.username, parent_id);
    }

    if (createdUser.error) {
        console.error("Create user error: " + createdUser.error);
        await sendTgLog(
            "Cteate user error: " + JSON.stringify(createdUser.error, null, 2),
        );
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

export const addExternalAdUser = async (id, username, match) => {
    const externalAdUsers = await supabase
        .from("external_ads")
        .select("*")
        .eq("telegram_id", id);

    if (externalAdUsers.error) {
        await sendTgLog(JSON.stringify(externalAdUsers, null, 2));
        return externalAdUsers.error;
    }
    await sendTgLog(JSON.stringify(externalAdUsers, null, 2));

    if (externalAdUsers?.data?.length > 0) {
        await sendTgLog(`Creating externa user id: ${id}, match: ${match}`);
        let channels = externalAdUsers.data[0].channel;

        if (channels.some((channel) => channel.channel === match)) {
            return "Channel already exists";
        } else {
            channels = [{ date: new Date(), channel: match }, ...channels];
        }

        const updatedExternalAdUsers = await supabase
            .from("external_ads")
            .update({
                telegram_id: id,
                channel: channels,
            })
            .eq("telegram_id", id)
            .select("*");

        if (updatedExternalAdUsers.error) {
            return newExternalAdUsers.error;
        }

        return updatedExternalAdUsers.data;
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

    const newExternalAdUsers = await supabase
        .from("external_ads")
        .insert({
            telegram_id: id,
            channel: [
                {
                    date: new Date(),
                    channel: match,
                },
            ],
        })
        .select("*");

    console.log(newExternalAdUsers);
    await sendTgLog(JSON.stringify(newExternalAdUsers, null, 2));

    if (newExternalAdUsers.error) {
        return newExternalAdUsers.error;
    }
    if (newExternalAdUsers.data.length == 0) {
        return "External Ad User not created";
    }

    return newExternalAdUsers.data;
};

export const getUserReferrals = async (id) => {
    const users = await supabase
        .from("users")
        .select("*, orders: orders(count)")
        .eq("parent_id", id)
        .eq("orders.status", "SUCCESS");

    return users.data;
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

export const getUsersEsimHistory = async (telegram_id) => {
    const orders = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegram_id)
        .eq("status", "SUCCESS");

    return orders.data;
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
        },
    );
};

export const incrementStoryUniqueViews = async (id) => {
    const { data, error } = await supabase.rpc(
        "increment_stories_unique_views",
        {
            row_id: +id,
        },
    );
};

// ONBOARDING

export const finishOnboarding = async (telegram_id, wallet_address) => {
    await sendTgLog(
        `Finishing onboarding for ${telegram_id} with address ${wallet_address}`,
    );

    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegram_id);

    if (users.data.length === 0) {
        return;
    }
    await supabase
        .from("users")
        .update({ onboarding: true })
        .eq("telegram_id", telegram_id);

    const wallets = await supabase
        .from("wallet")
        .select("*")
        .eq("telegram_id", telegram_id);

    await sendTgLog(JSON.stringify(wallets, null, 2));

    if (wallets.data.length > 0) {
        const updatedWallet = await supabase
            .from("wallet")
            .update({
                address: wallet_address ? wallet_address : wallets[0].address,
                connected: wallet_address ? true : false,
            })
            .eq("telegram_id", telegram_id)
            .select();

        if (updatedWallet.error) {
            console.error(updatedWallet.error);
            await sendTgLog(
                "Updating wallet error: " +
                    JSON.stringify(updatedWallet.error, null, 2),
            );
        }

        return updatedWallet.data;
    }

    const createdWallet = await supabase.from("wallet").insert({
        telegram_id,
        amount: 0,
        address: wallet_address ? wallet_address : null,
    });

    await sendTgLog(JSON.stringify(createdWallet, null, 2));

    if (createdWallet.error) {
        console.error(createdWallet.error);

        await sendTgLog(
            "Updating wallet error: " +
                JSON.stringify(createdWallet.error, null, 2),
        );

        return createdWallet;
    }

    return createdWallet.data;
};

// WALLET

export const updateUserWallet = async (telegram_id, wallet_address) => {
    const updatedWallet = await supabase
        .from("wallet")
        .update({ address: wallet_address, connected: true })
        .eq("telegram_id", telegram_id);
};

export const disconnectUserWallet = async (telegram_id) => {
    const updatedWallet = await supabase
        .from("wallet")
        .update({ connected: false })
        .eq("telegram_id", telegram_id);
};

// LEADERBOARD

export const getLeaderboard = async () => {
    const orders = await supabase.rpc("get_leaderboard");
    return orders.data;
};
