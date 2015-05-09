/* global App */

App.setDescription("User's directory service for TESN");

App.importScript('${APP_HOME}/config');
App.on('appLoaded', function (aHotLoad) {
	if (!aHotLoad) {
		App.loadToAppBeanFactory('${APP_HOME}/beans.xml');
	}

	// loading services
	App.importScript('${APP_HOME}/service/database');

	// loading controllers
	App.importScript('${APP_HOME}/controller/users');
});
