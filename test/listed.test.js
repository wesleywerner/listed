// make available to cli unit tests
if (typeof require != 'undefined') {
  var assert = require('chai').assert;
  var expect = require('chai').expect;
  var Listed = require('../source/js/listed.js');
}

describe('Listed Test Suite', function() {

  describe('shopping list management methods', function() {
    
    beforeEach(function() {
      Listed.data.list = [];
    });
    
    it('should find an item', function() {
      Listed.data.list = [{'text':'item 1'},{'text':'item 2'},{'text':'item 3'}];
      var idx = Listed.methods.findItemAt('item 2');
      expect(idx).to.be.equal(1);
    });
    
    it('should add a new item', function() {
      Listed.methods.addItem('test item');
      expect(Listed.data.list).to.have.lengthOf(1);
      expect(Listed.data.list[0].text).to.equal('test item');
      expect(Listed.data.list[0].checked).to.be.false;
    });

    it('should not add a duplicate item', function() {
      Listed.methods.addItem('test item');
      Listed.methods.addItem('test item');
      expect(Listed.data.list).to.have.lengthOf(1);
      expect(Listed.data.list[0].text).to.equal('test item');
      expect(Listed.data.list[0].checked).to.be.false;
    });
    
    it('should remove an item', function() {
      Listed.methods.addItem('test item 1');
      Listed.methods.addItem('test item 2');
      Listed.methods.addItem('test item 3');
      Listed.methods.removeItem('test item 2');
      // test length
      expect(Listed.data.list).to.have.lengthOf(2);
      // test correct item got removed
      var idx = Listed.methods.findItemAt('test item 2');
      expect(idx).to.equal(-1);
    });

    it('should amend an item', function() {
      Listed.methods.addItem('test item 1');
      Listed.methods.addItem('test item 2');
      Listed.methods.addItem('test item 3');
      Listed.methods.amendItem('test item 2', 'test item n');
      var idx = Listed.methods.findItemAt('test item n');
      expect(idx).to.equal(1);
    });

    it('should not amend to empty item', function() {
      Listed.methods.addItem('test item 1');
      Listed.methods.addItem('test item 2');
      Listed.methods.addItem('test item 3');
      Listed.methods.amendItem('test item 2', null);
      Listed.methods.amendItem('test item 2', undefined);
      Listed.methods.amendItem('test item 2', '');
      Listed.methods.amendItem('test item 2', ' ');
      var idx = Listed.methods.findItemAt('test item 2');
      expect(idx).to.equal(1);
    });

  });

  describe('history list management methods', function() {
    
    var history = Listed.data.history;
    
    beforeEach(function() {
      Listed.data.history = [];
    });
    
    it.skip('should add a new item', function() {
      
    });

    it.skip('should not add a duplicate item', function() {
      
    });

    it.skip('should amend an item', function() {
      
    });

  });
  
  describe('local storage methods', function() {
    var iscli = typeof localforage == 'undefined';
      it('save to local storage', function(){
          if (iscli) {
              this.skip();
          }
          else {
              return true;
          }
      })
  })

});
