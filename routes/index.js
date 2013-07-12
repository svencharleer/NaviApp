
/*
 * GET home page.
 */
var events = require('events');
var eventEmitter = new events.EventEmitter();
var stepupData = require('./stepupData.js');
var accountTypes = require('./accountTypes.js');


var badgeData = {
    badgeDefinitions: null,
    badgesById: null                                           ,
    update: function() {eventEmitter.emit('badgeDataLoaded');}
};
var res;
var renderIndexAfterDataLoad = function()
{
    if(badgeData.badgeDefinitions != null && badgeData.badgesById != null)
        res.render('index.html', { badges:badgeData.badgesById });
    //now i have to compare badges, show the correct badges. etc etc
}

exports.index = function(_req, _res){
    res = _res;
    //check if account types are filled in
    //todo
    var accountType = accountTypes.getAccount(_req.query.account);

    stepupData.getBadgesOfPerson(accountType + "_" + _req.query.user, badgeData);
    stepupData.getAllBadges(badgeData);

    eventEmitter.on('badgeDataLoaded', renderIndexAfterDataLoad);

};



