var Listed = {};

Listed.getData = function() {
  return { name:'molly', tail:false };
}

// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
