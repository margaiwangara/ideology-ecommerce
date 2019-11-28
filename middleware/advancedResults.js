const advancedResults = (model, populate) => async (req, res, next) => {
  try {
    let query;
    // copy req.query
    const reqQuery = { ...req.query };

    // remove fields
    const removeFields = ["filter", "select", "sort", "page", "limit"];
    removeFields.forEach(param => delete reqQuery[param]);

    // convert query to string
    let queryStr = JSON.stringify(reqQuery);

    // attach for quering
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    // run query
    query = model.find(JSON.parse(queryStr));

    // select query
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // filtering
    if (req.query.filter) {
      // new approach split then create object
      const filterBy = req.query.filter.split(/[;:]/g);
      const filterObj = {};

      // loop
      for (let i = 0; i < filterBy.length; i++) {
        if (i == 0 || i % 2 == 0) {
          let holder = "attributes." + filterBy[i];
          filterObj[holder] = {
            $in: filterBy[i + 1].split(",")
          };
        }
      }

      // use generated result to run query
      query = query.find(filterObj);
    }

    // console.log(`Query String: ${queryStr}`);

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    // pagination query
    query = query.skip(startIndex).limit(limit);

    // check if populate exists
    if (populate) {
      query = query.populate(populate);
    }

    // get all results
    results = await query;

    // pagination links
    pagination = {};

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
