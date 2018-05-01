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


// make available to cli unit tests
if (typeof require != 'undefined') {
  var moment = require('moment');
}

var Shopt = { 'version': 2 };
Shopt.factory = {};
Shopt.computed = {};
Shopt.data = {};
Shopt.data.debug = true;
Shopt.data.history = [];
Shopt.data.list = [];
Shopt.data.prediction = [];
Shopt.data.newItemText = 'new item';
Shopt.data.saved = true;
Shopt.data.color = 'red';

/**
 * Computed values.
 */
 
// bring attention to the recommended icon if the list is empty
Shopt.computed.hiliteRecommendations = function () {
  return (Shopt.data.list.length == 0 && Shopt.data.prediction.length > 0);
}

// list history items, in order, that are not in the main list
Shopt.computed.sortedUnpickedHistory = function () {
  var picks = Shopt.data.history.filter( function(h) {
    return Shopt.methods.findItemAt(h.text) == -1;
  }).map( function(h) {
    return h.text;
  }).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  return picks;
}

// keyed list of history items that are not in the main list.
// used for autocomplete lists.
Shopt.computed.keyedUnpickedHistory = function () {
  var result = { };
  var picks = Shopt.data.history.filter( function(h) {
    return Shopt.methods.findItemAt(h.text) == -1;
  });
  // the key is the text to auto complete, the value is an optional
  // icon url, or null.
  picks.forEach(function(h) {
    result[h.text] = null;
  });
  return result;
}

// list history items, in order, that are not in the main list
Shopt.computed.sortedHistory = function () {
  var picks = Shopt.data.history.map( function(h) {
    return h.text;
  }).sort();
  return picks;
}

/**
 * Factories.
 */
 
Shopt.factory.History = function (text, date) {
  return {
    'text': text,
    'dates': [date]
  }
}

Shopt.factory.Prediction = function (text, frequency, dueDate, dueDays) {
  return {
    'text': text,
    'frequency': frequency,
    'dueDays': dueDays,
    'dueDate': dueDate
  }
}

/**
 * Recommend predictions not already in the shopping list.
 */
Shopt.computed.recommendations = function () {
  return Shopt.data.prediction.filter( function(n) {
    return Shopt.methods.findItemAt(n.text) == -1;
  });
}

// method context is scoped via Vue so that 'this' references the Shopt.data object
Shopt.methods = {};

Shopt.methods.findItemAt = function (text) {
  var idx = Shopt.data.list.findIndex( function(n) { 
    return n.text.toLowerCase() == text.toLowerCase()
  });
  return idx;
}

Shopt.methods.findItem = function (text) {
  var idx = Shopt.data.list.find( function(n) { 
    return n.text.toLowerCase() == text.toLowerCase()
  });
  return idx;
}

Shopt.methods.addItem = function (text) {
  if (text == null || text == '') return false;
  if (Shopt.methods.findItemAt(text) == -1) {
    Shopt.data.list.splice(0, 0, {'text':text, 'checked': false});
    Shopt.methods.startSave();
    return true;
  }
  return false;
}

Shopt.methods.removeItem = function (text) {
  var idx = Shopt.methods.findItemAt(text);
  if (idx > -1) {
    var removed = Shopt.data.list.splice(idx, 1);
    Shopt.methods.startSave();
    if (removed.length == 1) return removed[0];
  }
  return null;
}

Shopt.methods.amendItem = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var idx = Shopt.methods.findItemAt(text);
  if (idx > -1) {
    Shopt.data.list[idx].text = amendment;
    Shopt.methods.startSave();
  }
}

Shopt.methods.cleanList = function () {
  Shopt.data.list = Shopt.data.list.filter( function(n) {
    return n.checked == false;
  })
}

Shopt.methods.findHistoryAt = function (text) {
  var idx = Shopt.data.history.findIndex( function(n) { 
    return n.text.toLowerCase() == text.toLowerCase()
  });
  return idx;
}

Shopt.methods.findHistory = function (text) {
  var idx = Shopt.data.history.find( function(n) { 
    return n.text.toLowerCase() == text.toLowerCase()
  });
  return idx;
}

Shopt.methods.addHistory = function (text, date) {
  // do not add empty items
  if (text == null || text == '') return false;
  // find existing item
  var item = Shopt.methods.findHistory(text);
  // use the given moment, or use the current
  var historyDate = moment(date);
  if (!historyDate.isValid()) {
    historyDate = moment();
  }
  // add a new entry
  if (item == null) {
    Shopt.data.history.push(new Shopt.factory.History(text, historyDate.format('YYYY-MM-DD')));
  }
  // add to existing entry
  else {
    var dateExists = item.dates.indexOf(historyDate.format('YYYY-MM-DD')) > -1;
    if (!dateExists) {
      item.dates.push(historyDate.format('YYYY-MM-DD'));
    }
  }
  // move the list item to the bottom
  var listIdx = Shopt.methods.findItemAt(text);
  if (listIdx) {
    var listItem = Shopt.data.list
  }
  Shopt.methods.startSave();
}

Shopt.methods.removeHistoryDate = function (text, date) {
  var item = Shopt.methods.findHistory(text);
  if (item != null) {
    var idx = item.dates.indexOf(date);
    if (idx > -1) {
      item.dates.splice(idx, 1);
      Shopt.methods.startSave();
    }
  }
}

Shopt.methods.removeAllHistory = function (text) {
  var idx = Shopt.methods.findHistoryAt(text);
  if (idx != -1) {
    Shopt.data.history.splice(idx, 1);
    Shopt.methods.startSave();
  }
}

