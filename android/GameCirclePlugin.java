package com.tealeaf.plugin.plugins;

import com.amazon.ags.api.AmazonGames;
import com.amazon.ags.api.AmazonGamesClient;
import com.amazon.ags.api.overlay.PopUpLocation;
import com.amazon.ags.api.RequestResponse;
import com.amazon.ags.api.leaderboards.*;
import com.amazon.ags.api.achievements.*;
import com.amazon.ags.api.AmazonGamesFeature;
import com.amazon.ags.api.*;
import com.amazon.ags.api.whispersync.WhispersyncEventListener.*;
import com.amazon.ags.api.whispersync.model.*;
import com.amazon.ags.api.whispersync.*;

import com.tealeaf.plugin.IPlugin;
import com.tealeaf.logger;
import com.tealeaf.EventQueue;

import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.os.Bundle;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;
import java.util.Iterator;
import java.lang.Long;
import java.lang.Float;

public class GameCirclePlugin implements IPlugin {
	Context _context;
	Activity _activity;

	public class onSyncUpdate extends com.tealeaf.event.Event {
		String result_sent;

		public onSyncUpdate(String result) {
			super("onSyncUpdate");
			this.result_sent = result;
		}
	}

	//reference to the agsClient
	AmazonGamesClient agsClient;
	GameDataMap gameDataMap;

	AmazonGamesCallback callback = new AmazonGamesCallback() {
	        @Override
	        public void onServiceNotReady(AmazonGamesStatus status) {
	            //unable to use service
	        }
	        @Override
	        public void onServiceReady(AmazonGamesClient amazonGamesClient) {
	            agsClient = amazonGamesClient;
			    PopUpLocation location = PopUpLocation.TOP_CENTER;
				agsClient.setPopUpLocation(location);
	        }
	};
	 
	//list of features your game uses (in this example, achievements and leaderboards)
	EnumSet<AmazonGamesFeature> myGameFeatures = EnumSet.of(
	        AmazonGamesFeature.Achievements,
		AmazonGamesFeature.Leaderboards,
		AmazonGamesFeature.Whispersync);

	public GameCirclePlugin() {
	}

	public void onCreateApplication(Context applicationContext) {
		_context = applicationContext;
	}

	public void onCreate(Activity activity, Bundle savedInstanceState) {
		_activity = activity;
	}

	public void onResume() {
	    AmazonGamesClient.initialize(_activity, callback, myGameFeatures);
	}

	public void onRenderResume() {
	}

	public void onStart() {
	}

	public void onFirstRun() {
	}
	public void onPause() {
		if (agsClient != null) {
        	agsClient.release();
    	}
	}

	public void onRenderPause() {
	}

	public void onStop() {
	}

	public void onDestroy() {
	}

	public void initSync(final String param_name) {
		logger.log("{gamecircle-native} Initializing Sync");
		gameDataMap = AmazonGamesClient.getWhispersyncClient().getGameData();
		gameDataMap.getHighestNumber(param_name);
		AmazonGamesClient.getWhispersyncClient().setWhispersyncEventListener(new WhispersyncEventListener() {
		  public void onNewCloudData() {
			SyncableNumber initParamData = gameDataMap.getHighestNumber("max_ms_no");
		    EventQueue.pushEvent(new onSyncUpdate(initParamData.asString()));
		  }
		});		
	}

	public void setNumber(String param) {
		logger.log("{gamecircle-native} Setting SyncableNumber");
		final Bundle params = new Bundle();
	    String name = "";
	    Integer val = 0;
	    try {
			JSONObject ldrData = new JSONObject(param);
		    Iterator<?> keys = ldrData.keys();
		    while( keys.hasNext() ){
		        String key = (String)keys.next();
				Object o = ldrData.get(key);
				if(key.equals("name")){
					name = (String) o;
					continue;
				}
				if(key.equals("val")){
					val = (Integer) o;
					continue;
				}
				params.putString(key, (String) o);
	        }
		} catch(JSONException e) {
			logger.log("{gamecircle-native} Error in Params of setNumber because "+ e.getMessage());
		}
		gameDataMap = AmazonGamesClient.getWhispersyncClient().getGameData();
		SyncableNumber param_name = gameDataMap.getHighestNumber(name);
		param_name.set(val);
	}

	public void onNewIntent(Intent intent) {
	}

	public void setInstallReferrer(String referrer) {
	}

	public void onActivityResult(Integer request, Integer result, Intent data) {
	}

	public boolean consumeOnBackPressed() {
		return true;
	}

	public void onBackPressed() {
	}

	public void sendAchievement(String param)
	{
		logger.log("{gamecircle-native} Inside sendAchievement");
	    final Bundle params = new Bundle();
	    //logger.log(1);
	    String achievementID = "";
	    //logger.log(2);
	    Float percentSolved = 0F;
	    //logger.log(3);
	    try {
	    	JSONObject ldrData = new JSONObject(param);	
	    	//logger.log(4);
	        Iterator<?> keys = ldrData.keys();
	        //logger.log(5);
	        while( keys.hasNext() ){
	        	//logger.log(6);
	            String key = (String)keys.next();
	            //logger.log(7);
	    		Object o = ldrData.get(key);
	    		//logger.log(8);
	    		if(key.equals("achievementID")){
	    			//logger.log(9);
	    			achievementID = (String) o;
	    			continue;
	    		}
	    		if(key.equals("percentSolved")){
	    			//logger.log(10);
	    			percentSolved = new Float(o.toString());
	    			continue;
	    		}
	    		//logger.log(11);
	    		params.putString(key, (String) o);
	        }
		} catch(JSONException e) {
			logger.log("{gamecircle-native} Error in Params of sendAchievement because "+ e.getMessage());
		}
		//logger.log(12);
		AchievementsClient acClient = agsClient.getAchievementsClient();
		//logger.log(13);
		//logger.log(achievementID);
		//logger.log(percentSolved);
		//logger.log("============");
		AGResponseHandle<UpdateProgressResponse> handle = acClient.updateProgress(achievementID, percentSolved);
	}

	public void showLeaderBoard(String dummyParam)
	{
		logger.log("{gamecircle-native} Inside showLeaderBoard");
		LeaderboardsClient lbClient = agsClient.getLeaderboardsClient();
		lbClient.showLeaderboardsOverlay();
	}

	public void sendScore(String param)
	{
		logger.log("{gamecircle-native} Inside sendScore");
		LeaderboardsClient lbClient = agsClient.getLeaderboardsClient();
	    final Bundle params = new Bundle();
	    String leaderBoardID = "";
	    Long score = 0L;
	    try {
	    	JSONObject ldrData = new JSONObject(param);	
	        Iterator<?> keys = ldrData.keys();
	        while( keys.hasNext() ){
	            String key = (String)keys.next();
	    		Object o = ldrData.get(key);
	    		if(key.equals("leaderBoardID")){
	    			leaderBoardID = (String) o;
	    			continue;
	    		}
	    		if(key.equals("score")){
	    			score =  Long.parseLong(o.toString());
	    			continue;
	    		}
	    		params.putString(key, (String) o);
	        }
		} catch(JSONException e) {
			logger.log("{gamecircle-native} Error in Params of sendScore because "+ e.getMessage());
		}
		//logger.log("Sending score");
		//logger.log("=================");
		//logger.log(score);
		AGResponseHandle<SubmitScoreResponse> handle = lbClient.submitScore(leaderBoardID, score);
	}

	public void logError(String errorDesc) {
		logger.log("{gamecircle-native} logError "+ errorDesc);
	}
}
