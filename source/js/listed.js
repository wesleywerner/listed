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

Listed.methods.findItem = function (text) {
  var idx = Listed.data.list.find( function(n) { 
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

Listed.methods.findHistoryAt = function (text) {
  var idx = Listed.data.history.findIndex( function(n) { 
    return n.text == text 
  });
  return idx;
}

Listed.methods.findHistory = function (text) {
  var idx = Listed.data.history.find( function(n) { 
    return n.text == text
  });
  return idx;
}

Listed.methods.addHistory = function (text, today) {
  var item = Listed.methods.findHistory(text);
  var today = today || new Date();
  if (item == null) {
    Listed.data.history.push({'text':text, dates:[today]});
  }
  else {
    var dateExists = item.dates.find( function(n) {
      return n.toString() == today.toString();
    });
    if (!dateExists) {
      item.dates.push(today);
    }
  }
}

Listed.methods.removeHistory = function (text) {
  var idx = Listed.methods.findHistoryAt(text);
  if (idx > -1) {
    Listed.data.history.splice(idx, 1);
  }
}

Listed.methods.amendHistory = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var existing = Listed.methods.findHistoryAt(amendment);
  if (existing > 1) return false;
  var idx = Listed.methods.findHistoryAt(text);
  if (idx > -1) {
    Listed.data.history[idx].text = amendment;
  }
}


// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
