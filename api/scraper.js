import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();
    return content;
  } finally {
    await browser.close();
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Aucune URL fournie" });
    }

    try {
      const urlContent = await scrapeWebsite(url);
      res.status(200).json({ content: urlContent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
