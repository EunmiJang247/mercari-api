const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");

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
function formatDate(date) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}
const queryOrders = async (options) => {
  try {
    const skip = (options.page - 1) * options.limit;
    const dateFrom = options.dateFrom;
    const dateTo = new Date(options.dateTo);

    if (dateFrom && dateTo) {
      const rawData = await Order.find({
        createdAt: {
          $gte: dateFrom,
          $lte: dateTo,
        },
      }).sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: formatDate(doc.deliveryDate),
        createdAt: formatDate(doc.createdAt),
      }));
      return { data };
    } else {
      const rawData = await Order.find()
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: formatDate(doc.deliveryDate),
        createdAt: formatDate(doc.createdAt),
      }));
      return { data };
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

module.exports = {
  queryOrders,
};
