
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
                badgeData.badgeDefinitions = {};
              // console.log(result);
                for(var i=0; i < result.length; i++)
                {

                    badgeData.badgeDefinitions[result[i].badge.image] = result[i];
                }

               badgeData.badgeDefinitionsUpdated();
            }

        });

}

exports.getAllStudents = function(badgeData)
{
    var json = {pag:"0"};
    restler.postJson("http://ariadne.cs.kuleuven.be/wespot-dev-ws/rest/getCourses/arLearn-fake/verb/awarded", json)
        .once('complete', function(data, response) {
            if (response.statusCode != 200) {
            }
            else {
                 badgeData.students = JSON.parse(response.rawEncoded);
                badgeData.studentsLoaded();

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
               //console.log(response)  ;
                for (var i = 0; i < badges.length; i++) {

                    badges[i].context = JSON.parse(badges[i].context);
                    badges[i].originalrequest = JSON.parse(badges[i].originalrequest);
                    //console.log(badges[i].originalrequest.badge);

                }
                if(badgeData.badgesById == null) badgeData.badgesById = {};
                if(badgeData.badgesById[id] == null) badgeData.badgesById[id] = {};
                for(var i=0;i<badges.length;i++)
                {
                    badgeData.badgesById[id][badges[i].originalrequest.badge.image] =  badges[i];
                }
                badgeData.badgeForUserUpdated();
            }

        });

}