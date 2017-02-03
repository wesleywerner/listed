// make available to cli unit tests
if (typeof require != 'undefined') {
  var assert = require('chai').assert;
  var Listed = require('../source/js/listed.js');
}

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('Listed Test Suite', function() {

  describe('molly', function() {
    var data = {};
    beforeEach(function() {
      data = Listed.getData();
    });
    it('modifies the data', function() {
      data.tail = true;
      return true;
    });
    it('should be named molly', function() {
      assert.equal(data.name, 'molly');
    });
    it('should not have a tail', function() {
      assert.equal(data.tail, false);
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