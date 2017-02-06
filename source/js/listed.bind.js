var app = new Vue({
  el: '#app',
  data: Listed.data,
  methods: Listed.methods
});

// load the user list and history data
Listed.methods.load();

// save the user list and history data
setInterval(Listed.methods.save, 10000)
