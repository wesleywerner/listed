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
        Shopt.methods.notify(a+' and '+b+' merged');
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
        Shopt.methods.notify('Rename Success');
      } else {
        Shopt.methods.notify('Rename failed. ' + newText + ' exists');
      }
    }
  }
  
  ui.setColor = function (color) {
    Shopt.data.color = color;
    Shopt.methods.startSave();
  }

  // set up auto complete for adding items to your list
  ui.refreshItemAutoComplete = function () {
    $('#add-item-input').autocomplete({
      data: Shopt.computed.keyedUnpickedHistory(),
      limit: 3,
      onAutocomplete: function(val) {
        Shopt.data.newItemText = val;
        Shopt.methods.addItemAndClearInput();
      },
      minLength: 1,
    });
  }

  ui.notify = function (text) {
    Materialize.toast(text, 4000);
  }
  
  ui.addItemAndClearInput = function () {
    if (Shopt.methods.addItem(Shopt.data.newItemText)) {
      Shopt.methods.notify('Added ' + Shopt.data.newItemText);
      Shopt.data.newItemText = '';
      Shopt.methods.refreshItemAutoComplete();
    }
  }

  ui.addItemByText = function (item) {
    if (Shopt.methods.addItem(item)) {
      Shopt.methods.notify('Added ' + item);
      Shopt.methods.refreshItemAutoComplete();
    }
  }

  ui.addTestData = function () {
    var text = prompt('name of item to generate');
    if (text == undefined) return;
    var avg = prompt('average purchase frequency in days');
    if (avg == undefined) return;
    var lastBought = prompt('how many days ago was the item last bought');
    if (lastBought == undefined) return;
    var lastDate = moment().subtract(parseInt(lastBought), 'days');
    for (var i=12; i>-1; i--) {
      Shopt.methods.addHistory(text, moment(lastDate).subtract(i*avg, 'days').format('YYYY-MM-DD'));
      // add variance
      if (Math.random() < 0.1) {
        Shopt.methods.addHistory(text, moment(lastDate).subtract(i*avg-1, 'days').format('YYYY-MM-DD'));
      }
    }
    Shopt.methods.predictFrequencies();
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
