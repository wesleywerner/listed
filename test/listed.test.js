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

    it.skip('should merge two histories', function() {
      
    });

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
      expect(item.dates[0]).to.be.instanceof(moment);
    });
    
    it('should not append same history date', function() {
      Listed.methods.addHistory('item DC', moment('2017-02-04 12:00'));
      Listed.methods.addHistory('item DC', moment('2017-02-04'));
      var item = Listed.methods.findHistory('item DC');
      expect(item.dates).to.have.lengthOf(1);
      expect(moment(item.dates[0]).isSame(moment('2017-02-04'))).to.be.true;
    });
    
    it.skip('should limit history length');

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
  })

});
