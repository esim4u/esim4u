import supabase from "@/lib/supabase";

interface UpdateUserActivityProps {
	telegram_id: number;
	newsletter_id?: string;
	story_id?: string;
}

export const updateUserActivity = async ({
	telegram_id,
	newsletter_id,
	story_id,
}: UpdateUserActivityProps) => {
	const userActivity = await supabase
		.from("activity")
		.select("*")
		.eq("telegram_id", telegram_id);

	if (userActivity.error) {
		return userActivity.error;
	}

	let newsletter = [];

	if (userActivity.data.length > 0 && userActivity.data[0].newsletter) {
		newsletter = userActivity.data[0].newsletter ?? [];
	}

	if (newsletter_id) {
		const newsletterIndex = newsletter.findIndex(
			(item: any) => item.id === newsletter_id
		);
		if (newsletterIndex !== -1) {
			newsletter[newsletterIndex].last_view_date = new Date();
			newsletter[newsletterIndex].views = newsletter[newsletterIndex]
				.views
				? newsletter[newsletterIndex].views + 1
				: 1;
		} else {
			newsletter = [
				...newsletter,
				{ id: newsletter_id, last_view_date: new Date(), views: 1 },
			];
		}
	}

	let stories = [];
	if (userActivity.data.length > 0 && userActivity.data[0].stories) {
		stories = userActivity.data[0].stories ?? [];
	}

	if (story_id) {
		const storyIndex = stories.findIndex(
			(item: any) => item.id === story_id
		);
		if (storyIndex !== -1) {
			stories[storyIndex].last_view_date = new Date();
			stories[storyIndex].views = stories[storyIndex].views
				? stories[storyIndex].views + 1
				: 1;
		} else {
			stories = [
				...stories,
				{ id: story_id, last_view_date: new Date(), views: 1 },
			];
		}
	}

	if (userActivity.data.length === 0) {
		const newUserActivity = await supabase.from("activity").insert({
			telegram_id,
			newsletter: newsletter,
			stories: stories,
		});

		return newUserActivity.data;
	}

	const updatedUserActivity = await supabase
		.from("activity")
		.update({
			newsletter: newsletter,
			stories: stories,
		})
		.eq("telegram_id", telegram_id);
};
