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

function invokeCallbacks(list, clear) {
	// Pop off the first two arguments and keep the rest
	var args = Array.prototype.slice.call(arguments);
	args.shift();
	args.shift();

	// For each callback,
	for (var ii = 0; ii < list.length; ++ii) {
		var next = list[ii];

		// If callback was actually specified,
		if (next) {
			// Run it
			next.apply(null, args);
		}
	}

	// If asked to clear the list too,
	if (clear) {
		list.length = 0;
	}
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
			logger.log("{gamecircle} WhisperSync updating:", evt.max_ms_no);
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

	this.setmax_ms_no = function(max_ms_no_val) {
		logger.log("{gamecircle} Sending of Max_MS to whispersync");

		pluginSend("setmax_ms_no",max_ms_no_val);
	}

	this.initWhisperSync = function() {
		logger.log("{gamecircle} Initializing WhisperSync");

		pluginSend("initWhisperSync");
	}

	this.showLeaderBoard = function() {
		logger.log("{gamecircle} Showing Leaderboard");

		pluginSend("showLeaderBoard");
	}
});

exports = new Gamecircle();