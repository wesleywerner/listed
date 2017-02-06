// make available to cli unit tests
if (typeof require != 'undefined') {
  var moment = require('moment');
}

var Listed = { 'version': 1 };
Listed.data = {};
Listed.data.history = [];
Listed.data.list = [];

Listed.data.newItemText = 'new item';
Listed.data.saved = false;
Listed.data.color = '';

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
  if (text == null || text == '') return false;
  if (Listed.methods.findItemAt(text) == -1) {
    Listed.data.list.push({'text':text, 'checked': false});
    Listed.data.saved = false;
  }
}

Listed.methods.removeItem = function (text) {
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list.splice(idx, 1);
    Listed.data.saved = false;
  }
}

Listed.methods.amendItem = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list[idx].text = amendment;
    Listed.data.saved = false;
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

Listed.methods.addHistory = function (text, date) {
  // do not add empty items
  if (text == null || text == '') return false;
  // find existing item
  var item = Listed.methods.findHistory(text);
  // use the given moment, or use the current
  var historyDate = moment(date);
  if (!historyDate.isValid()) {
    historyDate = moment();
  }
  // add a new entry
  if (item == null) {
    Listed.data.history.push(new Listed.factory.History(text, historyDate.format('YYYY-MM-DD')));
  }
  // add to existing entry
  else {
    var dateExists = item.dates.indexOf(historyDate.format('YYYY-MM-DD')) > -1;
    if (!dateExists) {
      item.dates.push(historyDate.format('YYYY-MM-DD'));
    }
  }
  Listed.data.saved = false;
}

Listed.methods.removeHistory = function (text, date) {
  var item = Listed.methods.findHistory(text);
  if (item != null) {
    var idx = item.dates.indexOf(date);
    if (idx > -1) {
      item.dates.splice(idx, 1);
      Listed.data.saved = false;
    }
  }
}

Listed.methods.undoHistory = function (text, date) {
  date = moment(date);
  if (!date.isValid()) {
    date = moment();
  }
  var formattedDate = date.format('YYYY-MM-DD');
  var item = Listed.methods.findHistory(text);
  if (item != null) {
    var idx = item.dates.indexOf(formattedDate);
    if (idx == item.dates.length - 1) {
      item.dates.pop();
      Listed.data.saved = false;
    }
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
    Listed.data.saved = false;
  }
}

Listed.methods.mergeHistory = function (itemA, itemB) {
  var a = Listed.methods.findHistory(itemA);
  var b = Listed.methods.findHistory(itemB);
  if (a == null || b == null) return;
  b.dates.forEach( function(m) {
    var dateExists = a.dates.indexOf(m) > -1;
    if (!dateExists) {
      a.dates.push(m);
    }
  });
  var idx = Listed.methods.findHistoryAt(itemB);
  Listed.data.history.splice(idx, 1);
  Listed.data.saved = false;
}

Listed.methods.load = function () {
  if (typeof localforage != 'undefined') {
    localforage.getItem('data', function (err, value) {
      if (err) {
        alert(err);
      } else if (value) {
        value.list.forEach(function(n){ Listed.data.list.push(n) });
        value.history.forEach(function(n){ Listed.data.history.push(n) });
        Listed.data.color = value.color;
        Listed.data.saved = true;
      }
    });
  }
}

Listed.methods.save = function () {
  if (Listed.data.saved) return;
  if (typeof localforage != 'undefined') {
    localforage.setItem('data', Listed.data, function (err, value) {
      if (err) {
        alert(err);
      } else {
        // success notice
        Listed.data.saved = true;
      }
    });
  }
}

// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
