import express from 'express';
var router = express.Router();

// Default route:
router.get('/', function(req, res) {
  // Rendering our web page i.e. Demo.ejs 
  // and passing title variable through it 
    res.render('Login'); 
});

router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
});

module.exports = router;