//{"target":{"type":"user"},"locks":[{"path":"hasId","args":["$owner"]}]
module.exports = {
  "storage": {
    "dbName": "database_"
  },
  upfront_storage: {
    module_name: "agile-upfront-leveldb",
    type: "external",
    dbName: "./pap-database",
    collection: "policies",
  },
  "policies": {
    "create_entity_policy": [
      // actions of an actor are not restricted a priori
      {
        op: "write"
      },
      {
        op: "read"
      }
    ],
    "top_level_policy": {
      flows: [
        // all properties can be read by everyone
        {
          op: "read"
        },
        // all properties can only be changed by the owner of the entity
        {
          op: "write",
          locks: [{
            lock: "hasType",
            args: ["/user"]
          }, {
            lock: "isOwner"
          }]
        },
        {
          op: "write",
          locks: [{
            lock: "hasType",
            args: ["/user"]
          }, {
            lock: "attrEq",
            args: ["role", "admin"]
          }]
        }

      ],
      //specify what should happen if the policy does not comply
      actions: {
        "read": [{
          action: "delete"
        }]
      }
    },
    "attribute_level_policies": {
      "user": {
        "password": [
          // the property can only be read by the user itself
          {
            op: "read",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          }
          // the property can be set by the user itself and
          , {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          // by all users with role admin
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "attrEq",
              args: ["role", "admin"]
            }]
          }
        ],
        "role": [
          // can be read by everyone
          {
            op: "read"
          },
          // can only be changed by users with role admin
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "attrEq",
              args: ["role", "admin"]
            }]
          }
        ],
        "credentials": [
          // the property can only be read by the user itself
          {
            op: "read"
          },
          // the property can be set by the user itself and
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "attrEq",
              args: ["role", "admin"]
            }]
          }
        ],
        "credentials.dropbox": [{
            op: "read",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          // by all users with role admin
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "attrEq",
              args: ["role", "admin"]
            }]
          }
        ]
      },
      "sensor": {
        "credentials": [
          // the property can only be read by the user itself
          {
            op: "read"
          },
          // the property can be set by the user itself and
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          }
        ],
        "credentials.dropbox": [{
            op: "read",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "isOwner"
            }]
          },
          // by all users with role admin
          {
            op: "write",
            locks: [{
              lock: "hasType",
              args: ["/user"]
            }, {
              lock: "attrEq",
              args: ["role", "admin"]
            }]
          }
        ]
      }
    }
  },
  "schema-validation": [{
    "id": "/sensor",
    "additionalProperties": false,
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "credentials": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "dropbox": {
            "type": "string"
          }
        }
      }

    },
    "required": ["name"]
  }, {
    "id": "/user",
    "additionalProperties": false,
    "type": "object",
    "properties": {
      "user_name": {
        "type": "string"
      },
      "auth_type": {
        "type": "string"
      },
      "password": {
        "type": "string"
      },
      "role": {
        "type": "string"
      }
    },
    "required": ["user_name", "auth_type"]
  }, {
    "id": "/client",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "name": {
        "type": "string"
      },
      "clientSecret": {
        "type": "string"
      },
      "redirectURI": {
        "type": "string"
      }
    },
    "required": ["name", "redirectURI"]
  }],
  "configure_on_boot": {
    "user": {
      "username": "bob",
      "auth_type": "agile-local",
      "role": "admin",
      "password": "secret"
    },
    "client": {
      "id": "MyAgileClient2",
      "name": "MyAgileClient2",
      "secret": "Ultrasecretstuff",
      "uri": "http://localhost:3002/auth/example/callback"
    }
  }

};
