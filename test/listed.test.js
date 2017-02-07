// make available to cli unit tests
if (typeof require != 'undefined') {
  var assert = require('chai').assert;
  var expect = require('chai').expect;
  var moment = require('moment');
  var Listed = require('../source/js/listed.js');
}

describe('Listed Test Suite', function() {

  describe('list management methods', function() {
    
    beforeEach(function() {
      Listed.data.list = [];
    });
    
    it('should find item index', function() {
      Listed.data.list = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var idx = Listed.methods.findItemAt('item AB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find item data', function() {
      Listed.data.list = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var item = Listed.methods.findItem('item AB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item AB'});
    });
    
    it('should add a new item', function() {
      Listed.methods.addItem('item AD');
      expect(Listed.data.list).to.have.lengthOf(1);
      var idx = Listed.methods.findItemAt('item AD');
      expect(idx).to.equal(0);
    });

    it('should not add a blank item', function() {
      Listed.methods.addItem('');
      Listed.methods.addItem(null);
      expect(Listed.data.list).to.have.lengthOf(0);
    });
    
    it('should not add a duplicate item', function() {
      Listed.methods.addItem('item AE');
      Listed.methods.addItem('item AE');
      expect(Listed.data.list).to.have.lengthOf(1);
    });
    
    it('should remove an item', function() {
      Listed.methods.addItem('item AF');
      Listed.methods.addItem('item AG');
      Listed.methods.addItem('item AH');
      Listed.methods.removeItem('item AG');
      // test length
      expect(Listed.data.list).to.have.lengthOf(2);
      // test correct item got removed
      var idx = Listed.methods.findItemAt('item AG');
      expect(idx).to.equal(-1);
    });

    it('should amend an item', function() {
      Listed.methods.addItem('item AI');
      Listed.methods.addItem('item AJ');
      Listed.methods.addItem('item AK');
      Listed.methods.amendItem('item AJ', 'item Amended');
      var idx = Listed.methods.findItemAt('item Amended');
      expect(idx).to.equal(1);
    });

    it('should not amend to empty item', function() {
      Listed.methods.addItem('item AI');
      Listed.methods.addItem('item AJ');
      Listed.methods.addItem('item AK');
      Listed.methods.amendItem('item AJ', null);
      Listed.methods.amendItem('item AJ', undefined);
      Listed.methods.amendItem('item AJ', '');
      Listed.methods.amendItem('item AJ', ' ');
      var idx = Listed.methods.findItemAt('item AJ');
      expect(idx).to.equal(1);
    });

  });

  describe('history management methods', function() {
    
    beforeEach(function() {
      Listed.data.history = [];
    });
    
    it('should find history index', function() {
      Listed.data.history = [{'text':'item BA'},{'text':'item BB'},{'text':'item BC'}];
      var idx = Listed.methods.findHistoryAt('item BB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find history data', function() {
      Listed.data.history = [{'text':'item BA'},{'text':'item BB'},{'text':'item BC'}];
      var item = Listed.methods.findHistory('item BB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item BB'});
    });
    
    it('should add history', function() {
      Listed.methods.addHistory('item BD');
      expect(Listed.data.history).to.have.lengthOf(1);
      var idx = Listed.methods.findHistoryAt('item BD');
      expect(idx).to.equal(0);
    });

    it('should not add blank history', function() {
      Listed.methods.addHistory(null);
      Listed.methods.addHistory('');
      expect(Listed.data.history).to.have.lengthOf(0);
    });

    it('should not add duplicate histories', function() {
      Listed.methods.addHistory('item BE');
      Listed.methods.addHistory('item BE');
      expect(Listed.data.history).to.have.lengthOf(1);
    });

    it('should amend history', function() {
      Listed.methods.addHistory('item BF');
      Listed.methods.addHistory('item BG');
      Listed.methods.addHistory('item BH');
      Listed.methods.amendHistory('item BG', 'item Amended');
      var idx = Listed.methods.findHistoryAt('item Amended');
      expect(idx).to.equal(1);
    });
    
    it('should not amend history to existing', function() {
      Listed.methods.addHistory('item BI');
      Listed.methods.addHistory('item BJ');
      Listed.methods.addHistory('item BK');
      Listed.methods.amendHistory('item BJ', 'item BK');
      var idx = Listed.methods.findHistoryAt('item BJ');
      expect(idx).to.equal(1);
    });

    it('should merge two histories', function() {
      Listed.methods.addHistory('item BL', moment('2017-02-01'));
      Listed.methods.addHistory('item BL', moment('2017-02-02'));
      Listed.methods.addHistory('item BM', moment('2017-02-02'));
      Listed.methods.addHistory('item BM', moment('2017-02-03'));
      Listed.methods.addHistory('item BM', moment('2017-02-04'));
      expect(Listed.data.history).to.have.lengthOf(2);
      Listed.methods.mergeHistory('item BL', 'item BM');
      expect(Listed.data.history).to.have.lengthOf(1);
      var item = Listed.methods.findHistory('item BL');
      expect(item).to.not.be.null;
      expect(item.dates).to.have.lengthOf(4);
    });

    it('should not append same history date', function() {
      Listed.methods.addHistory('item DC', '2017-02-04 12:00');
      Listed.methods.addHistory('item DC', '2017-02-04');
      var item = Listed.methods.findHistory('item DC');
      expect(item.dates).to.have.lengthOf(1);
      expect(item.dates[0]).to.equal('2017-02-04');
    });
    
    it('should remove a specific history date', function() {
      Listed.methods.addHistory('item EA', '2017-02-04');
      Listed.methods.addHistory('item EA', '2017-02-05');
      Listed.methods.addHistory('item EA', '2017-02-06');
      Listed.methods.removeHistory('item EA', '2017-02-05');
      var item = Listed.methods.findHistory('item EA');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-06']);
    });
    
    it('should undo the latest history date', function() {
      Listed.methods.addHistory('item EB', '2017-02-04');
      Listed.methods.addHistory('item EB', '2017-02-05');
      Listed.methods.addHistory('item EB', '2017-02-06');
      Listed.methods.undoHistory('item EB', '2017-02-06');
      var item = Listed.methods.findHistory('item EB');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-05']);
    });
    
    it('should undo history today', function() {
      Listed.methods.addHistory('item EC');
      Listed.methods.undoHistory('item EC');
      var item = Listed.methods.findHistory('item EC');
      expect(item.dates).to.deep.equal([]);
    });
    
    it('should not undo an older history date', function() {
      Listed.methods.addHistory('item EC', '2017-02-04');
      Listed.methods.addHistory('item EC', '2017-02-05');
      Listed.methods.addHistory('item EC', '2017-02-06');
      Listed.methods.undoHistory('item EC', '2017-02-05');
      var item = Listed.methods.findHistory('item EC');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-05', '2017-02-06']);
    });
    
    it.skip('should limit history length');

  });
  
  describe('model integrity', function(){
    
    it('should contain list item props', function() {
      Listed.methods.addItem('item DA');
      var item = Listed.methods.findItem('item DA');
      expect(item).to.have.all.keys('text', 'checked');
    });
    
    it('should contain history props', function() {
      Listed.methods.addHistory('item DB');
      var item = Listed.methods.findHistory('item DB');
      expect(item).to.have.all.keys('text', 'dates');
      expect(item.dates).to.have.lengthOf(1);
      expect(item.dates[0]).to.be.a('string');
    });
    
  });
  
  describe('local storage methods', function() {
    var iscli = typeof localforage == 'undefined';
      it('save to local storage', function(done) {
        if (iscli) {
            this.skip();
        }
        else {
          var data = 'Hello Listed! '; + (new Date()).toString();
          localforage.clear();
          localforage.setItem('test message', data, function(err, value) {
            if (err) done(err);
            else localforage.getItem('test message', done);
          });
        }
      })
  });
  
  describe('prediction', function() {
    
    beforeEach( function() {
      Listed.data.history = [];
      Listed.data.prediction = [];
    });

    it('should find prediction index', function() {
      Listed.data.prediction = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var idx = Listed.methods.findPredictionAt('item AB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find prediction data', function() {
      Listed.data.prediction = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var item = Listed.methods.findPrediction('item AB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item AB'});
    });
    
    it('should predict a 1-day frequency', function() {
      Listed.methods.addHistory('item EA', '2017-02-01');
      Listed.methods.addHistory('item EA', '2017-02-02');
      Listed.methods.addHistory('item EA', '2017-02-03');
      Listed.methods.addHistory('item EA', '2017-02-04');
      Listed.methods.predictFrequencies('2017-02-05');
      expect(Listed.data.prediction).to.have.lengthOf(1);
      var item = Listed.methods.findPrediction('item EA');
      expect(item.frequency).to.be.equal(1);
      expect(item.dueDays).to.be.equal(0);  // due today (relative to 2017-02-05)
    });

    it('should predict a 3-day frequency', function() {
      Listed.methods.addHistory('item EB', '2017-02-01');
      Listed.methods.addHistory('item EB', '2017-02-04');
      Listed.methods.addHistory('item EB', '2017-02-07');
      Listed.methods.addHistory('item EB', '2017-02-10');
      Listed.methods.predictFrequencies('2017-02-11');
      expect(Listed.data.prediction).to.have.lengthOf(1);
      var item = Listed.methods.findPrediction('item EB');
      expect(item.frequency).to.be.equal(3);
      expect(item.dueDays).to.be.equal(2);  // due in 2 days (relative to 2017-02-11)
    });

    it('should predict a 7-day frequency', function() {
      Listed.methods.addHistory('item EC', '2017-02-01');
      Listed.methods.addHistory('item EC', '2017-02-08');
      Listed.methods.addHistory('item EC', '2017-02-15');
      Listed.methods.addHistory('item EC', '2017-02-22');
      Listed.methods.predictFrequencies('2017-02-24');
      expect(Listed.data.prediction).to.have.lengthOf(1);
      var item = Listed.methods.findPrediction('item EC');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(5);  // due in 5 days (relative to 2017-02-24)
    });

    it('should predict an intermitted 7-day frequency', function() {
      Listed.methods.addHistory('item ED', '2017-02-01');
      Listed.methods.addHistory('item ED', '2017-02-06');
      Listed.methods.addHistory('item ED', '2017-02-15');
      Listed.methods.addHistory('item ED', '2017-02-21');
      Listed.methods.addHistory('item ED', '2017-03-01');
      Listed.methods.addHistory('item ED', '2017-03-05');
      Listed.methods.addHistory('item ED', '2017-03-16');
      Listed.methods.addHistory('item ED', '2017-03-21');
      Listed.methods.predictFrequencies('2017-03-26');
      expect(Listed.data.prediction).to.have.lengthOf(1);
      var item = Listed.methods.findPrediction('item ED');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(2);  // due in 2 days (relative to 2017-03-26)
    });

    it('should predict a radical 7-day frequency', function() {
      Listed.methods.addHistory('item ED', '2017-02-01');
      Listed.methods.addHistory('item ED', '2017-02-06');
      Listed.methods.addHistory('item ED', '2017-02-16');
      Listed.methods.addHistory('item ED', '2017-02-20');
      Listed.methods.addHistory('item ED', '2017-03-01');
      Listed.methods.addHistory('item ED', '2017-03-04');
      Listed.methods.addHistory('item ED', '2017-03-18');
      Listed.methods.addHistory('item ED', '2017-03-20');
      Listed.methods.predictFrequencies('2017-03-31');
      expect(Listed.data.prediction).to.have.lengthOf(1);
      var item = Listed.methods.findPrediction('item ED');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(-4);   // due 4 days ago (relative to 2017-03-31)
    });

    it('should not predict with too little data', function() {
      Listed.methods.addHistory('item EF', '2017-02-01');
      Listed.methods.predictFrequencies();
      expect(Listed.data.prediction).to.have.lengthOf(0);
    });

  });

});
