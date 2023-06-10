class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {                                      ///////
                $regex: this.queryStr.keyword,                  //
                $options: "i", //case insensitive               //
              },                                                //
            },                                                  //
            {                                                   //     This will search any keyword from Product name and
              description: {                                    //     description as well.
                $regex: this.queryStr.keyword,                  //
                $options: "i", //case insensitive               //
              },                                                //
            },                                                  //
          ],                                               ///////
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this; // this will return the whole class ApiFeature
  }

  filter() {
    const queryCopy = { ...this.queryStr }; //using spread operator to get the actual value, not reference.

    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    //Applying filter for price and rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeature;
