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
      } else { next(new Error('No existe quizId=' +quizId))}
    }).catch(function(error){ next(error)});
};


//function auxiliar para cambiar los espacios de la busqueda por %
function cleanInput(data) {
  var cleanData = data.toString().replace(/(\s)/gm,"%");
  var porcentaje = "%";
  cleanData = porcentaje.concat(cleanData,porcentaje);
  return cleanData;
}

// GET /quizes/index
exports.index = function(req, res) {
  if(req.query.search != null){ // si no es null la busqueda hay que buscar en la base de datos
    var cleanSearch = cleanInput(req.query.search);
    models.Quiz.findAll({where: ["pregunta like ?", cleanSearch] , order: ['pregunta']}).then(function(quizes){
      res.render('quizes/index.ejs' , {quizes : quizes, search : cleanSearch, errors: []});
    }).catch(function(error) { next(error);}); // por si hay un error 
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs' , {quizes : quizes, search : req.query.search, errors: []});
    }).catch(function(error) { next(error)}); // por si hay un error 
  }
};

//GET /quizes/:quizId(\\d+)
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};

//GET /quizes/:quizId(\\d+)/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
    } 
    res.render('quizes/answer' , {quiz: req.quiz, respuesta: resultado, errors: []});
};


// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta" , respuesta: "Respuesta"}
    );
  res.render('quizes/new' , {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz.validate().then(function(err){
      if(err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
          quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
              res.redirect('/quizes')
          })   // res.redirect: Redirección HTTP a lista de preguntas
  }
});
};