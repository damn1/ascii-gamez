const DEFAULT_COLOR = '#0a0';
const PIXEL_PROBABILITY = 0.6;
const X = 0;
const Y = 1;
// field constants:
const MIN_ROW = 6;
const MIN_COL = 8;
// pieces constants:
const MAX_ROW_B = 3;
const MAX_COL_B = 3;

const LEFT  = 'a';
const RIGHT = 'd';
const DOWN  = 's';
const UP    = 'w';
const CLOCK = 'l';
const CNTCL = 'k';

// boolean matrices for field and next
var field_mat = [];
var next_mat = [];
var curr_mat = [];
var curr_pos = [];

var playing = false;
var name = 'damn';
var score = '0';
var blocks_counter = '0';

var commandsData =
{
  start: '' +
//    '┌───────────────────────────┐\n' +
//    '            START            \n' +
//    '└───────────────────────────┘\n',
    '                             \n' +
    '            START            \n' +
    '                             \n',
  commandsRotation: '' +
    '      ┌───┬───┐\n' +
    '      │ ↺ │ ↻ │\n' +
    '      └───┴───┘',
  commandsTranslation: '' +
    '┌───┬───┬───┐\n' +
    '│ ← │ ↓ │ → │\n' +
    '└───┴───┴───┘',
  rows: MIN_ROW,
  cols: MIN_COL,
  color: DEFAULT_COLOR
}

/* 
 * ascii-tetris-commands component: 
 * a simple container of bootstrap rows with labels and input values for moves
 * commands (right, left...) and for game parameters (rows, cols).
 */
Vue.component('ascii-tetris-commands', {
  template: '' +
  '    <div class="tetris-input-container">' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rows"><pre class="command-label">Rows</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-rows" class="tetris-input" type="number" v-bind:value="rows">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rows"><pre class="command-label">Cols</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-cols" class="tetris-input" type="number" v-bind:value="cols" >' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rows"><pre class="command-label">Color</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input type="color" id="color-picker" v-on:click="clickColor()" v-bind:value="color">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <pre class="command-label">{{ commandsTranslation }}</pre>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-left" class="tetris-command" type="text" value="a">' +
  '          <input id="input-down" class="tetris-command" type="text" value="s">' +
  '          <input id="input-right" class="tetris-command" type="text" value="d">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <pre class="command-label">{{ commandsRotation }}</pre>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-cntclck" class="tetris-command" type="text" value="k">' +
  '          <input id="input-clock" class="tetris-command" type="text" value="l">' +
  '        </div>' +
  '      </div>' +
  '      <div id="start-container" class="row">' +
  '        <div id="start-label-container" class="col-sm-12">' +
  '          <pre class="command-label start">{{ start }}</pre>' +
  '        </div>' +
  '        <div id="start-input-container">' +
  '          <input type="text" v-on:keyup="keymonitor"  v-on:click="startMatch">' +
  '        </div>' +
  '      </div>' +
  '    </div>',
  data: function()
  {
    return commandsData;
  },
  methods:
  {
    keymonitor: function(event)
    {
      console.log(event.key);
      move(event.key, curr_pos, curr_mat);
      this.field_str_vue = toStringField();
    },
    startMatch: function()
    {
      // `this` inside methods points to the Vue instance
      playing = true;
      curr_mat = next_mat;
      next_mat = genBlock();
      curr_pos[X] = spawn(curr_mat);
      curr_pos[Y] = 0;
      this.field_str_vue = toStringField();
    },
    do: function()
    {
      console.log('figa');
    }
  }
});