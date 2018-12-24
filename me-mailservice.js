"use trict"
const request = require('request');
const mailConfig = require('../../config/mailservice');

var exports = module.exports = {};
exports.send = send;

function send(options) {
    if ( !options ) {
        throw new TypeError("Missing require arguments! ");
    }
    var service_url = mailConfig.email_service_url;
    var service_user = mailConfig.email_service_user;
    var service_password = mailConfig.email_service_password;
    var requestOptions = {
        url: service_url + '/auth/login',
        method: 'post',
        json: true,   // <--Very important!!!
        body: {'email': service_user, 'password': service_password}
    }; 
    request.post(requestOptions, function(error, response, body) {
        if ( !error && response.statusCode === 200 ) {
            if ( typeof body.token !== 'undefined' ) {
                options.token = body.token;
                // console.log('Options params=', options);
                var mailOptions = {
                    url: service_url + '/api/send-mail',
                    method: 'post',
                    json:true, 
                    body: options
                };
                request.post(mailOptions, function(error, response, body) {
                    if ( !error && response.statusCode === 200 ) { 
                        console.log('Email sent ', body);
                    } else {
                        console.log('Response status= %s; Message= %s', response.statusCode, response.statusMessage);
                        console.log('Body= ', body);
                    }
                });
            }
        }
    });
}