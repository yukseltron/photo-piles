import { countries } from './data.js';
import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

export function load() {
	return {
		summaries: countries.map(country => {
			const dir = resolve('static/images', country.slug);
			let count = 0;
			let cover = null;
			if (existsSync(dir)) {
				const files = readdirSync(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
				count = files.length;
				if (country.cover && files.includes(country.cover)) {
						cover = `/images/${country.slug}/${country.cover}`;
					} else {
						cover = files.length > 0 ? `/images/${country.slug}/${files[0]}` : null;
					}
			}
			return { ...country, count, cover };
		})
	};
}
