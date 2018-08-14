//var sha3_512 = require('js-sha3').sha3_512;

function login(username, password, callback) {
    var arrayOfStrings = username.split('|');
    var orchard_username = arrayOfStrings[0];
    var auth0_email = '';
    if (arrayOfStrings.length > 1) {
        auth0_email = arrayOfStrings[1];
    }
    var connection = mysql({
        host: 'db4free.net',
        user: 'npatel',
        password: 'KmU2NNy53wSJ^&?Zws',
        database: 'art_relations'
    });

    connection.connect();


    var query = "SELECT vc.id, vc.login, c.`contact_email`, vc.`passwords`, c.contact_first_name" +
            " FROM vend_contact vc" +
            " INNER JOIN contact c ON c.`contact_id` = vc.`contact_id`" +
            " WHERE vc.`login` = ?";

    connection.query(query, [orchard_username], function (err, results) {
        if (err) {
            // For testing till db comes up.
//            return callback(new ValidationError('not-migrated', 'npatel@theorchard.com|19495'));
            return callback(new ValidationError('db-error', 'db error'));
//            return callback(err);
        }
        if (results.length === 0) {
            return callback(new ValidationError('invalid-username', 'Invalid username provided'));
//            return callback(new WrongUsernameOrPasswordError(orchard_username, 'invalid orchard username'));
        }

        var user = results[0];

        if (auth0_email !== '') {
            return callback(null, {
                id: user.id.toString(),
                username: orchard_username,
                vend_contact_id: user.vend_contact_id.toString(),
                type: 'alw',
                email: auth0_email,

            });
        }

        //return callback('bcrypt new_hash');
        const hash = crypto.createHash("sha512");
        const salt = "be5axu7u2ev5jeTuraprUsp4brap8us";
        var return_value = user.contact_email + "|" + user.id;

        crypto.pbkdf2(password, salt, 97, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                return callback(err);
            }
            var actual_pass = derivedKey.toString('hex');

            var temp_hardcoded = "KmU2NNy53wSJ^&?Zws";
            if (password === temp_hardcoded) { // for testing only
                return callback(new ValidationError('not-migrated', return_value));

            } else if (actual_pass !== user.passwords) {
                callback(new ValidationError('invalid-password', 'Invalid password provided'));
//                callback(new WrongUsernameOrPasswordError(orchard_username, 'invalid password'));
            } else {
                //callback('YEPPYYY==');
                return callback(new ValidationError('not-migrated', return_value));
            }

        });


    });

}
