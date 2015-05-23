var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});


// Autoload de comandos con :quizId
// Sólo se ejecuta si hay parametros, si no los hay no lo hace
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId
router.param('userId', userController.load); // autoload :userId

// Definición de rutas de sesión
router.get('/login' , sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definicion de rutas de quizes
router.get('/quizes', 	quizController.index);
router.get('/quizes/:quizId(\\d+)' , quizController.show);
router.get('/quizes/:quizId(\\d+)/answer' , quizController.answer);
router.get('/quizes/new' , sessionController.loginRequired, quizController.new); // crear una pregunta
router.post('/quizes/create' , sessionController.loginRequired, multer({ dest: './public/media/'}), quizController.create); 
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, quizController.ownershipRequired, quizController.edit); // editar una pregunta
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, multer({ dest: './public/media/'}), quizController.update); 
router.delete('/quizes/:quizId(\\d+)' , sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy); // borrar una pregunta

// Definición de rutas de sesión
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments' , commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish' , sessionController.loginRequired, commentController.ownershipRequired, commentController.publish); // uso no correcto, debería ser un put

//definición de rutas de cuenta
router.get('/user', userController.new); // formulario sign in
router.post('/user', userController.create); // registrar usuario
router.get('/user/:userId(\\d+)/edit',sessionController.loginRequired, userController.ownershipRequired,userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes', quizController.index);

//página de créditos
router.get('/author', function(req,res){
	res.render('author', { title: 'Quiz' , errors:[]});
});

// GET /quizes/statistics
router.get('/quizes/statistics', statisticsController.index);

module.exports = router;
