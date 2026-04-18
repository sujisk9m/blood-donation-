router.get("/all", async (req, res) => {
  const donors = await Donor.find();
  res.json(donors);
});

router.post("/register", async (req, res) => {
  const donor = new Donor(req.body);
  await donor.save();
  res.send("Donor registered successfully");
});