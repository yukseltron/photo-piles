import { error } from '@sveltejs/kit';
import { countries } from '../data.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';

export function load({ params }) {
	const country = countries.find(c => c.slug === params.slug);

	if (!country) throw error(404);

	const dir = resolve('static/images', params.slug);
	const files = readdirSync(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

	return {
		country,
		images: files.map(f => `/images/${params.slug}/${f}`)
	};
}
