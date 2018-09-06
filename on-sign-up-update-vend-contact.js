
var mysql = require('mysql');
var raven = require('raven');
var request = require('request');
/**
 @param {object} user - The user being created
 @param {string} user.id - user id
 @param {string} user.tenant - Auth0 tenant name
 @param {string} user.username - user name
 @param {string} user.email - email
 @param {boolean} user.emailVerified - is e-mail verified?
 @param {string} user.phoneNumber - phone number
 @param {boolean} user.phoneNumberVerified - is phone number verified?
 @param {object} user.user_metadata - user metadata
 @param {object} user.app_metadata - application metadata
 @param {object} context - Auth0 connection and other context info
 @param {string} context.requestLanguage - language of the client agent
 @param {object} context.connection - information about the Auth0 connection
 @param {object} context.connection.id - connection id
 @param {object} context.connection.name - connection name
 @param {object} context.connection.tenant - connection tenant
 @param {object} context.webtask - webtask context
 @param {function} cb - function (error, response)
 */
module.exports = function (user, context, cb) {
    raven.config('https://426d67d71e644358a3442aa456e63b80:8c7664f78d25485980e447571f724700@sentry.io/53873').install();
    raven.setContext({
        user: {
            username: user.email,
            user_metadata: user.user_metadata
        }
    });
    try {
        var options = {
            uri: 'http://2402cd1a.ngrok.io/users/auth0-update',
            method: 'POST',
            json: {
                "user_id": user.user_metadata.vend_contact_id,
                "user_type": "alw",
                "auth0_id": user.id
            }
        };
        console.log(options);
        request.post(options, function (err, response, body) {
            if (err) {
                raven.captureException(err);
                console.log('error:', err); // Print the error if one occurred
                return callback(new ValidationError('db-error', 'db error'));
            }

            console.log('body:', body);
            cb();
        });
    } catch (err) {
        // Handle the error here.
        raven.captureException(err);
        cb();
    }
};
