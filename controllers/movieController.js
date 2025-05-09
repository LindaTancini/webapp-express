//Index
function index(req, res) {
  res.send("Sono l'index dei film");
}

//Show
function show(req, res) {
  res.send("Sono lo show dei film");
}

module.exports = {
  index,
  show,
};
