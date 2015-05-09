/* global App, MongoDBUtils, EventBus */

App.importScript('${EXT}/MongoDBUtils');
DatabaseService = (function () {
	var mUsers = App.getAppBean(App.getStorage().get('database').users);

	// create/ensure username-email field index
	mUsers.createIndex(MongoDBUtils.toDBObject({
		username: 1,
		email: 1
	}), MongoDBUtils.toDBObject({
		unique: true
	}));

	return {
		userExists: function (aUsername) {
			return null != this.getUser(aUsername);
		},
		createUser: function (aUsername, aCN, aEmail) {
			mUsers.save(MongoDBUtils.toDBObject({
				username: aUsername,
				cn: aCN,
				email: aEmail,
				createdAt: new Date().getTime(),
				editedAt: new Date().getTime()
			}));
		},
		editUser: function (aUsername, aCN, aEmail) {
			mUsers.update(MongoDBUtils.toDBObject({
				username: aUsername
			}), MongoDBUtils.toDBObject({
				'$set': MongoDBUtils.toDBObject({
					cn: aCN,
					email: aEmail,
					editedAt: new Date().getTime()
				})
			}));
		},
		removeUser: function (aUsername) {
			mUsers.remove(MongoDBUtils.toDBObject({
				username: aUsername
			}));
		},
		listUsers: function (aStart, aLimit) {
			var lCursor = mUsers.find(MongoDBUtils.toDBObject({}), MongoDBUtils.toDBObject({
				username: 1,
				cn: 1,
				createdAt: 1
			})).skip(aStart).limit(aLimit).sort(MongoDBUtils.toDBObject({
				created_at: 1
			}));

			return MongoDBUtils.toArray(lCursor);
		},
		countUsers: function () {
			return mUsers.count();
		},
		getUser: function (aUsername) {
			return mUsers.findOne(MongoDBUtils.toDBObject({username: aUsername}), MongoDBUtils.toDBObject({
				username: 1,
				cn: 1,
				createdAt: 1
			}));
		}
	};
})();