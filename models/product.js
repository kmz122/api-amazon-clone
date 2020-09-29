//const { mongo } = require("mongoose");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAlgolia = require("mongoose-algolia");

const ProductSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    title: String,
    description: String,
    photo: String,
    price: Number,
    stockQuantity: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ProductSchema.virtual("averageRating").get(function () {
  if (this.reviews.length > 0) {
    let sum = this.reviews.reduce((total, review) => {
      // console.log("Review.rating", review.rating);
      return total + review.rating;
    }, 0);

    return sum / this.reviews.length;
  }

  return 0;
});

ProductSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET_KEY,
  indexName: process.env.ALGOLIA_INDEX, //The name of the index in Algolia, you can also pass in a function

  selector: "title _id photo description price rating averageRating owner", //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  populate: {
    path: "owner reviews",
    // select: "name",
  },
  debug: true,
});

let Model = mongoose.model("Product", ProductSchema);

Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
Model.SetAlgoliaSettings({
  searchableAttributes: ["title"], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
});

// module.exports = mongoose.model("Product", ProductSchema);
module.exports = Model;
