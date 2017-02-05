Vue.component('list-item', {
  props: ['item'],
  template: '<li><label><input type="checkbox" id="checkbox" v-model="item.checked">{{ item.text }}</label> <button v-on:click="remove">X</button> </li>',
  methods: {
    remove: function() {
      this.$emit('remove', this.item.text);
    }
  }
})
