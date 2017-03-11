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
  
  // adding a new item to the list
  state.newItemText = '';
  
  /**
   * Called after the page has loaded the user data.
   */
  ui.dataLoaded = function () {
    Shopt.methods.predictFrequencies();
    if (typeof Shopt.methods.loadGraphs != 'undefined') {
      Shopt.methods.loadGraphs();
    }
  }
  
  ui.showHistoryDates = function (hist) {
    alert(hist.dates.join('\n'));
  }
  
  ui.showRecommendations = function () {
    Shopt.methods.predictFrequencies();
    $('#recommendedPopup').modal('open');
  }
  
  ui.promptRemoveHistory = function (hist) {
    if (confirm('Remove '+hist.text+'?')) {
      Shopt.methods.removeAllHistory(hist.text);
    }
  }
  
  ui.promptMerge = function (a, b) {
    if (Shopt.methods.findHistoryAt(a) > -1 && Shopt.methods.findHistoryAt(b) > -1) {
      if (confirm('Merge history of '+b+' into '+a)) {
        Shopt.methods.mergeHistory(a, b);
        Materialize.toast(a+' and '+b+' merged', 5000);
      }
    }
  }
  
  ui.cleanAndSave = function () {
    Shopt.methods.cleanList();
    Shopt.methods.startSave();
  }
  
  ui.promptRename = function (hist) {
    var newText = prompt('rename ' + hist.text, hist.text);
    if (newText != undefined) {
      var success = Shopt.methods.rename(hist.text, newText);
      if (success) {
        Materialize.toast('Rename Success', 5000);
      } else {
        Materialize.toast('Rename failed. ' + newText + ' exists', 5000);
      }
    }
  }
  
  ui.setColor = function (color) {
    Shopt.data.color = color;
    Shopt.methods.startSave();
  }
  
  ui.addItemAndClearInput = function () {
    if (Shopt.methods.addItem(Shopt.data.newItemText)) {
      Materialize.toast('Added ' + Shopt.data.newItemText, 1000);
      Shopt.data.newItemText = '';
    }
  }
  
  ui.addItemAndNotify = function (text) {
    if (Shopt.methods.addItem(text)) {
      Materialize.toast('Added ' + text, 1000);
    }
  }
  
  jQuery.extend(Shopt.methods, ui);
  jQuery.extend(Shopt.data, state);

}())

$( document ).ready(function(){

  // Initialize collapse button
  $(".button-collapse").sideNav( {
    draggable: true,
    closeOnClick: true
  });
  
  // Initialize collapsible containers
  $('.collapsible').collapsible();
  
  $('select').material_select();

})
