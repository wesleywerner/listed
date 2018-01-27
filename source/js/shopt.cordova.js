/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


/**
 * Seperation of conerns for UI specific methods to attach to the Vue instance.
 */
(function(){
  
  /**
   * The object gets merged into the Vue instance's methods property.
   */
  var methods = {};
  
  // device APIs are available
  methods.onDeviceReady = function () {
    navigator.app.overrideButton("menubutton", true);   // hack to fix broken cordova menubutton event
      //document.addEventListener("pause", onPause, false);
      //document.addEventListener("resume", onResume, false);
      document.addEventListener("menubutton", Shopt.methods.onMenuKeyDown, false);
      document.addEventListener("backbutton", Shopt.methods.onBackKeyDown, false);
  }

  methods.onMenuKeyDown = function () {
    $('.button-collapse').sideNav('show');
  }

  methods.onBackKeyDown = function() {
    // defer to the page action
    if (typeof(Shopt.methods.backButton) == 'function') {
      // this function returns true if it handled the back button.
      if (!Shopt.methods.backButton()) {
        navigator.app.exitApp();
      }
    }
    else {
      navigator.app.exitApp();
    }
  }

  jQuery.extend(Shopt.methods, methods);

  // hook into the device events when cordova is ready
  document.addEventListener("deviceready", Shopt.methods.onDeviceReady, false);

}())
