var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dPort = 27017;
var dHost = '127.0.0.1';
var dName = 'MAS';

var User = {};

User.db = new Db(dName, new Server(dHost, dPort,{default_reconnect: true},{}), {safe: true});


User.db.open(function  (e, d) {
	if (e) {
		console.log(e);
	} else{
		console.log("Conectado a la bd: "+dName);
	};
});


User.list = User.db.collection('user');

module.exports = User;

//////////// Methos of Users ///////////////////////

User.new = function  ( data, callback) {
	User.list.findOne({email: data.email}, function  (e,obj) {
		if (obj) {
			callback('Ese email ya existe.');
			console.log('Ese email ya existe.');
		} else{
			User.list.insert(data, function (err) {
				// if return an error
				if (!err) {
					console.log('Nuevo email');
					callback(null);
				} else{
					console.log('Error al insertar nuevo mail');
					callback('Se produjo un error al insertar');
				};
			}); 
			// if you truly don't care whether the insert succeeds or not, pass a write-concern value of 0 in the options parameter:
			// db.collection("test").insert({ str: "foobar" }, { w: 0 });
		};
	})
}

User.show = function (callback) {
	User.list.find().toArray(function (e, res) {
		if (e) {
			callback(e);
		} else{
			callback(null,res);
		}
	});
}

User.edit = function (data, callback) {
	User.list.findOne({_id: this.getObjectId(data.id)}, function (err, obj) {
		obj.name = data.name;
		obj.email = data.email;
		User.list.save(obj, function (err) {
			if (!err) {
				callback(obj);
			} else{
				callback(null);
			}
		})
	})
}

User.delete = function (id, callback) {
	User.list.remove({_id: this.getObjectId(id)},function (err) {
		if (!err) {
			console.log('Eliminado existosamente');
			callback(null);
		} else{
			console.log('Error al eliminar');
			callback('Error al eliminar');
		}
	})
}

User.getObjectId = function (id) {
	return User.list.db.bson_serializer.ObjectID.createFromHexString(id);
}