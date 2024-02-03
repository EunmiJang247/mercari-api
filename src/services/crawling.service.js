const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const createCrawling = async (bodyData) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var imageData = [];
    
    for (const items of bodyData) {
      try {
        console.log(items.link);
        await page.goto(items.link, {
          waitUntil: "networkidle2",
        });
    
        const imageSources = await page.evaluate(() => {
          const pictureSelector = "picture";
          const pictureElement = document.querySelector(pictureSelector);
    
          if (pictureElement) {
            const imgElement = pictureElement.querySelector("img");
            return imgElement ? imgElement.src : null;
          }
          return null;
        });
    
        imageData.push({
          url: items.link,
          imageSources: imageSources,
        });
    
        console.log("Image Sources:", imageSources);
      } catch (error) {
        console.error("Error during navigation:", error.message);
        // Handle the error as needed (e.g., continue with the next iteration)
      }
    }
    
    // Close the browser when done
    await browser.close();
    return imageData;
    // Now, imageData array contains the collected data

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

module.exports = {
  createCrawling,
};
