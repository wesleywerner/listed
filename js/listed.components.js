/**
 * A common page navigation bar.
 */
Vue.component('navigation', {
  props: ['view', 'color', 'saved', 'hiliteRecommendations'],
  methods: {
    callPredictFrequencies: function () {
      
    }
  },
  template: '<nav v-bind:class="color" role="navigation"> \
          <div class="nav-wrapper container"> \
            <a id="logo-container" href="#recommendedPopup" class="brand-logo" v-on:click="callPredictFrequencies"> \
              <i class="material-icons medium animated" v-bind:class="{ \'infinite tada\': hiliteRecommendations }">stars</i>Listed</a> \
            <!-- mobile collapse hamburger --> \
            <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a> \
            <!-- navbar full and mobile links --> \
            <ul class="right hide-on-med-and-down"> \
              <li><a v-bind:class="[color, { \'lighten-3 black-text\': view == \'list\' }]" href="index.html">List</a></li> \
              <li><a v-bind:class="[color, { \'lighten-3 black-text\': view == \'data\' }]" href="data.html">Data</a></li> \
              <li><a v-bind:class="[color, { \'lighten-3 black-text\': view == \'graphs\' }]" href="graphs.html">Graphs</a></li> \
              <li><a v-bind:class="[color, { \'lighten-3 black-text\': view == \'config\' }]" href="config.html">Config</a></li> \
            </ul> \
            <ul class="side-nav" id="mobile-demo"> \
              <li><a href="index.html">List</a></li> \
              <li><a href="data.html">Data</a></li> \
              <li><a href="graphs.html">Graphs</a></li> \
              <li><a href="config.html">Config</a></li> \
            </ul> \
            <!-- Status icons --> \
            <ul class="right"> \
              <li> \
                <i class="material-icons" v-show="!saved" title="unsaved changes">mode_edit</i> \
              </li> \
            </ul> \
          </div> \
        </nav>'
})


/**
 * A list item component that can remove itself.
 */
Vue.component('list-item', {
  props: ['id', 'item'],
  template: '<li><div> \
             <input type="checkbox" v-bind:id="id" v-model="item.checked" v-on:click="checkMe"> \
             <label v-bind:for="id">{{ item.text }}</label> \
             <a class="secondary-content waves-effect waves-light btn-flat right" v-on:click="removeMe"><i class="material-icons">delete</i></a> \
             </div></li>',
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
 *    placeholder: input placeholder text.
 *    show-button: inline enter button that triggers the selected event.
 * Events:
 *    selected: fired when the enter key is used on the input.
 */
Vue.component('item-autocomplete', {
  props: ['value', 'id', 'history', 'autoClear', 'showButton', 'placeholder'],
  data: function() {
    return {
      inputValue: '',
      dataId: this.id + 'data'
    }
  },
  template: '<div class="row"> \
              <div class="col s8"> \
                <div class="input-field"> \
                  <input type="text" v-bind:id="id" v-bind:list="dataId" v-model="inputValue" v-on:keyup.enter="selected" v-on:input="updateInput" /> \
                  <label v-bind:for="id">{{ placeholder }}</label> \
                  <datalist v-bind:id="dataId"> \
                    <option v-for="item in history" v-bind:value="item.text"> \
                  </datalist> \
                </div> \
              </div> \
              <div class="col s2" v-show="showButton"> \
                <a href="#" class="waves-effect waves-light btn-large btn-flat" v-on:click="selected"><i class="material-icons">send</i></a> \
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
          <item-autocomplete id="merge-B" v-bind:history="history" v-model="mergeBText" placeholder="Select an item"></item-autocomplete> \
          <item-autocomplete id="merge-A" v-bind:history="history" v-model="mergeAText" placeholder="merge it into this item"></item-autocomplete> \
          <button class="waves-effect waves-light btn" v-on:click="doMerge">Merge</button> </span>',
  methods: {
    doMerge: function() {
      this.$emit('do-merge', this.mergeAText, this.mergeBText);
    }
  }
})
