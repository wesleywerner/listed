// make available to cli unit tests
if (typeof require != 'undefined') {
  var moment = require('moment');
}

var Listed = { 'version': 1 };
Listed.data = {};
Listed.data.history = [];
Listed.data.list = [];

Listed.data.newItemText = 'new item';

Listed.factory = {};

Listed.factory.History = function (text, date) {
  return {
    'text': text,
    'dates': [date]
  }
}

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
  today = today || moment();
  // remove the time part
  today = today.startOf('day');
  if (item == null) {
    Listed.data.history.push(new Listed.factory.History(text, today));
  }
  else {
    var dateExists = item.dates.find( function(n) {
      return moment(n).isSame(moment(today));
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

Listed.methods.mergeHistory = function (itemA, itemB) {
  var a = Listed.methods.findHistory(itemA);
  var b = Listed.methods.findHistory(itemB);
  if (a == null || b == null) return;
  b.dates.forEach( function(m) {
    var dateExists = a.dates.find( function(findItem) { 
      return findItem.isSame(m) 
    });
    if (!dateExists) {
      a.dates.push(m);
    }
  });
  var idx = Listed.methods.findHistoryAt(itemB);
  Listed.data.history.splice(idx, 1);
}


// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
