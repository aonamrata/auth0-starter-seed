//var sha3_512 = require('js-sha3').sha3_512;
//var raven = require('raven');

function login(username, password, callback) {
  var TO_MIGRATE = ["juanp01"];

    var raven = require('raven');
    raven.config(configuration.sentry_dns).install();

    var arrayOfStrings = username.split('|');
    var orchard_username = arrayOfStrings[0];
    raven.setContext({user: {username: username}});

    if (arrayOfStrings.length === 3 && arrayOfStrings[1] === 'auth0') {
        var signon = {
            uri: configuration.ows_user + '/users/auth0/single-signon',
            //uri: 'https://qa-ows-users-proxy.theorchard.io/users/verify-login',
            method: 'POST',
            json: {
                auth0_id: arrayOfStrings[1] + '|' + arrayOfStrings[2],
                user_id: 'alw:' + orchard_username, // this is vcid
                email: password
            }
        };
        //raven.captureMessage(user_obj);
        // This is single sign on scenario
        request.post(signon, function (err, response, body) {
            if (response && response.statusCode === 404) {
                raven.captureMessage(body);
                return callback(new ValidationError('failed-single-signon', 'Failed to do single-signon'));
            }
            if (err) {
                raven.captureException(err);
                return callback(new ValidationError('failed-single-signon', 'Failed to do single-signon'));
            }
        });
    }




    // ---- GENERATE HASH
    const salt = "be5axu7u2ev5jeTuraprUsp4brap8us";
    const key = 'alw';
    const reHashCount = 97;
    var outputHash = password;

    for (var i = 0; i < reHashCount; i++) {
        const hash1 = crypto.createHash("sha512");
        hash1.update(outputHash + salt + key); // Hash the input
        outputHash = hash1.digest("hex").toString('hex');     // Return it as a hex string
    }

    // ---------- GENERATE ENDS

    var options = {
        uri: configuration.ows_user + '/users/verify-login',
        //uri: 'https://qa-ows-users-proxy.theorchard.io/users/verify-login',
        method: 'POST',
        json: {
            "login": username,
            "password": outputHash
        }
    };

    request.post(options, function (err, response, body) {
        if (response.statusCode === 404) {
            raven.captureMessage(password + ' !== ' + outputHash);
            return callback(new ValidationError('invalid-username', 'Invalid credentials or already migrated.'));
        }
        if (err) {
            raven.captureException(err);
            return callback(new ValidationError('db-error', 'db error'));
        }
        if (response.statusCode === 200 && body.vend_contact_id !== undefined) {
            // legacy login success
            var return_value = '';
            if (false && TO_MIGRATE.indexOf(username) < 0) {
                // don't migrate them
                return_value = outputHash + "|" + body.vend_contact_id;
                return callback(new ValidationError('dont-migrated', return_value));
            } else {
                // send them to migrate flow
                return_value = body.contact_email + "|" + body.vend_contact_id;
                return callback(new ValidationError('not-migrated', return_value));
            }
        } else {
            // this should never happen.
            raven.captureException(body);
            return callback(new ValidationError('some-error', 'some error'));

        }

    });
}

