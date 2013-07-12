
/*
 * GET home page.
 */
var events = require('events');
var eventEmitter = new events.EventEmitter();
var stepupData = require('./stepupData.js');
var accountTypes = require('./accountTypes.js');

var GUID = require('./guid.js');

var badgeData = {
    badgeDefinitions: null,
    badgesById: null                                           ,
    badgeDefinitionsUpdated: function() {
        stepupData.getBadgesOfPerson(sessionUserId, badgeData);
    },
    badgeForUserUpdated: function() {
        eventEmitter.emit('badgeDataLoaded');
    }
};
var res, req;
var sessionUserId;

var displayBadge = function()
{
    name: null;
    guid: null;
    description: null;
    image: null;
    hasBadge: null;
}

var renderIndexAfterDataLoad = function()
{
    if(badgeData.badgeDefinitions != null && badgeData.badgesById[sessionUserId] != null)
    {
        var displayBadges = [];
        //can only by now check the badge data, as all is loaded now...
        for(var definitionKey in badgeData.badgeDefinitions) //var i=0;i<badgeData.badgeDefinitions.keys().length;i++)
        {
            var def = badgeData.badgeDefinitions[definitionKey];
            var badgeId = def.badge.image;
            var b = new displayBadge();
            if(badgeData.badgesById[sessionUserId][badgeId] == null)
            {
                b.hasBadge = false;
            }
            else
            {
                b.hasBadge = true;
            }


            b.name = def.badge.name;
            b.description =def.badge.description;
            b.image = def.badge.image;
            b.guid = GUID.generateGUID();
            displayBadges.push(b);

        }


        res.render('index.html', { badges:displayBadges});
    }
    //now i have to compare badges, show the correct badges. etc etc
}

exports.index = function(_req, _res){
    res = _res;
    req = _req;
    var accountType = accountTypes.getAccount(_req.query.account);
    sessionUserId = accountType + "_" + _req.query.user;
    //check if account types are filled in
    //todo
    stepupData.getAllBadges(badgeData);




    eventEmitter.on('badgeDataLoaded', renderIndexAfterDataLoad);

};



