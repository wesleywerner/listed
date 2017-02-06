/**
 * A list item component that can remove itself.
 */
Vue.component('list-item', {
  props: ['id', 'item'],
  template: '<tr><td><input type="checkbox" v-bind:id="id" v-model="item.checked" v-on:click="checkMe"> \
             <label v-bind:for="id">{{ item.text }}</label> </td> \
             <td><a class="waves-effect waves-light btn-flat right" v-on:click="removeMe">X</a> </td></tr>',
  methods: {
    removeMe: function() {
      this.$emit('remove', this.item.text);
    },
    checkMe: function() {
      if (this.item.checked) {
        this.$emit('checked', this.item.text);
      } else {
        this.$emit('unchecked', this.item.text);
      }
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
      inputValue: '',
      dataId: this.id + 'data'
    }
  },
  template: '<div class="row"> \
              <div class="input-field col s8"> \
                <input type="text" v-bind:id="id" v-bind:list="dataId" v-model="inputValue" v-on:keyup.enter="selected" v-on:input="updateInput" /> \
                <label v-bind:for="id">I want...</label> \
                <datalist v-bind:id="dataId"> \
                  <option v-for="item in history" v-bind:value="item.text"> \
                </datalist> \
              </div> \
              <div class="col s2"> \
                <a class="waves-effect waves-light btn-large" v-on:click="selected"><i class="material-icons">playlist_add</i></a> \
              </div> \
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
