const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const createCrawling = async (bodyData) => {
  console.log(bodyData);
  
  let imageData = [];

  while (true) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      for (const items of bodyData) {
        if (validateURL(items.link)) {
          console.log(`Processing URL: ${items.link}`);
          await page.goto(items.link, {
            waitUntil: 'networkidle2',
            timeout: 0,
          });
  
          const imageSources = await page.evaluate((items) => {
            let pictureSelector;
            if (items.link.includes("mercari")) {
              console.log(`Processing URL: ${items.link} for jp.mercari.com`);
              pictureSelector = 'picture';
            } else if (items.link.includes("amiami")) {
              console.log(`Processing URL: ${items.link} for www.amiami.jp`);
              pictureSelector = '.main_image_area';
            } else if (items.link.includes("rakuten")) {
              console.log(`Processing URL: ${items.link} for biccamera.rakuten.co.jp`);
              pictureSelector = '.popup-modal2';
            } else if (items.link.includes("fril")) {
              console.log(`Processing URL: ${items.link} for item.fril.jp`);
              pictureSelector = '#photoFrame';
            } else if (items.link.includes("paypayfleamarket")) {
              pictureSelector = '.slick-current';
            } else {
              console.log(`No match found for URL: ${items.link}`);

            }
            const pictureElement = document.querySelector(pictureSelector);
  
            if (pictureElement) {
              const imgElement = pictureElement.querySelector('img');
              return imgElement ? imgElement.src : null;
            }
          }, items);
          if (imageSources !== null) {
            imageData.push({
              url: items.link,
              imageSources: imageSources,
            });
          } else {
            await browser.close();
            break;
          }
        }
      }
      await browser.close();
      console.log(imageData);
      return imageData;
    } catch (error) {
      console.error('Error during navigation:', error.message);
      await browser.close();
    }
  }
};

function validateURL(url) {
  const validStrings = [
    /jp.mercari.com/,
    /www.amiami.jp/,
    /biccamera.rakuten.co.jp/,
    /item.fril.jp/,
    /paypayfleamarket.yahoo.co.jp/
  ];

  // Iterate through each pattern
  for (const pattern of validStrings) {
    // Check if the URL matches the pattern
    if (pattern.test(url)) {
      return true; // Return true if a match is found
    }
  }

  // If no match is found after checking all patterns, return false
  console.log('invalid:', url);
  return false;
}


module.exports = {
  createCrawling,
};
