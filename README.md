Amazon Gamecircle Plugin for Gameclosure
=============
This is a Gameclosure (www.gameclosure.com) plugin for Amazon Game Circle.

Features
-------------
 * Leaderboard
 * Achievements
 * Wispersync (limited)
 * Support for in game button to show leaderboard

How to Install
-------------
clone this repo to '''addons''' folder inside devkit and do following
```
$ cd gamecircle
$ android update project -p android/GameCircleSDK/
```

### Modification and update
This project contains build.gradle files.
Please note that plugins library projects are not imported as project modules, instead they are imported as AAR (Android archive) which contain necessary source code and resources. You can see this in android/config.json of each library project plugin This requires to rebuild .aar file after plugin source code has been modified with proces: Import project into Android Studio -> Add changes -> Build -> Rebuild project. This will rebuild .aar file, the path to which is already in config.json.