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
   * The ui object gets merged into the Vue instance's methods property.
   */
  var ui = {};
  
  /**
   * The state object gets merged into the Vue instance's data property.
   */
  var state = {};
  
  // true while the page is loading
  state.loading = true;
  state.saveTimerId = null;
  
  // bring attention to the recommended icon
  state.hiliteRecommendations = true;
  
  /**
   * Called after the page has loaded the user data.
   */
  ui.dataLoaded = function () {
    Listed.methods.predictFrequencies();
    if (typeof Listed.methods.loadGraphs != 'undefined') {
      Listed.methods.loadGraphs();
    }
  }
  
  ui.showHistoryDates = function (hist) {
    alert(hist.dates.join('\n'));
  }
  
  ui.promptRemoveHistory = function (hist) {
    if (confirm('Remove '+hist.text+'?')) {
      Listed.methods.removeAllHistory(hist.text);
    }
  }
  
  ui.promptMerge = function (a, b) {
    if (Listed.methods.findHistoryAt(a) > -1 && Listed.methods.findHistoryAt(b) > -1) {
      if (confirm('Merge history of '+b+' into '+a)) {
        Listed.methods.mergeHistory(a, b);
        Materialize.toast(a+' and '+b+' merged', 5000);
      }
    }
  }
  
  ui.promptCleanList = function () {
    if (confirm('Clean checked items from your list?')) {
      Listed.methods.cleanList();
      Listed.methods.startSave();
    }
  }
  
  ui.promptRename = function (hist) {
    var newText = prompt('rename ' + hist.text, hist.text);
    if (newText != undefined) {
      var success = Listed.methods.rename(hist.text, newText);
      if (success) {
        Materialize.toast('Rename Success', 5000);
      } else {
        Materialize.toast('Rename failed. ' + newText + ' exists', 5000);
      }
    }
  }
  
  ui.setColor = function (color) {
    Listed.data.color = color;
    Listed.methods.startSave();
  }
  
  jQuery.extend(Listed.methods, ui);
  jQuery.extend(Listed.data, state);

}())

$( document ).ready(function(){

  // Initialize collapse button
  $(".button-collapse").sideNav( {
    draggable: true,
    closeOnClick: true
  });
  
  // Initialize collapsible containers
  $('.collapsible').collapsible();

})
