/* global App, EventBus, DatabaseService */
var NS_KEYS = "com.youcrypted.keys";
var NS = "com.youcrypted.users";
var CREATE_NS = NS + ".create";
var EDIT_NS = NS + ".edit";
var LIST_NS = NS + ".list";
var REMOVE_NS = NS + ".remove";
var COUNT_NS = NS + ".count";
var GET_NS = NS + ".get";

// the controller
App.publish("users", {
	args: {
		username: {
			not_null: true,
			type: "string",
			regex: "username"
		},
		privateKey: {
			not_null: true,
			type: "string",
			max_length: 100
		},
		publicKey: {
			not_null: true,
			type: "string",
			min_length: 32,
			max_length: 32
		},
		cn: {
			not_null: true,
			type: "string",
			max_length: 30
		},
		email: {
			not_null: true,
			type: "string",
			regex: "email"
		},
		start: {
			not_null: true,
			type: "integer",
			min_value: 0
		},
		limit: {
			not_null: true,
			type: "integer",
			min_value: 1
		}
	},
	create: {
		args: ["username", "privateKey", "publicKey", "cn", "email"],
		ebBridge: {
			ns: CREATE_NS,
			action: "send"
		}
	},
	edit: {
		authenticated: true,
		args: ["privateKey", "cn", "email"],
		ebBridge: {
			ns: EDIT_NS,
			action: "send"
		}
	},
	list: {
		authenticated: true,
		args: ["start", "limit"],
		ebBridge: {
			ns: LIST_NS,
			action: "send"
		}
	},
	remove: {
		authenticated: true,
		ebBridge: {
			ns: REMOVE_NS,
			action: "send"
		}
	},
	count: {
		authenticated: true,
		ebBridge: {
			ns: COUNT_NS,
			action: "send"
		}
	},
	get: {
		authenticated: true,
		args: ["username"],
		ebBridge: {
			ns: GET_NS,
			action: "send"
		}
	}
});

// -----------------------------------------------
// EVENTS REGISTRATION
// -----------------------------------------------

EventBus.register(CREATE_NS, {
	OnMessage: function (aMsg) {
		EventBus.send({
			ns: NS_KEYS + ".set_keys",
			username: aMsg.username,
			privateKey: aMsg.privateKey,
			publicKey: aMsg.publicKey
		}, {
			OnSuccess: function () {
				aMsg.reply({
					data: DatabaseService.createUser(aMsg.username, aMsg.cn, aMsg.email)
				});
			},
			OnFailure: function (aFailure) {
				aMsg.fail(aFailure);
			}
		});
	}
});

EventBus.register(EDIT_NS, {
	OnMessage: function (aMsg) {
		EventBus.send({
			ns: NS_KEYS + ".set_private_key",
			username: aMsg.connectorUsername,
			privateKey: aMsg.privateKey
		}, {
			OnSuccess: function () {
				aMsg.reply({
					data: DatabaseService.editUser(aMsg.connectorUsername, aMsg.cn, aMsg.email)
				});
			},
			OnFailure: function (aFailure) {
				aMsg.fail(aFailure);
			}
		});
	}
});

EventBus.register(REMOVE_NS, {
	OnMessage: function (aMsg) {
		EventBus.send({
			ns: NS_KEYS + ".remove_keys",
			username: aMsg.connectorUsername
		}, {
			OnSuccess: function () {
				aMsg.reply({
					data: DatabaseService.removeUser(aMsg.connectorUsername)
				});
			},
			OnFailure: function (aFailure) {
				aMsg.fail(aFailure);
			}
		});
	}
});

EventBus.register(LIST_NS, {
	OnMessage: function (aMsg) {
		aMsg.reply({
			data: DatabaseService.listUsers(aMsg.start, aMsg.limit)
		});
	}
});

EventBus.register(COUNT_NS, {
	OnMessage: function (aMsg) {
		aMsg.reply({
			data: DatabaseService.countUsers()
		});
	}
});

EventBus.register(GET_NS, {
	OnMessage: function (aMsg) {
		aMsg.reply({
			data: DatabaseService.getUser(aMsg.username)
		});
	}
});

