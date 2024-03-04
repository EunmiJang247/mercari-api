const httpStatus = require("http-status");
const { Order } = require("../models");
const puppeteer = require("puppeteer");
const ApiError = require("../utils/ApiError");
const cheerio = require('cheerio');

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// Function to format date as a string (adjust the format as needed)
// function formatDate(date) {
//   const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false};
//   return date.toLocaleDateString("en-US", options);
// }
const queryOrders = async (options) => {
  try {
    const skip = (options.page - 1) * options.limit;
    const dateFrom = options?.dateFrom;
    var dateTo = new Date(options?.dateTo);
    dateTo.setDate(dateTo.getDate() + 1);

    const nickName = options?.nickName;

    if (dateFrom && dateTo || nickName) {
      if (nickName && dateFrom && dateTo) {
        var rawData = await Order.find({
          createdAt: {
            $gte: dateFrom,
            $lte: dateTo,
          },
          nickName: { $regex: new RegExp(nickName, 'i') }, // 'i' flag for case-insensitive matching
          isConfirm: 'Yes'
        }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(options.limit));
      } else if (nickName) {
        var rawData = await Order.find({
          nickName: { $regex: new RegExp(nickName, 'i') }, // 'i' flag for case-insensitive matching
          isConfirm: 'Yes'
        }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(options.limit));
      } else {
        var rawData = await Order.find({
          createdAt: {
            $gte: dateFrom,
            $lte: dateTo,
          },
          isConfirm: 'Yes'
        }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(options.limit));
      }
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: 
        doc.deliveryDate,
        createdAt: doc.createdAt,
        // createdAt: formatDate(doc.createdAt),
      }));
      // console.log(data)
      return { data };
    } else {
      const rawData = await Order.find({isConfirm: 'Yes'})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: doc.deliveryDate,
        // createdAt: formatDate(doc.createdAt),
        createdAt: doc.createdAt,
      }));
      // console.log(data)
      return { data };
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};
const queryOrdersByUser = async (options) => {
  try {
    const skip = (options.page - 1) * options.limit;
    const dateFrom = new Date(options.dateFrom);
    const uid = options.uid;
    const dateTo = new Date(options.dateTo);

    // Increase dateTo by one day
    dateTo.setDate(dateTo.getDate() + 1);

    if (dateFrom && dateTo) {
      const rawData = await Order.find({
        createdAt: {
          $gte: dateFrom,
          $lte: dateTo,
        },
        uid: uid,
        isConfirm: 'Yes'
      }).sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: doc.deliveryDate,
        // createdAt: formatDate(doc.createdAt),
        createdAt: doc.createdAt,
      }));
      return { data };
    } else {
      const rawData = await Order.find({ uid: uid })
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        // deliveryDate: formatDate(doc.deliveryDate),
        deliveryDate: doc.deliveryDate,
        createdAt: doc.createdAt,
        // createdAt: formatDate(doc.createdAt),
      }));
      return { data };
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const openBrowser  = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2" // 500ms 동안 두 개 이상의 네트워크 연결이 없을 때 탐색이 완료되는 것으로 간주
    });
    const content = await page.content();
    await page.close();
    await browser.close();
    return content;
  } catch(e) {
    console.log(e, "에러");
    return '';
  }
}

const imageFetchPromises = async (order) => {
  const links = [];
  for(let i=0 ;i < order.items.length; i+=1) {
    const orderOne = order.items[i];
    const response = await openBrowser(orderOne.link);
    const $ = cheerio.load(response); // 가져온 HTML 코드를 cheerio로 로드합니다.

      let imageSrc;
      if (orderOne.link.includes("mercari")) {
        imageSrc = $('#main > article > div.sc-8251d49d-2.sc-c2ceaf31-0.vnkQK.bsFmrt.mer-spacing-b-32 > section > div > div > div.sc-8251d49d-2.fXQxtb > div > div.slick-slider.slick-initialized > div.slick-list > div > div.slick-slide.slick-active.slick-current > div > div > div > div > figure > div.imageContainer__f8ddf3a2 > picture > img').attr('src');
      } else if (orderOne.link.includes("amiami")) {
        imageSrc = $('#maincontents > div.image_area > div.main_image_area > div > img').attr('src');
      } else if (orderOne.link.includes("rakuten")) {
        imageSrc = $('#item > div > div.p-productDetailv2__mainLeft > div.c-switchSlide.js-switchSlideTrigger > ul.c-switchSlide__main.pc_page > li > a > img').attr('src');
      } else if (orderOne.link.includes("fril")) {
        imageSrc = $('#item-slider > div.sp-slides-container > div.sp-mask.sp-grab > div > div:nth-child(1) > div > img').attr('src');
      } else if (orderOne.link.includes("paypayfleamarket")) {
        imageSrc = $('#__next > div > main > div.sc-9bae193f-0.eWnaAG.ItemMain__Component > div:nth-child(1) > div > div.slick-slider.slick-initialized > div > div > div.slick-slide.slick-active.slick-current > div > div > img').attr('src');
      } else if (orderOne.link.includes("rakuten")) {
        imageSrc = $('#pagebody > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(3) > table:nth-child(2) > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(1) > div > div > div > div > div > img').attr('src');
      } else if (orderOne.link.includes("tower.jp")) {
        imageSrc = $('#main-image').attr('src');
      }

      if (!imageSrc) {
        imageUrl = $('meta[property="og:image"]').attr('content');
      }

      if (!imageSrc) {
        imageSrc = 'https://demofree.sirv.com/nope-not-here.jpg'; // 기본 이미지 URL
      }

      links.push({...orderOne, imageSrc})
  }
  return links;
}

const editImagePicUrl = async (id) => {
  const order = await Order.findById(id);
  const updatedItems = await imageFetchPromises(order);
  await Order.findByIdAndUpdate(id, { $set: { items: updatedItems } }, { new: true });
  return '';
}

const createOrder = async (orderBody) => {
  return Order.create(orderBody);
};

const createDraftOrder = async (orderbody) => {
    orderbody.isConfirm = 'No';
    return Order.create(orderbody);
};

const updateOrder = async (updateData) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(updateData.id, updateData, { new: true });
    return updatedOrder;
  } catch (error) {
    // Handle error
    console.error('Error updating order:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
const getOrder = async (id) => {
  return Order.findById(id);
};

const deleteOrderById = async (id) => {
  try {
    // console.log(id)
    const deletedOrder = await Order.findByIdAndDelete(id);
    return deletedOrder;
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting order:', error);
    throw error; // Rethrow the error to handle it in the caller function if needed
  }
};

module.exports = {
  queryOrders,
  createOrder,
  editImagePicUrl,
  queryOrdersByUser,
  getOrder,
  updateOrder,
  deleteOrderById,
  createDraftOrder
};