Shopt.methods.undoHistory = function (text, date) {
  date = moment(date);
  if (!date.isValid()) {
    date = moment();
  }
  var formattedDate = date.format('YYYY-MM-DD');
  var item = Shopt.methods.findHistory(text);
  if (item != null) {
    var idx = item.dates.indexOf(formattedDate);
    if (idx == item.dates.length - 1) {
      item.dates.pop();
      Shopt.methods.startSave();
    }
  }
}

Shopt.methods.amendHistory = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var existing = Shopt.methods.findHistoryAt(amendment);
  if (existing > 1) return false;
  var idx = Shopt.methods.findHistoryAt(text);
  if (idx > -1) {
    Shopt.data.history[idx].text = amendment;
    Shopt.methods.startSave();
  }
}

Shopt.methods.mergeHistory = function (itemA, itemB) {
  var a = Shopt.methods.findHistory(itemA);
  var b = Shopt.methods.findHistory(itemB);
  if (a == null || b == null) return;
  b.dates.forEach( function(m) {
    var dateExists = a.dates.indexOf(m) > -1;
    if (!dateExists) {
      a.dates.push(m);
    }
  });
  // sort the result
  a.dates.sort();
  // remove item b from history
  var idx = Shopt.methods.findHistoryAt(itemB);
  Shopt.data.history.splice(idx, 1);
  Shopt.methods.startSave();
}

Shopt.methods.rename = function (oldText, newText) {
  // prevent renaming to any existing
  var existingItem = Shopt.methods.findItemAt(newText) > -1;
  var existingHist = Shopt.methods.findHistoryAt(newText) > -1;
  if (existingItem || existingHist) return false;
  // rename item
  var item = Shopt.methods.findItem(oldText);
  if (item != undefined) item.text = newText;
  // rename history
  var hist = Shopt.methods.findHistory(oldText);
  if (hist != undefined) hist.text = newText;
  Shopt.methods.startSave();
  return true;
}

Shopt.methods.load = function (done) {
  if (typeof localStorage != 'undefined') {
    var data = localStorage.getItem('data');
    if (data == null || data == undefined) {
      Shopt.data.saved = true;
      return;
    }
    var value = JSON.parse(data);
    value.list.forEach(function(n){ Shopt.data.list.push(n) });
    value.history.forEach(function(n){ Shopt.data.history.push(n) });
    Shopt.data.color = value.color;
    Shopt.data.saved = true;
    // success notice
    if (typeof done == 'function') done();
  }
}

Shopt.methods.save = function (done) {
  if (Shopt.data.saved) return;
  if (typeof localStorage != 'undefined') {
    localStorage.setItem('data', JSON.stringify(Shopt.data));
    Shopt.data.saved = true;
    // success notice
    if (typeof done == 'function') done();
  }
}

Shopt.methods.startSave = function () {
  if (typeof localStorage == 'undefined') return;
  // reset timer on new save requests
  if (Shopt.data.saveTimerId != null) {
    clearTimeout(Shopt.data.saveTimerId);
  }
  // signal changed state
  Shopt.data.saved = false;
  // ui notify on save
  //var notify = function() { Materialize.toast('saved', 1500); }
  var notify = null;
  // save timer
  Shopt.data.saveTimerId = setTimeout( function() {
    Shopt.methods.save( notify );
    Shopt.data.saveTimerId = null;
    }, 1000 );
}

Shopt.methods.findPredictionAt = function (text) {
  var idx = Shopt.data.prediction.findIndex( function(n) { 
    return n.text == text 
  });
  return idx;
}

Shopt.methods.findPrediction = function (text) {
  var idx = Shopt.data.prediction.find( function(n) { 
    return n.text == text
  });
  return idx;
}

Shopt.methods.predictFrequencies = function (compareDate) {
  var rightnow = moment().format('YYYY-MM-DD');
  var predictedItems = [];
  Shopt.data.history.forEach( function(hist) {
    // get the day diff between each pair of dates.
    var differences = [];
    var a = null;
    hist.dates.forEach( function(b) {
      b = moment(b);
      if (a != null) {
        var days = a.diff(b, 'days');
        differences.push(Math.abs(days));
      }
      a = b;
    });
    // find the average among all differences
    if (differences.length > 0) {
      var sum = differences.reduce(function(previousValue, currentValue){
          return currentValue + previousValue;
      });
      //var max = Math.max.apply(Math, differences);
      //var min = Math.min.apply(Math, differences);
      var avg = Math.ceil(sum / differences.length);
      // store the prediction
      if (avg > 0) {
        // comparisson base date
        var cmpDate = moment(compareDate);
        if (!cmpDate.isValid()) cmpDate = moment();
        // add avg frequency to the most recent history date
        var dueDate = moment(hist.dates.slice(-1)[0]);
        dueDate.add(avg, 'day');
        // get the days from due date to the comparisson date.
        // positive values indicate an approaching day,
        // negative values indicate days past due.
        var dueDays = dueDate.diff(cmpDate, 'days');
        // relative due date
        var relDate = dueDate.calendar(rightnow, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: '[this] dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'ddd, Do MMM'
        });
        // only consider items due in the future, and those recently past due.
        // ignore items way overdue.
        if (dueDays > -7) {
          predictedItems.push(new Shopt.factory.Prediction(hist.text, avg, relDate, dueDays));
        }
      }
    }
  });
  // Sort predictions
  Shopt.data.prediction = predictedItems.sort( function(a, b) { return a.dueDays > b.dueDays });
}


// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Shopt;
}
