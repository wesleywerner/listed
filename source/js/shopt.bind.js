/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


var app = new Vue({
  el: '#app',
  data: Shopt.data,
  methods: Shopt.methods,
  computed: Shopt.computed
});

// load the user list and history data
Shopt.methods.load(Shopt.methods.dataLoaded);   // calls Shopt.ui method

// toggle loading as complete
setTimeout( function() { Shopt.data.loading = false; }, 1000);
