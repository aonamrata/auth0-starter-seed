//var sha3_512 = require('js-sha3').sha3_512;

function login(username, password, callback) {
    var arrayOfStrings = username.split('|');
    var orchard_username = arrayOfStrings[0];
    var raven = require('raven');
    raven.config('https://426d67d71e644358a3442aa456e63b80@sentry.io/53873').install();
    raven.setContext({user: {username: username}});

    var connection = mysql({
        host: 'db4free.net',
        user: 'npatel',
        password: 'KmU2NNy53wSJ^&?Zws',
        database: 'art_relations'
    });


    connection.connect(function (err) {
        if (err) {
            raven.captureException(err);
            return callback(err);
        }
    });
    console.log('connected');

    var query = "SELECT vc.id, vc.login, c.`contact_email`, vc.`passwords`, c.contact_first_name" +
            " FROM vend_contact vc" +
            " INNER JOIN contact c ON c.`contact_id` = vc.`contact_id`" +
            " WHERE vc.`login` = ? AND vc.auth0_id IS NULL AND vc.active='Y' ";

    connection.query(query, [orchard_username], function (err, results) {
        if (err) {
            raven.captureException(err);
            return callback(new ValidationError('db-error', 'db error'));
        }
        if (results.length === 0) {
            return callback(new ValidationError('invalid-username', 'Invalid username provided or already migrated.'));
        }
        var user = results[0];
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

        var return_value = user.contact_email + "|" + user.id;
        if (outputHash !== user.passwords) {
            callback(new ValidationError('invalid-password', 'Invalid password provided'));
//                callback(new WrongUsernameOrPasswordError(orchard_username, 'invalid password'));
        } else {
            return callback(new ValidationError('not-migrated', return_value));
        }
    });
}

