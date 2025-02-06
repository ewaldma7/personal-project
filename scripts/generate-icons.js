import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import pngToIco from "png-to-ico";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = {
  "favicon.ico": 32,
  "icon.png": 32,
  "icon-192.png": 192,
  "icon-512.png": 512,
  "apple-icon.png": 180,
};

async function generateIcons() {
  const svgBuffer = fs.readFileSync(join(__dirname, "../public/crown.svg"));

  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = join(__dirname, "../public", filename);

    if (filename.endsWith(".ico")) {
      // Create a temporary PNG first
      const tempPngPath = join(__dirname, "../public/temp.png");
      await sharp(svgBuffer)
        .resize(size, size)
        .toFormat("png")
        .toFile(tempPngPath);

      // Convert PNG to ICO
      const icoBuffer = await pngToIco([tempPngPath]);
      fs.writeFileSync(outputPath, icoBuffer);

      // Clean up temporary PNG
      fs.unlinkSync(tempPngPath);
    } else {
      await sharp(svgBuffer)
        .resize(size, size)
        .toFormat("png")
        .toFile(outputPath);
    }
  }

  console.log("All icons generated successfully!");
}

generateIcons().catch(console.error);
