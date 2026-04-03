import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const countries = [
	'japan', 'usa', 'turkiye', 'brazil', 'colombia',
	'france', 'italy', 'korea', 'mexico', 'philippines', 'spain'
];

let converted = 0;
let skipped = 0;

for (const country of countries) {
	const dir = join('static/images', country);
	const files = readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f));

	for (const file of files) {
		const srcPath = join(dir, file);
		const outName = basename(file, extname(file)) + '.webp';
		const outPath = join(dir, outName);

		try {
			await sharp(srcPath)
				.resize({ width: 1200, withoutEnlargement: true })
				.webp({ quality: 82 })
				.toFile(outPath);

			unlinkSync(srcPath);
			converted++;
			process.stdout.write(`\r[${converted} converted, ${skipped} skipped]`);
		} catch (err) {
			console.error(`\nFailed: ${srcPath} — ${err.message}`);
			skipped++;
		}
	}
}

console.log(`\nDone. ${converted} converted, ${skipped} skipped.`);
