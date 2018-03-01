const DEFAULT_COLOR = '#00aa00';
const PIXEL_PROBABILITY = 0.6;
const X = 0;
const Y = 1;
// field constants:
const MIN_ROW = 7;
const MIN_COL = 8;
// pieces constants:
const DEFAULT_ROW_B = 4;
const DEFAULT_COL_B = 4;
// input for blocks dimension
var rowsBlock = DEFAULT_ROW_B;
var colsBlock = DEFAULT_COL_B;
// default values
const LEFT_init  = 'a';
const RIGHT_init = 'd';
const DOWN_init  = 's';
const UP_init    = 'w';
const CLOCK_init = 'l';
const CNTCL_init = 'k';
// enum moves
const LEFT  = 'left';
const RIGHT = 'right';
const DOWN  = 'down';
const UP    = 'up';
const CLOCK = 'clock';
const CNTCL = 'counterclock';
const DEFAULT_NAME = 'damn';
// boolean matrices for field, block, next block
var field_mat = [];
var next_block  = [];
var curr_block  = [];
// (X,Y) position container
var curr_pos = [];
// ruler variable for falling blocks
var playing = false;
// header of the field
var fieldTitle = 'damn T E T R I S';
var name = DEFAULT_NAME;
var score = 10;
var blocks_counter = 0;
/**
 * init initialization function to create field and first block.
 */
function init(fieldRows, fieldCols, blockRows, blockCols)
{
  field_mat = [];
  next_block  = [];
  curr_block  = [];
  // init field to void
  for(var i = 0; i < fieldRows; i++)
  {
    var row = new Array();
    for(var j = 0; j < fieldCols; j++)
    { row.push(false); }
    field_mat.push(row);
  }

  // init next block to void
  for(var i = 0; i < blockRows; i++)
  {
    var row = new Array();
    for(var j = 0; j < blockCols; j++)
    { row.push(false); }
    next_block.push(row);
    curr_block.push(row);
  }
  curr_pos.push(0);
  curr_pos.push(0);
  next_block = genBlock();
}


var commandsData =
    {
      start: '' +
      //    '┌───────────────────────────┐\n' +
      //    '            START            \n' +
      //    '└───────────────────────────┘\n',
      'START\n',
      commandsRotation: '' +
      '      ┌───┬───┐\n' +
      '      │ ↺ │ ↻ │\n' +
      '      └───┴───┘',
      commandsTranslation: '' +
      '┌───┬───┬───┐\n' +
      '│ ← │ ↓ │ → │\n' +
      '└───┴───┴───┘',
      // dynamic style color
      dynamicColor: {
        color: DEFAULT_COLOR,
      },
      // field's parameters
      rows: MIN_ROW,
      cols: MIN_COL,
      // blocks' parameters
      rowsBlock: DEFAULT_ROW_B,
      colsBlock: DEFAULT_COL_B,
      // commands' parameters
      left  : LEFT_init ,
      right : RIGHT_init,
      down  : DOWN_init ,
      up    : UP_init   ,
      clock : CLOCK_init,
      cntcl : CNTCL_init,

      name  : DEFAULT_NAME,
    }

/* 
 * ascii-tetris-commands component: 
 * a simple container of bootstrap rows with labels and input values for moves
 * commands (right, left...) and for game parameters (rows, cols).
 */
const asciiTetrisCommandsComponent = Vue.component('ascii-tetris-commands', {
  template: '' +
  '    <div class="tetris-input-container" v-bind:style="dynamicColor">' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-name"><pre class="command-label" v-bind:style="dynamicColor">Name</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-name" class="tetris-input" type="text" v-model="name" maxlength="9" v-on:keyup="nameUpdate">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rows"><pre class="command-label" v-bind:style="dynamicColor">Rows</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-rows" class="tetris-input" type="number" min="4" v-model="rows" v-on:change="reInitField">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-cols"><pre class="command-label" v-bind:style="dynamicColor">Cols</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-cols" class="tetris-input" type="number" v-model="cols" v-on:change="reInitField">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rowsBlock"><pre class="command-label" v-bind:style="dynamicColor">Block rows</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-rowsBlock" class="tetris-input" type="number" min="1" v-model="rowsBlock" v-on:change="reInitField">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-colsBlock"><pre class="command-label" v-bind:style="dynamicColor">Block cols</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-colsBlock" class="tetris-input" type="number" min="1" v-model="colsBlock" v-on:change="reInitField">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <label for="input-rows"><pre class="command-label" v-bind:style="dynamicColor">Color</pre></label>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input type="color" id="color-picker" v-on:change="colorPick($event)" v-model="dynamicColor.color">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <pre class="command-label" v-bind:style="dynamicColor">{{ commandsTranslation }}</pre>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-left"  class="tetris-command" type="text" maxlength="1" v-model="left">' +
  '          <input id="input-down"  class="tetris-command" type="text" maxlength="1" v-model="down">' +
  '          <input id="input-right" class="tetris-command" type="text" maxlength="1" v-model="right">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row">' +
  '        <div class="col-sm-5">' +
  '          <pre class="command-label" v-bind:style="dynamicColor">{{ commandsRotation }}</pre>' +
  '        </div>' +
  '        <div class="col-sm-7 right">' +
  '          <input id="input-cntcl" class="tetris-command" type="text" v-model="cntcl">' +
  '          <input id="input-clock" class="tetris-command" type="text" v-model="clock">' +
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
      switch(event.key)
      {
        case this.left:
          move(LEFT, curr_pos, curr_block);
          break;
        case this.right:
          move(RIGHT, curr_pos, curr_block);
          break;
        case this.down:
          move(DOWN, curr_pos, curr_block);
          break;
        case this.up:
          move(UP, curr_pos, curr_block);
          break;
        case this.clock:
          move(CLOCK, curr_pos, curr_block);
          break;
        case this.cntcl:
          move(CNTCL, curr_pos, curr_block);
          break;
      }
      this.$parent.updateField();
    },
    /**
     *
     */
    startMatch: function()
    {
      // `this` inside methods points to the Vue instance
      if (!playing)
      {
        playing = true;
      }
      curr_block = next_block;
      next_block = genBlock();
      curr_pos[X] = spawn(curr_block);
      curr_pos[Y] = 0;
      this.start = 'keep focus to give inputs'
      this.$parent.updateField();
    },

    /**
     * colorPick function called on color pick: emit an event from inputs
     *           component to be catchet from game component, to update parent
     *           color.
     */
    colorPick: function(event)
    {
      this.$emit('colorPick', this.dynamicColor);
    },
    
    nameUpdate: function()
    {
      name = this.name;
      this.$parent.updateField();
    },

    /**
     * reInitField function called on input change for rows or columns numbers.
     *             Reinitilize the field and update the view.
     */
    reInitField: function()
    {
      // field is min rows = 4 for rendering purposes
      if (this.rowsBlock > this.rows - 3)
      { this.rowsBlock = this.rows - 3 }
      init(this.rows, this.cols, this.rowsBlock, this.colsBlock);
      this.$parent.updateField();
    }
  }
});