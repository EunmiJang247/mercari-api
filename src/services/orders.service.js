const httpStatus = require("http-status");
const { Order } = require("../models");
const puppeteer = require("puppeteer");
const ApiError = require("../utils/ApiError");
const cheerio = require('cheerio');
const { default: axios } = require("axios");

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

// const openBrowser = async (url) => {
//   try {
//     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
//     await page.goto(url, { waitUntil: 'networkidle0', timeout: 40000 }); // waitUntil 옵션을 networkidle0으로 변경
//     const content = await page.content();
//     await page.close();
//     await browser.close();
//     return content;
//   } catch (e) {
//     console.log(`${e} 에러, URL: ${url}`);
//     return '';
//   }
// };

const fetchImageForItem = async (orderOne) => {
  console.log('시작!11')
  let imageSrc;
  try {
    // const response = await openBrowser(orderOne.link);
    // const $ = cheerio.load(response);
  
    // if (orderOne.link.includes("mercari")) {
    //   imageSrc = $('#main > article > div.sc-8251d49d-2.sc-148bdf4f-0.vnkQK.iJIOiA.mer-spacing-b-32 > section > div > div > div > div > div.slick-slider.slick-initialized > div.slick-list > div > div.slick-slide.slick-active.slick-current > div > div > div > div > figure > div.imageContainer__f8ddf3a2 > picture > img').attr('src');
    // } else if (orderOne.link.includes("amiami")) {
    //   imageSrc = $('#maincontents > div.image_area > div.main_image_area > div > img').attr('src');
    // } else if (orderOne.link.includes("fril")) {
    //   imageSrc = $('#item-slider > div.sp-slides-container > div.sp-mask.sp-grab > div > div:nth-child(1) > div > img').attr('src');
    // } else if (orderOne.link.includes("paypayfleamarket")) {
    //   imageSrc = $('#__next > div > main > div.sc-9bae193f-0.eWnaAG.ItemMain__Component > div:nth-child(1) > div > div.slick-slider.slick-initialized > div > div > div.slick-slide.slick-active.slick-current > div > div > img').attr('src');
    // } else if (orderOne.link.includes("rakuten")) {
    //   imageSrc = $('#pagebody > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(3) > table:nth-child(2) > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(1) > div > div > div > div > div > img').attr('src');
    // } else if (orderOne.link.includes("tower.jp")) {
    //   imageSrc = $('#main-image').attr('src');
    // }
  
    // if (!imageSrc) {
    //   imageSrc = $('meta[property="og:image"]').attr('content') || 'https://demofree.sirv.com/nope-not-here.jpg';
    // }
    const imageSrcFromServer = await axios({
      method: 'POST',
      url: 'http://13.209.143.143:5000/givemeimg',
      data: {
        url: orderOne.link
      },
      timeout: 60000 * 30,
    });
    imageSrc = imageSrcFromServer.data.image_url
    console.log(imageSrc, "imageSrc..22")
  } catch(e) {
    console.log(e, "문제는 이거에요")
    imageSrc = 'https://demofree.sirv.com/nope-not-here.jpg';
  }

  return { ...orderOne, imageSrc };
};

const imageFetchPromises = async (order) => {
  const links = []; // 결과를 저장할 빈 배열 초기화

  const promises = order.items.map(async (item) => {
    return fetchImageForItem(item);
  });
  const results = await Promise.all(promises);
  links.push(...results);

  // for (const item of order.items) {
  //   console.log(item, "itme임요")
  //   // 각 아이템에 대해 순차적으로 fetchImageForItem 함수를 호출하고, 결과를 links 배열에 추가
  //   const result = await fetchImageForItem(item);
  //   links.push(result);
  //   console.log('333')
  // }

  return links; // 모든 아이템에 대한 처리가 완료된 후 links 배열 반환
};

const editImagePicUrl = async (id) => {
  try {
    const order = await Order.findById(id);
    const updatedItems = await imageFetchPromises(order);
    await Order.findByIdAndUpdate(id, { $set: { items: updatedItems } }, { new: true });
    console.log(updatedItems, "updatedItems");
  } catch (error) {
    console.error("Error updating image URL for order:", id, error);
    // 에러 로깅 또는 재시도 로직
  }
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
