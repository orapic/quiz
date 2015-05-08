var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
// Inicia una búsqueda con el identificador que se le pasa
// en caso de no encontrarlo, quiz sería undefined y se pasa al error
exports.load = function(req,res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' +quizId));}
    }
    ).catch(function(error){ next(error);});
};


// GET /quizes/index
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs' , {quizes : quizes});
  }).catch(function(error) { next(error);}) // por si hay un error 
};

//GET /quizes/:quizId(\\d+)
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz});
};

//GET /quizes/:quizId(\\d+)/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
    } 
    res.render('quizes/answer' , {quiz: req.quiz, respuesta: resultado});
};