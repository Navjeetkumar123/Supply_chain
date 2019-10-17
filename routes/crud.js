module.exports = function(app) {
    multipart = require('connect-multiparty');
    multipartMiddleware = multipart();
    session = require('express-session');
    cookieParser = require('cookie-parser');
    fs = require('fs');
    path = require('path');
    request = require('request');
    http = require('http');
    async = require('async');
    assert = require('assert');
    MongoClient = require('mongodb').MongoClient;
    ObjectIdVar = require('mongodb').ObjectID;
    SHA256 = require("crypto-js/sha256");
    variables = require('../variables')
    Web3 = require('web3');
    solc = require('solc');
    'use strict';
    web3 = new Web3();
    EthIP           =   variables.host_rpc_ip;
    EthRPCPort      =   variables.host_rpc_port;
    if(EthIP == null || EthIP.length === 0) { EthIP = "0.0.0.0"; }
    if(EthRPCPort == null || EthRPCPort.length === 0) { EthRPCPort = "8080"; }
    web3.setProvider(new web3.providers.HttpProvider("http://"+EthIP+":"+EthRPCPort));
    
    var authenticate = function(req, res, next) {
        var isAuthenticated = true;
       
        if (typeof req.session.username == 'undefined') {
            isAuthenticated = false;
        }
        if (isAuthenticated) {
            //console.log("Authenticated " + req.session.username);
            next();
        } else {
            // redirect user to authentication page
            console.log("Authentication Failed, Sending to login");
            res.redirect('/login');
        }
    };

    app.get("/getUserName", function(req, res) {
        console.log('In crud::getUserName::::::');
        res.setHeader('Content-Type', 'application/json');
        res.json({
            username: req.session.username,
            name: req.session.name,
            type: req.session.type,
            uniquePartInUserName: req.session.unique_part
           
        });
    });

    function split(str) {
        var i = str.indexOf("@");
        if(i > 0)
            return  str.slice(0, i);
        else
            return "";     
    }

    app.post("/userLogin", multipartMiddleware, function(req, res, next) {
        console.log("userLogin");
        MongoClient.connect(variables.url, function(err, db) {
            console.log("connected to DB")
            if (err) throw err;
            //console.log(req.body.username)
            var collection = db.collection('myuser');
            collection.findOne({
                username: req.body.username
            }, function(err, result) {
                if (result != null) {
					 console.log('result');
                    if (result.password == req.body.pass) {
                        req.session.username = result.username;
                        req.session.type = result.type;
                        console.log("username = "+req.session.username);
                   
                        req.session.unique_part = split(req.session.username);
                        console.log("unique_part " + req.session.unique_part);
                      
                        console.log("userLogin " + result.type + ":" +result.username);
                        console.log("password  matched");
                           if (result.type == "seller1") {
							  var type =  "seller1";
							req.session.type.username = result.username;  
                            req.session.username = result.username;
                            req.session.name = result.name;
							
                          console.log(" Login type = "+req.session.type.username);
                            res.redirect('/supplier_index#/supplier');
                        } else if (result.type == "seller") {
                            req.session.username = result.username;
                            req.session.name = result.name;
                            res.redirect('/manufacturer_index#/manufacturer');
                        } else if (result.type == "logistics") {
                            req.session.username = result.username;
                            req.session.name = result.name;
                            res.redirect('/logistics_index#/logistics');
                        } else if (result.type == "distributor") {
                            req.session.username = result.username;
                            req.session.name = result.name;
                            res.redirect('/distributor_index#/distributor');
                        } else if (result.type == "buyer") {
                            req.session.username = result.username;
                            req.session.name = result.name;
                            res.redirect('/retailer_index#/retailer');
                        }
                        else if (result.type == "explorer") {
                            req.session.username = result.username;
                            req.session.name = result.name;
                            res.redirect('/explorer');
                        }
                    } else {
                        console.log("password do not match");
                        res.redirect('/login?valid=y');
                       
                    }
                } else {
                    console.log("username do not match");
                    res.redirect('/login?valid=y');
                    console.log(err);
                }
                db.close();
            });
        });
    });
 
 app.post("/explorerApi", multipartMiddleware, function(req, res, next) {
        console.log("/post: explorerApi");
        
        MongoClient.connect(variables.url, function(err, db) {
            console.log("connected to DB")
            if (err) throw err;
            var document = {
                totalTransaction: req.body.totalTransaction,
                pendingBlock: req.body.pendingBlock,
                timestamp: req.body.timestamp,
                
            };
            console.log(document);
            //insert record
            db.collection('explorer').insert(document, function(err, records) {
                if (records != null) {
                    console.log("entry successful.");
                    console.log(records);
                } else {
                    console.log("entry not successful.");
                  
                }
                db.close();
            });
        });
        res.sendStatus(200);
    });      
}