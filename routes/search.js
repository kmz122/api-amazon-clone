const router = require("express").Router();

const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET_KEY
);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

router.post("/search", async (req, res) => {
  try {
    let result = await index.search(req.body.title);
    if (result) res.json(result.hits);
    console.log(result.hits);
    // res.json({ products: result.hits });

    // await index.search(req.body.title).then(({ hits }) => {
    //   //   console.log(hits);
    //   res.json(hits);
    // });
  } catch (error) {
    res.json(error.message);
  }
});

// export
module.exports = router;
