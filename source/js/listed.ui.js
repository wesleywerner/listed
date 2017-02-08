/**
 * Seperation of conerns for UI specific methods to attach to the Vue instance.
 */
(function(){
  
  var ui = {};
  
  ui.showHistoryDates = function (hist) {
    alert(hist.dates.join('\n'));
  }
  
  ui.promptRemoveHistory = function (hist) {
    if (confirm('Remove '+hist.text+'?')) {
      Listed.methods.removeAllHistory(hist.text);
    }
  }
  
  jQuery.extend(Listed.methods, ui);

}())
