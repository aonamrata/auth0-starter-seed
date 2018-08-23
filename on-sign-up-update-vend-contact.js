
var mysql = require('mysql');
var raven = require('raven');

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
    raven.captureMessage('here!');
    // Perform any asynchronous actions, e.g. send notification to Slack.
    var connection = mysql.createConnection({
        host: 'db4free.net',
        user: 'npatel',
        password: 'KmU2NNy53wSJ^&?Zws',
        database: 'art_relations'
    });

    connection.connect(function (err) {
        if (err) {
            raven.captureException(err);
            return cb(err);
        }
    });

    try {
        var query = "UPDATE vend_contact" +
                " SET auth0_id = ?, " +
                " auth0_migrated_date = NOW() " +
                " WHERE id = ?";

        connection.query(query, [user.id, user.user_metadata.vend_contact_id], function (err) {
            if (err) {
                raven.captureException(err);
                return cb(err);
            }
        });

        // Migrate multiple users.
        if (parseInt(user.user_metadata.update_other_users) > 1) {
            query = "UPDATE vend_contact as vc" +
                    " INNER JOIN contact c ON c.contact_id = vc.contact_id" +
                    " SET vc.auth0_id = ?," +
                    " vc.auth0_migrated_date = NOW()" +
                    " WHERE c.contact_email = ?";

            connection.query(query, [user.id, user.email], function (err) {
                if (err) {
                    raven.captureException(err);
                    return cb(err);
                }
            });
        }

        connection.end();
        cb();

    } catch (err) {
        // Handle the error here.
        raven.captureException(err);
        cb();
    }
};
