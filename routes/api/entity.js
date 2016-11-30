var cors = require('cors');
var passport = require('passport');
var express = require('express');
var clone = require('clone');
var bodyParser = require('body-parser');
var ids = require('../../lib/util/id');
var idmcore;

function RouterApi(idmcore, router) {

  //example to call tthis one
  // curl -H "Authorization: bearer nNGNryDDZ4zQYeWYGYcnOdxJ90k9s6" 'http://localhost:3000/api/v1/entity/user/bob!@!agile-local'
  //returns entity with 200 if OK, else, it can return 404 if the entity is not found, 401 or 403 in case of security errors or 500 in case of unexpected situations
  router.route('/entity/:entity_type/:entity_id').get(
    cors(),
    passport.authenticate('bearer', {
      session: false
    }),
    function (req, res) {
      var entity_type = "/" + req.params.entity_type;
      var entity_id = req.params.entity_id;
      if (entity_type === "/user") {
        res.statusCode = 422;
        res.json({
          "error": "to create users call the endpoint in /api/v1/user/"
        });
      } else {
        idmcore.readEntity(req.user, entity_id, entity_type)
          .then(function (read) {
            res.json(read);
          }).catch(function (error) {
            res.statusCode = error.statusCode;
            res.json({
              "error": error.message
            });
          });
      }
    }
  );
  //returns 200 and the entity, or 401 or 403, in case of security issues, 422 in case a user is attempted to be created through this API, or 409 if entity already exists, 500 in case of unexpected situations
  //curl -H "Content-type: application/json" -H "Authorization: bearer HeTxINCpXD0U6g27D7AIxc2CvfFNaZ" -X POST -d '{"name":"my BLE thingy"}' 'http://localhost:3000/api/v1/entity/sensor/1'
  router.route('/entity/:entity_type/:entity_id').post(
    cors(),
    passport.authenticate('bearer', {
      session: false
    }),
    bodyParser.json(),
    function (req, res) {
      var entity = req.body;
      var entity_type = "/" + req.params.entity_type;
      var entity_id = req.params.entity_id;
      if (entity_type === "/user") {
        res.statusCode = 422;
        res.json({
          "error": "to create users call the endpoint in /api/v1/users/"
        });
      } else {
        idmcore.createEntity(req.user, entity_id, entity_type, entity)
          .then(function (read) {
            res.json(read);
          }).catch(function (error) {
            console.log("error when posting entity " + error);
            res.statusCode = error.statusCode;
            res.json({
              "error": error.message
            });
          });
      }
    }
  );

  return router;
}
module.exports = RouterApi;