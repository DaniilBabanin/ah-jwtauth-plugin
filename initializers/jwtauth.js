var jsonwebtoken = require('jsonwebtoken');
module.exports = {
    loadPriority: 1000,
    startPriority: 1000,
    stopPriority: 1000,

    start: function(api, next) {
        api.jwtauth = {
            processToken: function(token, success, fail) {

                jsonwebtoken.verify(token, api.config.jwtauth.secret, {}, function(err, data) {
                    err ? fail(err) : success(data);
                });

            },
            generateToken: function(data, options, success, fail) {

                // identify parameter format
                if (typeof(options) == 'function') {
                    fail = success;
                    success = options;
                    options = {};
                }
                else {
                    options = options ||  {};
                }
                if (!options.algorithm) {
                    options.algorithm = api.config.jwtauth.algorithm;
                }

                try {
                    var token = jsonwebtoken.sign(data, api.config.jwtauth.secret, options);
                    if (success) {
                        success(token);
                    }
                }
                catch (err) {
                    if (fail) {
                        fail(err);
                    }
                }
            }
        };
        next();
    },
    stop: function(api, next) {
        next();
    }
}
