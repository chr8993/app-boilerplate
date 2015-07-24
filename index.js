var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

// var CatSchema = mongoose.Schema({
// 	name: String
// })
// var Cat = mongoose.model('Cat', CatSchema);

// var kitty = new Cat({ name: 'Zildjian' });
// kitty.save(function(err) {
// 	if(err) {
// 		console.log('meow');
// 	}
// });

// Cat.find(function(err, kitties) {
// 	if(!err) {
// 		console.log(kitties);
// 	}
// });

var Schema = mongoose.Schema;

var Clients = new Schema({
	first_name : {
		type: String, required: true 
	},
	last_name: {
		type: String, required: true
	},
	email: {
		type: String, required: true
	},
	phone: {
		type: String, required: true
	},
	address: {
		street: {
			type: String, required: true
		},
		city: {
			type: String, required: true
		},
		state: {
			type: String, required: true
		},
		zip: {
			type: String, required: true
		}
	},
	modified: {type: Date, default: Date.now}
});

var Leads = new Schema({
	lead_source: {type: String, required: true},
	modified: {type: Date, default: Date.now},
	client: {
		type: Schema.ObjectId,
		ref: 'Clients'
	}
});

var Sales = new Schema({
	base_price: String,
	sale_date: Date,
	client: {
		type: Schema.ObjectId,
		ref: 'Clients'
	},
	modified: {type: Date, default: Date.now}
});

// var Closings = new Schema({});

// var Realtors = new Schema({});

var ClientModel = mongoose.model('Client', Clients);
var LeadModel = mongoose.model('Lead', Leads);
var SaleModel = mongoose.model('Sale', Sales);

// client = new ClientModel({
// 	 first_name: 'Christian', 
// 	 last_name: 'Gomez',
// 	 email: 'cgomez@newhomestar.com',
// 	 phone: '7084429193',
// 	 address: {
// 	 	street: '1234 Sesame St.',
// 	 	city: 'Sunset Valley',
// 	 	state: 'IL',
// 	 	zip: '60546'
// 	 }});


// client.save(function(err){
// 	if(!err) {
// 		console.log('Saved Success!');
// 	}
// });
var id;
ClientModel.find(function(err, clients) {
	if(!err){
		id = clients[0]._id;
		// console.log(id);
		console.log(id);
		lead = new LeadModel({
			lead_source: "Awesome Yo",
			client: {
			 	_id: id
			}
		});
		lead.save(function(err){
			if(!err){
				// console.log('saved');
			} else {
				// console.log(err);
			}
		})
		LeadModel.find(function(err, leads) {
			if(!err) {
				console.log(leads);
			}
		})
	} else {
		// console.log(err);
	}
});

