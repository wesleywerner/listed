// make available to cli unit tests
if (typeof require != 'undefined') {
  var assert = require('chai').assert;
  var expect = require('chai').expect;
  var Listed = require('../source/js/listed.js');
}

describe('Listed Test Suite', function() {

  describe('methods', function() {
    
    beforeEach(function() {
      Listed.data.list = [];
    });
    
    it('add a list item', function() {
      Listed.methods.addItem('test item');
      expect(Listed.data.list).to.have.lengthOf(1);
      expect(Listed.data.list[0].text).to.equal('test item');
      expect(Listed.data.list[0].checked).to.be.false;
    });

  });
  
  describe('storage', function() {
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