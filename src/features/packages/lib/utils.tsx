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

export function searchInNetworks({
	networks,
	search,
}: {
	networks: any;
	search: string;
}) {
	const updatedNetworks = networks.map((country: any) => {
		return {
			...country,
			fullName: COUNTRIES[country.name.toLowerCase()] || country.name,
		};
	});

	const query = search.toLowerCase().trim();
	if (!query) return updatedNetworks;

	return updatedNetworks.filter((country: any) => {
		// Check if the country name matches the search query
		if (
			country.name.toLowerCase().includes(query) ||
			country.fullName?.toLowerCase().includes(query)
		)
			return true;
		// Check if any network name or type matches the search query
		return country.networks.some((network: any) => {
			return (
				network.name.toLowerCase().includes(query) ||
				network.types.some((type: any) =>
					type.toLowerCase().includes(query)
				)
			);
		});
	});
}

export function searchInCoverage({
	coverage,
	search,
}: {
	coverage: any;
	search: string;
}) {
	const updatedCoverage = coverage.map((country: any) => {
		return {
			...country,
			fullName: COUNTRIES[country.name.toLowerCase()] || country.name,
		};
	});

	const query = search.toLowerCase().trim();
	if (!query) return updatedCoverage;

	return updatedCoverage.filter((country: any) => {
		// Check if the country name matches the search query
		if (
			country.name.toLowerCase().includes(query) ||
			country.fullName?.toLowerCase().includes(query)
		)
			return true;
		// Check if any network name or type matches the search query
		return country.networks.some((network: any) => {
			return (
				network.name.toLowerCase().includes(query) ||
				network.types.some((type: any) =>
					type.toLowerCase().includes(query)
				)
			);
		});
	});
}
