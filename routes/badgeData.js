
/*
 * GET home page.
 */
var events = require('events');
//var eventEmitter = new events.EventEmitter();
var stepupData = require('./stepupData.js');

var totalStudents = 0;
var totalStudentsLoaded = 0;

var badgeData = {
    emitter: null,
    emitterMessage: null,
    badgeDefinitions: null,
    badgesById: null,
    students: null,
    badgeDefinitionsUpdated: function() {
        totalStudentsLoaded = 0;
        stepupData.getAllStudents( this);

    },
    studentsLoaded: function() {
        totalStudents = this.students.length;
        for(var i = 0; i < totalStudents;i++)
        {
            stepupData.getBadgesOfPerson(this.students[i].username, this);
        }
    },
    badgeForUserUpdated: function() {
        totalStudentsLoaded++;
        if(totalStudents == totalStudentsLoaded)
            this.emitter.emit(this.emitterMessage);
    }
};

exports.badgeData = function(emitter, emitterMessage) {
    badgeData.emitter = emitter;
    badgeData.emitterMessage = emitterMessage;
    return badgeData;
};



