// make available to cli unit tests
if (typeof require != 'undefined') {
  var assert = require('chai').assert;
  var expect = require('chai').expect;
  var moment = require('moment');
  var Shopt = require('../source/js/shopt.logic.js');
  var Polyfils = require('../source/js/polyfills.js');
}

describe('Shopt Test Suite', function() {

  describe('list management methods', function() {
    
    beforeEach(function() {
      Shopt.data.list = [];
    });
    
    it('should find item index', function() {
      Shopt.data.list = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var idx = Shopt.methods.findItemAt('item AB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find item data', function() {
      Shopt.data.list = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var item = Shopt.methods.findItem('item AB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item AB'});
    });
    
    it('should add a new item', function() {
      Shopt.methods.addItem('item AD');
      expect(Shopt.data.list).to.have.lengthOf(1);
      var idx = Shopt.methods.findItemAt('item AD');
      expect(idx).to.equal(0);
    });

    it('should not add a blank item', function() {
      Shopt.methods.addItem('');
      Shopt.methods.addItem(null);
      expect(Shopt.data.list).to.have.lengthOf(0);
    });
    
    it('should not add a duplicate item', function() {
      Shopt.methods.addItem('item AE');
      Shopt.methods.addItem('item AE');
      expect(Shopt.data.list).to.have.lengthOf(1);
    });
    
    it('should remove an item', function() {
      Shopt.methods.addItem('item AF');
      Shopt.methods.addItem('item AG');
      Shopt.methods.addItem('item AH');
      Shopt.methods.removeItem('item AG');
      // test length
      expect(Shopt.data.list).to.have.lengthOf(2);
      // test correct item got removed
      var idx = Shopt.methods.findItemAt('item AG');
      expect(idx).to.equal(-1);
    });

    it('should amend an item', function() {
      Shopt.methods.addItem('item AI');
      Shopt.methods.addItem('item AJ');
      Shopt.methods.addItem('item AK');
      Shopt.methods.amendItem('item AJ', 'item Amended');
      var idx = Shopt.methods.findItemAt('item Amended');
      expect(idx).to.equal(1);
    });

    it('should not amend to empty item', function() {
      Shopt.methods.addItem('item AI');
      Shopt.methods.addItem('item AJ');
      Shopt.methods.addItem('item AK');
      Shopt.methods.amendItem('item AJ', null);
      Shopt.methods.amendItem('item AJ', undefined);
      Shopt.methods.amendItem('item AJ', '');
      Shopt.methods.amendItem('item AJ', ' ');
      var idx = Shopt.methods.findItemAt('item AJ');
      expect(idx).to.equal(1);
    });
    
    it('should clean all checked items', function() {
      Shopt.methods.addItem('item AI');
      Shopt.methods.addItem('item AJ');
      Shopt.methods.addItem('item AK');
      var a = Shopt.methods.findItem('item AI');
      a.checked = true;
      var b = Shopt.methods.findItem('item AK');
      b.checked = true;
      Shopt.methods.cleanList();
      expect(Shopt.data.list).to.have.lengthOf(1);
      var c = Shopt.methods.findItemAt('item AJ');
      expect(c).to.be.equal(0);
    })

    it('should rename item text', function() {
      Shopt.methods.addItem('item FA');
      Shopt.methods.rename('item FA', 'item FC');
      var oldItem = Shopt.methods.findItemAt('item FA');
      expect(oldItem).to.be.equal(-1);
      var newItem = Shopt.methods.findItemAt('item FC');
      expect(newItem).to.not.be.equal(-1);
    });
    
    it('should not rename item to existing text', function() {
      Shopt.methods.addItem('item FA');
      Shopt.methods.addItem('item FC');
      Shopt.methods.rename('item FA', 'item FC');
      var oldItem = Shopt.methods.findItemAt('item FA');
      expect(oldItem).to.not.be.equal(-1);
    });
    
  });

  describe('history management methods', function() {
    
    beforeEach(function() {
      Shopt.data.list = [];
      Shopt.data.history = [];
    });
    
    it('should find history index', function() {
      Shopt.data.history = [{'text':'item BA'},{'text':'item BB'},{'text':'item BC'}];
      var idx = Shopt.methods.findHistoryAt('item BB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find history data', function() {
      Shopt.data.history = [{'text':'item BA'},{'text':'item BB'},{'text':'item BC'}];
      var item = Shopt.methods.findHistory('item BB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item BB'});
    });
    
    it('should add history', function() {
      Shopt.methods.addHistory('item BD');
      expect(Shopt.data.history).to.have.lengthOf(1);
      var idx = Shopt.methods.findHistoryAt('item BD');
      expect(idx).to.equal(0);
    });

    it('should not add blank history', function() {
      Shopt.methods.addHistory(null);
      Shopt.methods.addHistory('');
      expect(Shopt.data.history).to.have.lengthOf(0);
    });

    it('should not add duplicate histories', function() {
      Shopt.methods.addHistory('item BE');
      Shopt.methods.addHistory('item BE');
      expect(Shopt.data.history).to.have.lengthOf(1);
    });

    it('should amend history', function() {
      Shopt.methods.addHistory('item BF');
      Shopt.methods.addHistory('item BG');
      Shopt.methods.addHistory('item BH');
      Shopt.methods.amendHistory('item BG', 'item Amended');
      var idx = Shopt.methods.findHistoryAt('item Amended');
      expect(idx).to.equal(1);
    });
    
    it('should not amend history to existing', function() {
      Shopt.methods.addHistory('item BI');
      Shopt.methods.addHistory('item BJ');
      Shopt.methods.addHistory('item BK');
      Shopt.methods.amendHistory('item BJ', 'item BK');
      var idx = Shopt.methods.findHistoryAt('item BJ');
      expect(idx).to.equal(1);
    });

    it('should merge two histories', function() {
      Shopt.methods.addHistory('item BL', '2017-02-05');
      Shopt.methods.addHistory('item BL', '2017-02-06');
      Shopt.methods.addHistory('item BM', '2017-02-03');
      Shopt.methods.addHistory('item BM', '2017-02-04');
      Shopt.methods.addHistory('item BM', '2017-02-05');
      expect(Shopt.data.history).to.have.lengthOf(2);
      Shopt.methods.mergeHistory('item BL', 'item BM');
      expect(Shopt.data.history).to.have.lengthOf(1);
      var item = Shopt.methods.findHistory('item BL');
      expect(item).to.not.be.null;
      expect(item.dates).to.have.lengthOf(4);
      expect(JSON.stringify(item.dates)).to.equal('["2017-02-03","2017-02-04","2017-02-05","2017-02-06"]');
    });

    it('should not append same history date', function() {
      Shopt.methods.addHistory('item DC', '2017-02-04 12:00');
      Shopt.methods.addHistory('item DC', '2017-02-04');
      var item = Shopt.methods.findHistory('item DC');
      expect(item.dates).to.have.lengthOf(1);
      expect(item.dates[0]).to.equal('2017-02-04');
    });
    
    it('should remove a specific history date', function() {
      Shopt.methods.addHistory('item EA', '2017-02-04');
      Shopt.methods.addHistory('item EA', '2017-02-05');
      Shopt.methods.addHistory('item EA', '2017-02-06');
      Shopt.methods.removeHistoryDate('item EA', '2017-02-05');
      var item = Shopt.methods.findHistory('item EA');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-06']);
    });
    
    it('should remove entire history by name', function() {
      Shopt.methods.addHistory('item EA', '2017-02-04');
      Shopt.methods.addHistory('item EA', '2017-02-05');
      Shopt.methods.addHistory('item EA', '2017-02-06');
      Shopt.methods.removeAllHistory('item EA');
      expect(Shopt.data.history).to.have.lengthOf(0);
    });
    
    it('should undo the latest history date', function() {
      Shopt.methods.addHistory('item EB', '2017-02-04');
      Shopt.methods.addHistory('item EB', '2017-02-05');
      Shopt.methods.addHistory('item EB', '2017-02-06');
      Shopt.methods.undoHistory('item EB', '2017-02-06');
      var item = Shopt.methods.findHistory('item EB');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-05']);
    });
    
    it('should undo history today', function() {
      Shopt.methods.addHistory('item EC');
      Shopt.methods.undoHistory('item EC');
      var item = Shopt.methods.findHistory('item EC');
      expect(item.dates).to.deep.equal([]);
    });
    
    it('should not undo an older history date', function() {
      Shopt.methods.addHistory('item EC', '2017-02-04');
      Shopt.methods.addHistory('item EC', '2017-02-05');
      Shopt.methods.addHistory('item EC', '2017-02-06');
      Shopt.methods.undoHistory('item EC', '2017-02-05');
      var item = Shopt.methods.findHistory('item EC');
      expect(item.dates).to.deep.equal(['2017-02-04', '2017-02-05', '2017-02-06']);
    });
    
    it('should rename history text', function() {
      Shopt.methods.addHistory('item FA', '2017-02-04');
      Shopt.methods.addHistory('item FA', '2017-02-05');
      Shopt.methods.addHistory('item FA', '2017-02-06');
      Shopt.methods.addHistory('item FB', '2017-02-04');
      Shopt.methods.rename('item FA', 'item FC');
      var oldHistory = Shopt.methods.findHistoryAt('item FA');
      expect(oldHistory).to.be.equal(-1);
      var newHistory = Shopt.methods.findHistoryAt('item FC');
      expect(newHistory).to.not.be.equal(-1);
    });
    
    it('should not rename history to existing text', function() {
      Shopt.methods.addHistory('item FA', '2017-02-04');
      Shopt.methods.addHistory('item FA', '2017-02-05');
      Shopt.methods.addHistory('item FA', '2017-02-06');
      Shopt.methods.addHistory('item FC', '2017-02-04');
      Shopt.methods.rename('item FA', 'item FC');
      var oldHistory = Shopt.methods.findHistoryAt('item FA');
      expect(oldHistory).to.not.be.equal(-1);
    });
    
    it.skip('should limit history length');

  });
  
  describe('model integrity', function(){
    
    it('should contain list item props', function() {
      Shopt.methods.addItem('item DA');
      var item = Shopt.methods.findItem('item DA');
      expect(item).to.have.all.keys('text', 'checked');
    });
    
    it('should contain history props', function() {
      Shopt.methods.addHistory('item DB');
      var item = Shopt.methods.findHistory('item DB');
      expect(item).to.have.all.keys('text', 'dates');
      expect(item.dates).to.have.lengthOf(1);
      expect(item.dates[0]).to.be.a('string');
    });
    
  });
  
  describe('local storage methods', function() {
      it.skip('save to local storage');
  });
  
  describe('prediction', function() {
    
    beforeEach( function() {
      Shopt.data.history = [];
      Shopt.data.prediction = [];
    });

    it('should find prediction index', function() {
      Shopt.data.prediction = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var idx = Shopt.methods.findPredictionAt('item AB');
      expect(idx).to.be.equal(1);
    });
    
    it('should find prediction data', function() {
      Shopt.data.prediction = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var item = Shopt.methods.findPrediction('item AB');
      expect(item).to.not.be.null;
      expect(item).to.deep.equal({'text':'item AB'});
    });
    
    it('should predict a 1-day frequency', function() {
      Shopt.methods.addHistory('item EA', '2017-02-01');
      Shopt.methods.addHistory('item EA', '2017-02-02');
      Shopt.methods.addHistory('item EA', '2017-02-03');
      Shopt.methods.addHistory('item EA', '2017-02-04');
      Shopt.methods.predictFrequencies('2017-02-05');
      expect(Shopt.data.prediction).to.have.lengthOf(1);
      var item = Shopt.methods.findPrediction('item EA');
      expect(item.frequency).to.be.equal(1);
      expect(item.dueDays).to.be.equal(0);  // due today (relative to 2017-02-05)
    });

    it('should predict a 3-day frequency', function() {
      Shopt.methods.addHistory('item EB', '2017-02-01');
      Shopt.methods.addHistory('item EB', '2017-02-04');
      Shopt.methods.addHistory('item EB', '2017-02-07');
      Shopt.methods.addHistory('item EB', '2017-02-10');
      Shopt.methods.predictFrequencies('2017-02-11');
      expect(Shopt.data.prediction).to.have.lengthOf(1);
      var item = Shopt.methods.findPrediction('item EB');
      expect(item.frequency).to.be.equal(3);
      expect(item.dueDays).to.be.equal(2);  // due in 2 days (relative to 2017-02-11)
    });

    it('should predict a 7-day frequency', function() {
      Shopt.methods.addHistory('item EC', '2017-02-01');
      Shopt.methods.addHistory('item EC', '2017-02-08');
      Shopt.methods.addHistory('item EC', '2017-02-15');
      Shopt.methods.addHistory('item EC', '2017-02-22');
      Shopt.methods.predictFrequencies('2017-02-24');
      expect(Shopt.data.prediction).to.have.lengthOf(1);
      var item = Shopt.methods.findPrediction('item EC');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(5);  // due in 5 days (relative to 2017-02-24)
    });

    it('should predict an intermitted 7-day frequency', function() {
      Shopt.methods.addHistory('item ED', '2017-02-01');
      Shopt.methods.addHistory('item ED', '2017-02-06');
      Shopt.methods.addHistory('item ED', '2017-02-15');
      Shopt.methods.addHistory('item ED', '2017-02-21');
      Shopt.methods.addHistory('item ED', '2017-03-01');
      Shopt.methods.addHistory('item ED', '2017-03-05');
      Shopt.methods.addHistory('item ED', '2017-03-16');
      Shopt.methods.addHistory('item ED', '2017-03-21');
      Shopt.methods.predictFrequencies('2017-03-26');
      expect(Shopt.data.prediction).to.have.lengthOf(1);
      var item = Shopt.methods.findPrediction('item ED');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(2);  // due in 2 days (relative to 2017-03-26)
    });

    it('should predict a radical 7-day frequency', function() {
      Shopt.methods.addHistory('item ED', '2017-02-01');
      Shopt.methods.addHistory('item ED', '2017-02-06');
      Shopt.methods.addHistory('item ED', '2017-02-16');
      Shopt.methods.addHistory('item ED', '2017-02-20');
      Shopt.methods.addHistory('item ED', '2017-03-01');
      Shopt.methods.addHistory('item ED', '2017-03-04');
      Shopt.methods.addHistory('item ED', '2017-03-18');
      Shopt.methods.addHistory('item ED', '2017-03-20');
      Shopt.methods.predictFrequencies('2017-03-31');
      expect(Shopt.data.prediction).to.have.lengthOf(1);
      var item = Shopt.methods.findPrediction('item ED');
      expect(item.frequency).to.be.equal(7);
      expect(item.dueDays).to.be.equal(-4);   // due 4 days ago (relative to 2017-03-31)
    });

    it('should not predict with too little data', function() {
      Shopt.methods.addHistory('item EF', '2017-02-01');
      Shopt.methods.predictFrequencies();
      expect(Shopt.data.prediction).to.have.lengthOf(0);
    });

  });

});
