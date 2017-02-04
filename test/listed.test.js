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
      Listed.data.list = [{'text':'item AA'},{'text':'item AB'},{'text':'item AC'}];
      var idx = Listed.methods.findItemAt('item AB');
      expect(idx).to.be.equal(1);
    });
    
    it('should add a new item', function() {
      Listed.methods.addItem('item AD');
      expect(Listed.data.list).to.have.lengthOf(1);
      expect(Listed.data.list[0].text).to.equal('item AD');
      expect(Listed.data.list[0].checked).to.be.false;
    });

    it('should not add a duplicate item', function() {
      Listed.methods.addItem('item AE');
      Listed.methods.addItem('item AE');
      expect(Listed.data.list).to.have.lengthOf(1);
      expect(Listed.data.list[0].text).to.equal('item AE');
      expect(Listed.data.list[0].checked).to.be.false;
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
