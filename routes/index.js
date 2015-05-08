var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});


// Autoload de comandos con :quizId
// Sólo se ejecuta si hay parametros, si no los hay no lo hace
router.param('quizId', quizController.load); // autoload :quizId

// Definicion de ruta de quizes
router.get('/quizes', 	quizController.index);
router.get('/quizes/:quizId(\\d+)' , quizController.show);
router.get('/quizes/:quizId(\\d+)/answer' , quizController.answer);

router.get('/author', function(req,res){
	res.render('author', { title: 'Quiz' });
});

module.exports = router;
