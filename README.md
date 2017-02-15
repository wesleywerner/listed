# Listed

This is a shopping list type web app that remembers when you check items off your list. After an item has been checked a few times, on seperate days, the app can predict and recommend when you might next need to buy that item.

The prediction is very basic: it finds the average days between the checked dates, and recommends items since their last checked date.

All data is saved in the browser local storage. No data is sent into the cloud.

# Developing

You are expected to install the dependencies with `npm install` and `npm run build` before anything else. 

## Testing

The test suite can run in either CLI or the browser, except for the tests that depend on a browser environment, localStorage for example, these will be skipped in the CLI environment.

Run `npm test` for the CLI, or open `test/browser.html` in your browser.

## Building

Run `npm run build` to clean and release everything into `dist/`. The command `npm run watch` will monitor for changes and update the `dist/` directory, giving you a speedier workflow during development.

Serve the files locally with the command `python -m SimpleHTTPServer` from inside the `/dist` directory, to `http://localhost:8000/`.

# License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
