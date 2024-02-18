const puppeteer = require("puppeteer");

const createCrawling = async (bodyData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let imageData = [];
  
  for (let i = 0; i < bodyData.length; i += 1) {
    try {
      const currentItem = bodyData[i];
      const imageSources = await page.goto(bodyData[i].link, {
        waitUntil: 'networkidle2',
        timeout: 10000, // 10초 후에 타임아웃
      }).then(async () => {
        let pictureSelector;
        if (currentItem.link.includes("mercari")) {
          pictureSelector = 'picture';
        } else if (currentItem.link.includes("amiami")) {
          pictureSelector = '.main_image_area';
        } else if (currentItem.link.includes("rakuten")) {
          pictureSelector = '.popup-modal2';
        } else if (currentItem.link.includes("fril")) {
          pictureSelector = '#photoFrame';
        } else if (currentItem.link.includes("paypayfleamarket")) {
          pictureSelector = '.slick-current';
        }
        const pictureElement = document.querySelector(pictureSelector);

        if (pictureElement) {
          const imgElement = pictureElement.querySelector('img');
          return imgElement ? imgElement.src : null;
        }
        return null;
      });

      imageData.push({
        url: currentItem.link,
        imageSources: imageSources ? imageSources : 'https://demofree.sirv.com/nope-not-here.jpg',
      });
    } catch (error) {
      console.error(`Error processing URL: ${bodyData[i].link}`, error);
      imageData.push({
        url: bodyData[i].link,
        imageSources: 'https://demofree.sirv.com/nope-not-here.jpg',
      });
    }
  }
  
  await browser.close();
  return imageData;
};

module.exports = {
  createCrawling,
};
