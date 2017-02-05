/**
 * A list item component that can remove itself.
 */
Vue.component('list-item', {
  props: ['item'],
  template: '<li><label><input type="checkbox" id="checkbox" v-model="item.checked" v-on:click="checkMe">{{ item.text }}</label> <button v-on:click="removeMe">X</button> </li>',
  methods: {
    removeMe: function() {
      this.$emit('remove', this.item.text);
    },
    checkMe: function() {
      this.$emit('checked', this.item.text);
    }
  }
})

/**
 * A text input that auto completes history items.
 * Props:
 *    id: uniquely identity this component.
 *    history: the history items to auto complete.
 *    auto-clear: if "true" the input will clear after input key enter.
 * Events:
 *    selected: fired when the enter key is used on the input.
 */
Vue.component('item-autocomplete', {
  props: ['value', 'id', 'history', 'autoClear'],
  data: function() {
    return {
      inputValue: ''
    }
  },
  template: '<div class="input-field"> \
            <label>Add something to your shopping list</label> \
            <input v-bind:list="id" v-model="inputValue" v-on:keyup.enter="selected" v-on:input="updateInput" /> \
            <datalist v-bind:id="id"> \
              <option v-for="item in history" v-bind:value="item.text"> \
            </datalist> \
            </div>',
  methods: {
    selected: function() {
      this.$emit('selected', this.inputValue);
      if (this.autoClear == 'true') {
        this.inputValue = '';
      }
    },
    updateInput: function() {
      this.$emit('input', this.inputValue);
    }
  }
})


Vue.component('merge-selection', {
  props: ['history'],
  data: function() {
    return {
      mergeAText: '',
      mergeBText: ''
    }
  },
  template: '<span> \
          <item-autocomplete id="merge-A" v-bind:history="history" v-model="mergeAText"></item-autocomplete> \
          <item-autocomplete id="merge-B" v-bind:history="history" v-model="mergeBText"></item-autocomplete> \
          <button v-on:click="doMerge">Merge</button> </span>',
  methods: {
    doMerge: function() {
      this.$emit('do-merge', this.mergeAText, this.mergeBText);
    }
  }
})
