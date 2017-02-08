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

}())
