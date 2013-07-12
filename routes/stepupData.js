
var GUID = require('./guid.js');
var restler = require('restler');

exports.getAllBadges = function(badgeData)
{

    restler.get("http://openbadges-hci.appspot.com/rest/getinfo/wespotbadges")
        .once('complete', function(result)
        {
            if (result instanceof Error) {
                console.log(result.message);
            }
            else
            {
              // console.log(result);
               badgeData.badgeDefinitions = result;
               badgeData.update();
            }

        });

}
exports.getBadgesOfPerson = function(id,badgeData)
{
    var options = {
        host: 'http://ariadne.cs.kuleuven.be/',
        port: 80,
        path: 'wespot-dev-ws/rest/getCourses/arLearn-fake/',
        method: 'POST'
    };

    var json = {pag:"0"};
    restler.postJson(options.host+ options.path + id + "/awarded", json)
        .once('complete', function(data, response) {
            if (response.statusCode != 200) {
            }
            else {
                //console.log(response);
                var badges = JSON.parse(response.rawEncoded);

                for (var i = 0; i < badges.length; i++) {

                    badges[i].context = JSON.parse(badges[i].context);
                    badges[i].originalrequest = JSON.parse(badges[i].originalrequest);
                    //console.log(badges[i].originalrequest.badge);
                    badges[i].guid = GUID.generateGUID();
                }

                badgeData.badgesById = badges;
                badgeData.update();
            }

        });

}