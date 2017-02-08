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
  
  // bring attention to the recommended icon
  state.hiliteRecommendations = true;
  
  /**
   * Called after the page has loaded the user data.
   */
  ui.dataLoaded = function () {
    Listed.methods.predictFrequencies();
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
  
  ui.setColor = function (color) {
    Listed.data.color = color + ' lighten-1';
    Listed.data.saved = false;
  }
  
  jQuery.extend(Listed.methods, ui);
  jQuery.extend(Listed.data, state);

}())
