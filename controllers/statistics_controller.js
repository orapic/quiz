var models = require('../models/models.js');

exports.index = function(req,res) {
	// buscamos todos los quizes incluyendo los comentarios
	models.Quiz.findAll({include: [models.Comment]}).then(function(quizes) {
		var i;
	var numPreguntas = quizes.length;
	var numComments=0;
	var numPreguntasSinComments=0;
	var numPreguntasConComments=0;
	var numMedioComments =0;
 	for (i=0;i<quizes.length;i++) {
 		var controlCom=0;
 			for(index in quizes[i].Comments) {
 				numComments++;
 				controlCom++;
 			}
 		if(controlCom===0){numPreguntasSinComments++;} else {numPreguntasConComments++;}
	}
	numMedioComments = (numComments/numPreguntas);

		res.render('statistics/index.ejs',{quizes: quizes,numMedioComments:numMedioComments, numPreguntas:numPreguntas, numPreguntasSinComments: numPreguntasSinComments,numPreguntasConComments:numPreguntasConComments, numComments:numComments, errors: []});
	});
	
}