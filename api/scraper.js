import { chromium as playwrightChromium } from "playwright-core";
import chromiumLambda from "@sparticuz/chromium";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import path from "path";
import os from "os";

async function isValidUrl(url) {
	try {
		const res = await fetch(url, { method: "HEAD" });
		return res.ok;
	} catch (err) {
		return false;
	}
}

async function extractArticle(html, url) {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    return article;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });
  if (!(await isValidUrl(url))) {
    return res.status(400).json({ error: "URL is invalid" });
  }

  let browser;
  try {
    let executablePath;
    let args;

    if (os.platform() == "win32") {
        executablePath= "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        args = [];
    } else {
        executablePath = await chromiumLambda.executablePath();
        args = chromiumLambda.args;
    }

    browser = await playwrightChromium.launch({
        executablePath,
        args,
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    const article = await extractArticle(html, url)

    res.status(200).json({ content: article });

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
