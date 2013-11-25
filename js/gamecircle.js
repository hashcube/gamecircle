import util.setProperty as setProperty;

var onWhisperSyncUpdate;

function pluginSend(evt, params) {
	NATIVE && NATIVE.plugins && NATIVE.plugins.sendEvent &&
		NATIVE.plugins.sendEvent("GameCirclePlugin", evt,
				JSON.stringify(params || {}));
}

function pluginOn(evt, next) {
	NATIVE && NATIVE.events && NATIVE.events.registerHandler &&
		NATIVE.events.registerHandler(evt, next);
}

var Gamecircle = Class(function () {
	this.init = function(opts) {
		logger.log("{gamecircle} Registering for events on startup");

		setProperty(this, "onWhisperSyncUpdate", {
			set: function(f) {
				//logger.log("Am seting it");
				// If a callback is being set,
				if (typeof f === "function") {
					onWhisperSyncUpdate = f;
				} else {
					onWhisperSyncUpdate = null;
				}
			},
			get: function() {
				//logger.log("Am getting it");
				return onWhisperSyncUpdate;
			}
		});

		pluginOn("onWhisperSyncUpdate", function(evt) {
			logger.log("{gamecircle} WhisperSync updating:", evt.result_sent);
			if (typeof onWhisperSyncUpdate === "function") {
					//logger.log(JSON.stringify(evt));
					onWhisperSyncUpdate(evt);
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
		logger.log("{gamecircle} Sending of SyncNumber to whispersync");

		var param = {"name":name,"val":val};

		pluginSend("setNumber", param);
	}

	this.initWhisperSync = function(param_name) {
		logger.log("{gamecircle} Initializing WhisperSync");

		pluginSend("initWhisperSync", param_name);
	}

	this.showLeaderBoard = function() {
		logger.log("{gamecircle} Showing Leaderboard");

		pluginSend("showLeaderBoard");
	}
});

exports = new Gamecircle();