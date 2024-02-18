const puppeteer = require("puppeteer");

const createCrawling = async (bodyData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let imageData = [];
    for (let i = 0; i < bodyData.length ; i += 1 ) {
  try {
      const items = bodyData[i];
      await page.goto(bodyData[i].link, {
        waitUntil: 'networkidle2',
        timeout: 0,
      });

      const imageSources = await page.evaluate((items) => {
        let pictureSelector;
        if (items.link.includes("mercari")) {
          // console.log(`Processing URL: ${items.link} for jp.mercari.com`);
          pictureSelector = 'picture';
        } else if (items.link.includes("amiami")) {
          // console.log(`Processing URL: ${items.link} for www.amiami.jp`);
          pictureSelector = '.main_image_area';
        } else if (items.link.includes("rakuten")) {
          // console.log(`Processing URL: ${items.link} for biccamera.rakuten.co.jp`);
          pictureSelector = '.popup-modal2';
        } else if (items.link.includes("fril")) {
          // console.log(`Processing URL: ${items.link} for item.fril.jp`);
          pictureSelector = '#photoFrame';
        } else if (items.link.includes("paypayfleamarket")) {
          pictureSelector = '.slick-current';
        } else {
          // console.log(`No match found for URL: ${items.link}`);
        }
        const pictureElement = document.querySelector(pictureSelector);

        if (pictureElement) {
          const imgElement = pictureElement.querySelector('img');
          return imgElement ? imgElement.src : null;
        }
      }, items);
      console.log(imageSources);

      if (imageSources !== null) {
        imageData.push({
          url: items.link,
          imageSources: imageSources,
        });
      } else {
        imageData.push({
          url: bodyData[i].link,
          imageSources: 'https://demofree.sirv.com/nope-not-here.jpg',
        });
      }
    } catch {
      imageData.push({
        url: bodyData[i].link,
        imageSources: 'https://demofree.sirv.com/nope-not-here.jpg',
      });
    }
    }
    
    await browser.close();
    return imageData;
};

//

module.exports = {
  createCrawling,
};
