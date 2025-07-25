var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log(console.log("🔑 Using OpenAI Key:", process.env.OPENAI_API_KEY));
  res.render('index', { title: 'Express' });
});

module.exports = router;
