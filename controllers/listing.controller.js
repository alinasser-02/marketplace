const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const isSignedIn = require("../middleware/is-signed-in");

// VIEW NEW LISTING FORM
router.get("/new", isSignedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// POST FORM DATA TO DATABASE
router.post("/", isSignedIn, async (req, res) => {
  try {
    req.body.seller = req.session.user._id;
    await Listing.create(req.body);
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
});

// VIEW THE INDEX PAGE
router.get("/", async (req, res) => {
  const foundListings = await Listing.find();
  console.log(foundListings);
  res.render("listings/index.ejs", { foundListings: foundListings });
});

// VIEW A SINGLE LISTING (SHOW PAGE)
router.get("/:listingId", async (req, res) => {
  try {
    const foundListing = await Listing.findById(req.params.listingId).populate(
      "seller"
    );
    console.log(foundListing);
    res.render("listings/show.ejs", { foundListing: foundListing });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// DELETE LISTING FROM DATABASE
router.delete("/:listingId", async (req, res) => {
  const foundListing = await Listing.findById(req.params.listingId).populate(
    "seller"
  );
  if (foundListing.seller._id.equals(req.session.user._id))
   { await Listing.findByIdAndDelete(req.params.listingId);
  res.redirect("/listings");}
  return res.send('Not Authorized')
});
module.exports = router;
