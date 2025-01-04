import supabase from "@/lib/supabase";
import { STORY_STATUS } from "../enums";

export const getStories = async (lang: string | undefined) => {
	const language = ["EN", lang?.toUpperCase()];
	const { data } = await supabase
		.from("stories")
		.select("*")
		.eq("status", STORY_STATUS.ENABLED)
		.in("language", language)
		.order("created_at", { ascending: false });

	return data;
};

export const incrementStoryTotalViews = async (id: number) => {
	await supabase.rpc("increment_stories_total_views", {
		row_id: id,
	});
};

export const incrementStoryUniqueViews = async (id: number) => {
	await supabase.rpc("increment_stories_unique_views", {
		row_id: id,
	});
};
