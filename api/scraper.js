// import { chromium } from "playwright";

// async function isValidUrl(url) {
// 	try {
// 		const res = await fetch(url, { method: "HEAD" });
// 		return res.ok;
// 	} catch (err) {
// 		return false;
// 	}
// }

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: "No URL provided" });
//   if (!isValidUrl(url)) return res.status(400).json({ error: "URL is invalid" });

//   let browser;
//   try {
//     browser = await chromium.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(url);
//     const urlContent = await page.content();
//     res.status(200).json({ content: urlContent });
//   } catch (err) {
//       console.error("Scraper error:", err);
//       res.status(500).json({
//       error: err.message,
//       stack: err.stack,
//       name: err.name,
//     });
//   } finally {
//     if (browser) await browser.close();
//   }
// }

// import chromium from 'playwright-aws-lambda';

// export default async function handler(req, res) {
//   const browser = await chromium.launch({ headless: true });
//   // const page = await browser.newPage();
//   // await page.goto('https://example.com');
//   // const title = await page.title();
//   // await browser.close();

//   // res.status(200).json({ title });
//   res.status(200).json({ test: "ok" });
// }

// npm install playwright-core
// const { chromium } = require('playwright-core');

// const scraper = async () => {
//     try {
//         // get correct Chromium path
//         const executablePath =
//             '<CHROMIUM_EXECUTABLE_PATH>/chrome.exe';

//         // launch browser with external Chromium
//         const browser = await chromium.launch({
//             executablePath: executablePath,
//             headless: true,
//         });

//         // create a new page instance
//         const context = await browser.newContext();
//         const page = await context.newPage();

//         // navigate to the target site
//         await page.goto('https://www.scrapingcourse.com/ecommerce/');

//         // get the target site HTML content
//         const htmlContent = await page.content();

//         // close the browser instance
//         await browser.close();

//         console.log(htmlContent);
//     } catch (error) {
//         console.error('Browser Launch Error:', error);
//     }
// };

// // execute the scraper
// scraper();

// npm install playwright-core @sparticuz/chromium

import { chromium as playwrightChromium } from 'playwright-core';
import chromiumLambda from '@sparticuz/chromium';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const url = "https://example.com/";

  let browser;
  try {
    let executablePath;
    let args;

    if (os.platform() === 'win32') {
      // Sur Windows : utilise ton Chrome/Chromium installé
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // adapte si nécessaire
      args = [];
    } else {
      // Sur Linux / Vercel : utilise le Chromium serverless
      executablePath = await chromiumLambda.executablePath();
      args = chromiumLambda.args;
    }

    browser = await playwrightChromium.launch({
      executablePath,
      args,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const content = await page.content();

    res.status(200).json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}

