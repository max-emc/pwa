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
  if (!isValidUrl(url)) return res.status(400).json({ error: "URL is invalid" });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const urlContent = await page.content();
    res.status(200).json({ content: urlContent });
  } catch (err) {
      console.error("Scraper error:", err);
      res.status(500).json({
      error: err.message,
      stack: err.stack,
      name: err.name,
    });
  } finally {
    if (browser) await browser.close();
  }
}
