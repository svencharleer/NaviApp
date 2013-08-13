
/*
 * GET home page.
 */
var events = require('events');
var eventEmitter = new events.EventEmitter();
var stepupData = require('./stepupData.js');
var accountTypes = require('./accountTypes.js');
var badgeDataSystem = require('./badgeData.js');
var GUID = require('./guid.js');

var badgeDataForGraph = null;
var res, req;
var sessionUserId;


var graphBadgeData = function()
{
    this.id = null;
    this.dateAndTotal = [];
}

var renderGraphAfterDataLoad = function()
{

        var graphData = {};
        //can only by now check the badge data, as all is loaded now...
        for(var definitionKey in badgeDataForGraph.badgeDefinitions)
        {
            var def = badgeDataForGraph.badgeDefinitions[definitionKey];
            var badgeId = def.badge.image;
            var b = new graphBadgeData();
            b.id = badgeId;
            for(var user in badgeDataForGraph.badgesById)
            {
                var userBadge = badgeDataForGraph.badgesById[user][badgeId];
                if(userBadge != null)
                {
                    var date = new Date(userBadge.timestamp);
                    date.setHours(0,0,0,0);
                    if(b.dateAndTotal[date] != null)
                         b.dateAndTotal[date]++;
                    else
                        b.dateAndTotal[date] = 1;

                }
            }
            b.dateAndTotal.sort(function(a,b){
                a = new Date(a);
                b = new Date(b);
                return a>b?-1:a<b?1:0;
            });
            graphData[definitionKey]= b;

        }
        //figure out per date what the values are
        var now = new Date();
        var ago = new Date();
        ago.setDate(now.getDate() - 70);
        ago.setHours(0,0,0,0);
        var datadata = {};
        while(ago < now)
        {
            for(var bkey in graphData)
            {
                if(datadata[bkey] == null) datadata[bkey] = {};
                datadata[bkey][ago] = graphData[bkey].dateAndTotal[ago] == null ? 0 :  graphData[bkey].dateAndTotal[ago];
            }
            ago.setDate(ago.getDate() +1);
        }

        res.render('graph.html', { graphData:datadata});

    //now i have to compare badges, show the correct badges. etc etc
}

exports.graph = function(_req, _res){
    res = _res;
    req = _req;
    var accountType = accountTypes.getAccount(_req.query.account);
    sessionUserId = accountType + "_" + _req.query.user;

    badgeDataForGraph = badgeDataSystem.badgeData(eventEmitter, "badgeDataForGraphLoaded");
    //check if account types are filled in
    //todo
    stepupData.getAllBadges(badgeDataForGraph);




    eventEmitter.on('badgeDataForGraphLoaded', renderGraphAfterDataLoad);

};



