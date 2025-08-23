// import chromium from "chrome-aws-lambda";
// import puppeteer from "puppeteer-core";

// async function scrapeWebsite(url) {
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: chromium.headless,
//   });

//   try {
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: "networkidle2" });
//     const content = await page.content();
//     return content;
//   } finally {
//     await browser.close();
//   }
// }

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { url } = req.body;

//     if (!url) {
//       return res.status(400).json({ error: "Aucune URL fournie" });
//     }

//     try {
//       const urlContent = await scrapeWebsite(url);
//       res.status(200).json({ content: urlContent });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message });
//     }
//   } else {
//     res.status(405).json({ error: "Méthode non autorisée" });
//   }
// }

import { chromium } from "playwright";

async function isValidUrl(url) {
	try {
		const res = await fetch(url, { method: "HEAD" });
		return res.ok;
	} catch (err) {
		return false;
	}
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });
  if (!isValidUrl(url)) return res.status.json({ error: "URL is invalid"})

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const urlContent = await page.content();
    res.status(200).json({ content: urlContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}
