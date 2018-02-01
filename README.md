# Shopt

_The smart shopping list_

This is a shopping list type web app that remembers when you check items off your list. After an item has been checked a few times, on seperate days, the app can predict and recommend when you might next need to buy that item.

The prediction is very basic: it finds the average days between the checked dates, and recommends items since their last checked date.

All data is saved in the browser local storage. No data is sent into the cloud.

# Developing

You are expected to install the dependencies with `npm install` and `npm run build` before anything else. 

* `source/` contains the application code
* `www/` is the build target and created on build

## Testing

The test suite can run in either CLI or the browser, except for the tests that depend on a browser environment, localStorage for example, these will be skipped in the CLI environment.

Run `npm test` for the CLI, or open `test/browser.html` in your browser.

## Building

Run `npm run build` to clean and release everything into `www/`. The command `npm run watch` will monitor for changes and update the `www/` directory, giving you a speedier workflow during development.

Serve the files locally with the command `python -m SimpleHTTPServer` from inside the `/www` directory.

### Android Build

To make the Android build you will need to install cordova (https://cordova.apache.org/), including all it's requirements for the Android platform. 

Now add the android platform to the build:

  cordova platform add android

You can check if your build requirements are met:

  cordova requirements

If you have the Android studio emulator installed, you can build and emulate with:

  cordova run android

Finally to build and deploy on a connected device:

  cordova build
  adb install -r platforms/android/build/outputs/apk/android-debug.apk

Note for adb to detect your device you should ensure the PTP usb mode is selected on your phone, and `adb start-server` was run.

For debugging ease with the emulator, or a real device that has usb debugging enabled, use Google's Chrome browser and navigate to chrome://inspect/#devices to get an inspector.

### releasing

* Update version in shopt.logic.js
* Toggle the debug flag in shopt.logic.js
* git tag the version
* Build a signed APK

    cordova build android --release

# License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
