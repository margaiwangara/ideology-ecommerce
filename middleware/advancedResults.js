const advancedResults = (model, populate) => async (req, res, next) => {
  try {
    let query;

    // make copy of req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "filter", "sort", "page", "limit"];

    // loop over remove fields and delete from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // price handling
    queryStr = queryStr.replace(
      /\b(gt|lt|gte|lte|in)\b/g,
      match => `$${match}`
    );
    // replace rating to average rating
    queryStr = queryStr.replace("rating", "averageRating");

    // handling filters
    //filter=color:red,green;size:s,xs; displays products that have red and green color and also s and xs size
    // run query
    query = model.find(JSON.parse(queryStr));

    // check if select exists and select input fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // filtering
    if (req.query.filter) {
      // initial split color:red,green;size:s,xs;
      const firstSplit = req.query.filter.split(";");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    // pagination query
    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    // get all results
    const results = await query;

    // pagination
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = advancedResults;
