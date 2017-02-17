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

var Listed = { 'version': 1 };
Listed.factory = {};
Listed.computed = {};
Listed.data = {};
Listed.data.history = [];
Listed.data.list = [];
Listed.data.prediction = [];
Listed.data.newItemText = 'new item';
Listed.data.saved = true;
Listed.data.color = 'red';

/**
 * Computed values.
 */
 
// bring attention to the recommended icon if the list is empty
Listed.computed.hiliteRecommendations = function () {
  return (Listed.data.list.length == 0);
}

/**
 * Factories.
 */
 
Listed.factory.History = function (text, date) {
  return {
    'text': text,
    'dates': [date]
  }
}

Listed.factory.Prediction = function (text, frequency, dueDate, dueDays) {
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
Listed.computed.recommendations = function () {
  return Listed.data.prediction.filter( function(n) {
    return Listed.methods.findItemAt(n.text) == -1;
  });
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
    Listed.methods.startSave();
  }
}

Listed.methods.removeItem = function (text) {
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list.splice(idx, 1);
    Listed.methods.startSave();
  }
}

Listed.methods.amendItem = function (text, amendment) {
  amendment = amendment || '';
  if (amendment.trim() == '') return;
  var idx = Listed.methods.findItemAt(text);
  if (idx > -1) {
    Listed.data.list[idx].text = amendment;
    Listed.methods.startSave();
  }
}

Listed.methods.cleanList = function () {
  Listed.data.list = Listed.data.list.filter( function(n) {
    return n.checked == false;
  })
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
  Listed.methods.startSave();
}

Listed.methods.removeHistoryDate = function (text, date) {
  var item = Listed.methods.findHistory(text);
  if (item != null) {
    var idx = item.dates.indexOf(date);
    if (idx > -1) {
      item.dates.splice(idx, 1);
      Listed.methods.startSave();
    }
  }
}

Listed.methods.removeAllHistory = function (text) {
  var idx = Listed.methods.findHistoryAt(text);
  if (idx != -1) {
    Listed.data.history.splice(idx, 1);
    Listed.methods.startSave();
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
      Listed.methods.startSave();
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
    Listed.methods.startSave();
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
  Listed.methods.startSave();
}

Listed.methods.rename = function (oldText, newText) {
  // prevent renaming to any existing
  var existingItem = Listed.methods.findItemAt(newText) > -1;
  var existingHist = Listed.methods.findHistoryAt(newText) > -1;
  if (existingItem || existingHist) return false;
  // rename item
  var item = Listed.methods.findItem(oldText);
  if (item != undefined) item.text = newText;
  // rename history
  var hist = Listed.methods.findHistory(oldText);
  if (hist != undefined) hist.text = newText;
  Listed.methods.startSave();
  return true;
}

Listed.methods.load = function (done) {
  if (typeof localStorage != 'undefined') {
    var data = localStorage.getItem('data');
    if (data == null || data == undefined) {
      Listed.data.saved = true;
      return;
    }
    var value = JSON.parse(data);
    value.list.forEach(function(n){ Listed.data.list.push(n) });
    value.history.forEach(function(n){ Listed.data.history.push(n) });
    Listed.data.color = value.color;
    Listed.data.saved = true;
    // success notice
    if (typeof done == 'function') done();
  }
}

Listed.methods.save = function (done) {
  if (Listed.data.saved) return;
  if (typeof localStorage != 'undefined') {
    localStorage.setItem('data', JSON.stringify(Listed.data));
    Listed.data.saved = true;
    // success notice
    if (typeof done == 'function') done();
  }
}

Listed.methods.startSave = function () {
  if (typeof localStorage == 'undefined') return;
  // reset timer on new save requests
  if (Listed.data.saveTimerId != null) {
    clearTimeout(Listed.data.saveTimerId);
  }
  // signal changed state
  Listed.data.saved = false;
  // ui notify on save
  var notify = function() { Materialize.toast('saved', 1500); }
  // save timer
  Listed.data.saveTimerId = setTimeout( function() {
    Listed.methods.save( notify );
    Listed.data.saveTimerId = null;
    }, 2000 );
}

Listed.methods.findPredictionAt = function (text) {
  var idx = Listed.data.prediction.findIndex( function(n) { 
    return n.text == text 
  });
  return idx;
}

Listed.methods.findPrediction = function (text) {
  var idx = Listed.data.prediction.find( function(n) { 
    return n.text == text
  });
  return idx;
}

Listed.methods.predictFrequencies = function (compareDate) {
  var rightnow = moment().format('YYYY-MM-DD');
  var predictedItems = [];
  Listed.data.history.forEach( function(hist) {
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
        // get the days from due date to the comparisson date
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
        predictedItems.push(new Listed.factory.Prediction(hist.text, avg, relDate, dueDays));
      }
    }
  });
  // Sort predictions
  Listed.data.prediction = predictedItems.sort( function(a, b) { return a.dueDays > b.dueDays });
}


// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
