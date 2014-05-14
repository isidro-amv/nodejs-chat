
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

var user = require('../models/user')

module.exports = function(app) {

    // load index test
    app.get('/', function (req, res) {
		res.redirect('/home')
        //show_user(req,res);
	});

    app.get('/home', function (req, res) {
        res.render('home');
    });

    app.get('/lobby', function (req, res) {
        res.render('lobby');
    });

    app.get('/chat/:tagId', function (req, res) {
        res.render('chat');
    });

	app.post('/', function (req, res) {
		user.new({name: req.param('name'), email: req.param('email')},function (e) {
			if(!e){
				show_user(req,res);
			}else{
				res.render('index',{error: e, title:'Express'})				
			}
		})
    });

    app.get('/login', function (req, res) {
        res.render('login',{email: req.session.email});
    });

    app.post('/login', function (req, res) {
        req.session.email = req.param('email');
        res.redirect('/lobby');
    });

    app.post('/save', function  (req, res) {
    	user.edit({name: req.param('name'), email: req.param('email'), id: req.param('id')}, function  (obj) {
    		if (obj) {
    			res.redirect('/');
    		} else{
    			res.send('Error al actualizar registro',400);
    		}
    	})
    });

    app.post('/delete', function (req, res) {
    	user.delete(req.body.id, function (err, obj) {
    		if (!err) {
    			res.send('ok',201)
    		} else{
    			res.send('El usuario no existe',400)
    		};
    	})
    })

}

function show_user (req, res) {
	user.show(function (e, lis) {
		res.render('index',{error:e,title:'Expres', list:lis, email: req.session.email});
        console.log(req.session.email+"foo");
	});
}  