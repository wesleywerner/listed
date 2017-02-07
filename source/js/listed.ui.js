/**
 * Seperation of conerns for UI specific methods to attach to the Vue instance.
 */
(function(){
  
  var ui = {};
  
  ui.showHistoryDates = function (hist) {
    alert(JSON.stringify(hist.dates));
  }
  
  ui.promptRemoveHistory = function (hist) {
    if (confirm('Remove '+hist.text+'?')) {
      Listed.methods.removeAllHistory(hist.text);
    }
  }
  
  jQuery.extend(Listed.methods, ui);

}())
