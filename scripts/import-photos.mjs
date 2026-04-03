/**
 * Converts HEIC/JPG/PNG photos from ~/Downloads/[country] folders
 * into WebP and saves them to static/images/[country]/.
 * HEIC files are converted via macOS `sips` first, then resized with sharp.
 * Videos are skipped with a notice.
 *
 * Usage: node scripts/import-photos.mjs
 */
import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import { homedir, tmpdir } from 'os';
import { execSync } from 'child_process';

const COUNTRIES = ['brazil', 'colombia', 'france', 'japan', 'spain'];
const SOURCE_BASE = join(homedir(), 'Downloads');
const DEST_BASE = 'static/images';

const HEIC_EXTS  = new Set(['.heic', '.heif']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.m4v']);

async function toWebP(srcPath, destPath) {
	const ext = extname(srcPath).toLowerCase();

	if (HEIC_EXTS.has(ext)) {
		// sips converts HEIC → JPEG in a temp file, then sharp resizes → WebP
		const tmp = join(tmpdir(), basename(srcPath, ext) + '_tmp.jpg');
		execSync(`sips -s format jpeg "${srcPath}" --out "${tmp}"`, { stdio: 'ignore' });
		await sharp(tmp)
			.rotate()
			.resize({ width: 1200, withoutEnlargement: true })
			.webp({ quality: 82 })
			.toFile(destPath);
		unlinkSync(tmp);
	} else {
		await sharp(srcPath)
			.resize({ width: 1200, withoutEnlargement: true })
			.webp({ quality: 82 })
			.toFile(destPath);
	}
}

for (const country of COUNTRIES) {
	const srcDir = join(SOURCE_BASE, country);
	if (!existsSync(srcDir)) {
		console.log(`⚠  Skipping ${country} — folder not found at ${srcDir}`);
		continue;
	}

	const destDir = join(DEST_BASE, country);
	mkdirSync(destDir, { recursive: true });

	const files = readdirSync(srcDir);
	let converted = 0;
	let skipped = 0;

	console.log(`\n→ ${country} (${files.length} files)`);

	for (const file of files) {
		const ext = extname(file).toLowerCase();

		if (VIDEO_EXTS.has(ext)) {
			console.log(`  [skip video] ${file}`);
			skipped++;
			continue;
		}

		if (!HEIC_EXTS.has(ext) && !IMAGE_EXTS.has(ext)) {
			skipped++;
			continue;
		}

		const outName = basename(file, ext) + '.webp';
		const outPath = join(destDir, outName);

		if (existsSync(outPath)) {
			skipped++;
			continue;
		}

		try {
			await toWebP(join(srcDir, file), outPath);
			converted++;
			process.stdout.write(`\r  ${converted} converted, ${skipped} skipped...`);
		} catch (err) {
			console.error(`\n  [error] ${file}: ${err.message}`);
			skipped++;
		}
	}

	console.log(`\r  ✔ ${converted} converted, ${skipped} skipped       `);
}

console.log('\nDone.');
