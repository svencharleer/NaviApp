
/*
 * GET home page.
 */

var restler = require('restler');
var http = require('http');


var GUID = function(){
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
         return v.toString(16);
    });     
    return guid;
};


exports.index = function(req, res){

	var data = {
	    value: JSON.stringify({ page: '0'}),
	    content_type: 'application/json'
	  
	}
	var options = {
	  host: 'http://ariadne.cs.kuleuven.be/',
	  port: 80,
	  path: 'wespot-dev-ws/rest/getCourses/arLearn-fake/google_116743449349920850150/awarded',
	  method: 'POST'
	};
	
	var json = {pag:"0"};

	restler.postJson(options.host+ options.path, json)
		.on('complete', function(data, response) {
	  		if (response.statusCode == 200) {
	    		var badges = JSON.parse(response.rawEncoded);
	  			
	    		for(var i = 0; i < badges.length; i++)
	    		{
	    			
	    			badges[i].context = JSON.parse(badges[i].context);
	    			badges[i].originalrequest = JSON.parse(badges[i].originalrequest);
	    			console.log(badges[i].originalrequest.badge);
	    			//badges[i].originalrequest.badge = JSON.parse(badges[i].originalrequest.badge);
	    			//badges[i].originalrequest.issuer.badge = JSON.parse(badges[i].originalrequest.issuer.badge);
	    			badges[i].guid = GUID();
	    		}
	    		
	  			res.render('index.html', { badges: badges });
	  }
//	  console.log(response.rawEncoded);
	  
	});
  	
};



