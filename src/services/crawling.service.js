const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const createCrawling = async (bodyData) => {
  // try {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   var imageData = [];
    
  //   for (const items of bodyData) {
  //     try {
  //       console.log(items.link);
  //       await page.goto(items.link, {
  //         waitUntil: "networkidle2",
  //       });
    
  //       const imageSources = await page.evaluate(() => {
  //         const pictureSelector = "picture";
  //         const pictureElement = document.querySelector(pictureSelector);
    
  //         if (pictureElement) {
  //           const imgElement = pictureElement.querySelector("img");
  //           return imgElement ? imgElement.src : null;
  //         }
  //         return null;
  //       });
  //       if (imageSources !== null) {
  //         imageData.push({
  //           url: items.link,
  //           imageSources: imageSources,
  //         });
  //         console.log("Image Sources:", imageSources);
  //       } else {
  //         console.log("No image sources found for:", items.link);
  //       }
  //       console.log("Image Sources:", imageSources);
  //     } catch (error) {
  //       console.error("Error during navigation:", error.message);
  //       // Handle the error as needed (e.g., continue with the next iteration)
  //     }
  //   }
    
  //   // Close the browser when done
  //   await browser.close();
  //   return imageData;
  //   // Now, imageData array contains the collected data

  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // }
  let imageData = [];

  while (true) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      for (const items of bodyData) {
        await page.goto(items.link, {
          waitUntil: 'networkidle2',
        });

        const imageSources = await page.evaluate(() => {
          const pictureSelector = 'picture';
          const pictureElement = document.querySelector(pictureSelector);

          if (pictureElement) {
            const imgElement = pictureElement.querySelector('img');
            return imgElement ? imgElement.src : null;
          }
          return null;
        });

        if (imageSources !== null) {
          imageData.push({
            url: items.link,
            imageSources: imageSources,
          });
          // console.log('Image Sources:', imageSources);
        } else {
          // console.log('No image sources found for:', items.link);
          // If image source is null, break the loop and retry
          await browser.close();
          break;
        }
      }

      // Close the browser when the loop completes successfully
      await browser.close();
      return imageData;
    } catch (error) {
      console.error('Error during navigation:', error.message);
      // Handle the error as needed
      await browser.close();
    }
  }
};

module.exports = {
  createCrawling,
};