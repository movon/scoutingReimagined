var express = require('express');
var client = require('../connection.js');
var fs = require('fs');
var router = express.Router();


/* POST upload page. */
var handleUpload = function(req, res) {
    var body = req.body;
    console.log(body);
    var blueTeams = req.body.blueTeam.split(",");
    var redTeams = req.body.redTeam.split(",");
    var gameid = req.body.gameid;
    var matchType = req.body.matchType;
    var comments = req.body.comments;
    client.index({
        index: 'games',
        id: gameid,
        type: matchType,
        body: {
            "blueTeams": blueTeams,
            "redTeams": redTeams,
            "comments": comments,
            "gameId": gameid
        }
    }, function(err, resp, status) {
        console.log(resp);
        if (err) {
            console.log(err);
            res.sendStatus(500); // Internal server error
        } else {
            /// .   .   .   Insert into ES and get gameid
            console.log(req);
            res.render('upload', {success: 1, firstTime: 0});
        }
    });

};


/* GET upload page. */
router.get('/', function(req, res, next) {
    client.search({
        index: 'games',
        type: 'game',
        body: {
            aggs : {
                max_gameid : {
                    max : {
                        field : "gameId"
                    }
                }
            }
        }
    },function (error, response,status) {
        if (error){
            console.log("search error: " + error);
            res.sendStatus(500);
        }
        else {
            res.render('upload', {success: 0, firstTime: 1, gameId: response.aggregations.max_gameid.value + 1});
        }
    });
});

module.exports = {router: router, handleUpload: handleUpload};