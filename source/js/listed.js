var Listed = { 'version': 1 };
Listed.data = {};
Listed.data.history = [];
Listed.data.list = [];

Listed.data.newItemText = 'new item';

// method context is scoped via Vue so that 'this' references the Listed.data object
Listed.methods = {};


Listed.methods.findItemAt = function (text) {
  var idx = Listed.data.list.findIndex( function(n) { 
    return n.text == text 
  });
  return idx;
}

Listed.methods.addItem = function (text) {
  if (Listed.methods.findItemAt(text) == -1) {
    Listed.data.list.push({'text':text, 'checked': false});
  }
}

Listed.methods.removeItem = function (text) {
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list.splice(idx, 1);
  }
}

Listed.methods.amendItem = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list[idx].text = amendment;
  }
}

// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
