import { COUNTRIES } from "@/constants";
import Fuse from "fuse.js";

export function searchInPackages({
	packages,
	search,
}: {
	packages: any;
	search: string;
}) {
	const query = search.toLowerCase().trim();

	const fuse = new Fuse(packages, {
		keys: [
			"slug",
			"country_code",
			"translation",
			"operators.countries.title",
			"operators.countries.country_code",
			"operators.countries.translation",
		],
		threshold: 0.3,
		includeMatches: true,
	});

	return fuse.search(query).map((result) => {
		const item = result.item as any;

		const matchedKey = result.matches && result.matches[0].key;

		const countries = item.operators[0].countries;

		const nestedFuse = new Fuse(countries, {
			keys: ["title", "country_code", "translation"],
			threshold: 0.3,
			includeMatches: true,
		});

		let nestedMatchCountries = nestedFuse.search(query).map((result) => {
			const item = result.item as any;
			const matchedKey = result.matches && result.matches[0].key;

			return {
				...item,
				fullName: COUNTRIES[item.title.toLowerCase()] || item.title,
				matchKey: matchedKey,
			};
		});

		nestedMatchCountries = nestedMatchCountries.filter(
			(nestedCountry) =>
				nestedCountry.title != item.title &&
				nestedCountry.country_code != item.country_code &&
				(nestedCountry.translation || "") != (item.translation || "en")
		);

		return {
			...item,
			matchKey: matchedKey,
			nestedMatchCountries,
		};
	});
}

export const highlightMatches = (search: string, text: string) => {
	if (search.trim() === "") {
		return text;
	}
	const regex = new RegExp(`(${search})`, "gi");
	return text.split(regex).map((part, index) => {
		return regex.test(part) ? (
			<span key={index} className="highlight text-tgaccent">
				{part}
			</span>
		) : (
			part
		);
	});
};
