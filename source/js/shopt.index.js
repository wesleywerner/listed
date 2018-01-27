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


(function(){

  // hook into native android back-button events.
  // returns true if the back button was handled here.
  Shopt.methods.backButton = function() {

    // Hide the "add item" modal
    var openModal = $('#addItemModal').hasClass('open');
    if (openModal) {
       $('#addItemModal').modal('close');
      return true;
    }
    
    // Hide the "clean list" modal
    var openModal = $('#cleanListModal').hasClass('open');
    if (openModal) {
       $('#cleanListModal').modal('close');
      return true;
    }
    
  }
    
}())
