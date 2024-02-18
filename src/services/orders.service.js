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
        createdAt: formatDate(doc.createdAt),
      }));
      return { data };
    } else {
      const rawData = await Order.find({isConfirm: 'Yes'})
        .skip(skip)
        .limit(parseInt(options.limit));

      // Map the array to format the deliveryDate field
      const data = rawData.map((doc) => ({
        ...doc.toObject(), // Convert the Mongoose document to a plain JavaScript object
        deliveryDate: doc.deliveryDate,
        createdAt: formatDate(doc.createdAt),
      }));
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
        createdAt: formatDate(doc.createdAt),
      }));
      return { data };
    } else {
      const rawData = await Order.find({ uid: uid })
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
const createOrder = async (orderbody) => {
    return Order.create(orderbody);
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
  queryOrdersByUser,
  getOrder,
  updateOrder,
  deleteOrderById,
  createDraftOrder
};
