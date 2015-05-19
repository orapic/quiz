var models = require('../models/models.js');

exports.index = function(req,res) {
	// buscamos todos los quizes incluyendo los comentarios
	models.Quiz.findAll({include: [{model:Comment}]}).then(function(quizes) {
		
		res.render('statistics/index.ejs',{quizes: quizes, errors: []});
	});
	
}