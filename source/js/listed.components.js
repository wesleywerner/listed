Vue.component('list-item', {
  props: ['item'],
  template: '<li><label><input type="checkbox" id="checkbox" v-model="item.checked">{{ item.text }}</label></li>'
})