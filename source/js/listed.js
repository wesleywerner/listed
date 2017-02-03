var Listed = { 'version': 1 };
Listed.data = {};
Listed.data.history = [];
Listed.data.list = [];

Listed.data.newItemText = 'new item';

// method context is scoped via Vue so that 'this' references the Listed.data object
Listed.methods = {};

// Add a list item
Listed.methods.addItem = function (text) {
  Listed.data.list.push({'text':text, 'checked': false});
}

// make available to cli unit tests
if (typeof module != 'undefined') {
  module.exports = Listed;
}
