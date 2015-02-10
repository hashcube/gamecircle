import util.setProperty as setProperty;

var onSyncUpdate;

function pluginSend(evt, params) {
	NATIVE.plugins.sendEvent("GameCirclePlugin", evt,JSON.stringify(params || {}));
}

function pluginOn(evt, next) {
	NATIVE.events.registerHandler(evt, next);
}

var Gamecircle = Class(function () {
	this.init = function(opts) {
		logger.log("{gamecircle} Registering for events on startup");

		setProperty(this, "onSyncUpdate", {
			set: function(f) {
				//logger.log("Am seting it");
				// If a callback is being set,
				if (typeof f === "function") {
					onSyncUpdate = f;
				} else {
					onSyncUpdate = null;
				}
			},
			get: function() {
				//logger.log("Am getting it");
				return onSyncUpdate;
			}
		});

		pluginOn("onSyncUpdate", function(evt) {
			logger.log("{gamecircle} Sync updating:", evt.result_sent);
			if (typeof onSyncUpdate === "function") {
					//logger.log(JSON.stringify(evt));
					onSyncUpdate(evt);
			}
		});
	}

	this.sendAchievement = function(achievementID, percentSolved) {
		logger.log("{gamecircle} Sending of achievement");

		var param = {"achievementID":achievementID,"percentSolved":percentSolved};

		pluginSend("sendAchievement",param);
	}

	this.sendScore = function(leaderBoardID, score) {
		logger.log("{gamecircle} Sending of Score to leaderboard");

		var param = {"leaderBoardID":leaderBoardID,"score":score};

		pluginSend("sendScore",param);
	}

	this.setNumber = function(name, val) {
		logger.log("{gamecircle} Sending of SyncNumber to sync");

		var param = {"name":name,"val":val};

		pluginSend("setNumber", param);
	}

	this.initSync = function(param_name) {
		logger.log("{gamecircle} Initializing Sync");

		pluginSend("initSync", param_name);
	}

	this.showLeaderBoard = function() {
		logger.log("{gamecircle} Showing Leaderboard");

		pluginSend("showLeaderBoard");
	}
});

exports = new Gamecircle();
