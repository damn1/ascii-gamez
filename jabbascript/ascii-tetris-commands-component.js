/**
 * commandsData object containing variables binded to ui inputs.
 */
var commandsData = {
  tetrisIntervalHandle: -1,
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
  '      <div class="row overlap-input-container">' +
  '        <div class="col-sm-12 label-container">' +
  '          <pre class="command-label start">{{ start }}</pre>' +
  '        </div>' +
  '        <div class="input-container">' +
  '          <input type="text" v-on:keyup="keymonitor"  v-on:click="startMatch">' +
  '        </div>' +
  '      </div>' +
  '      <div class="row overlap-input-container">' +
  '        <div class="col-sm-12 label-container">' +
  '          <pre class="command-label start">RESET</pre>' +
  '        </div>' +
  '        <div class="input-container">' +
  '          <input type="text" v-on:keyup="keymonitor"  v-on:click="reset">' +
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
        fieldTitle = 'playing';
        curr_block = next_block;
        next_block = genBlock();
        curr_pos[X] = spawn(curr_block);
        curr_pos[Y] = 0;
        if (curr_pos[X] > -1)
        {
          score += scoreBlock(curr_block);
          blocks_counter++;
        }
        this.start = 'keep focus to give inputs';
        this.$parent.updateField();
        this.tetrisIntervalHandle = window.setInterval(stepOver, 1000);
      }
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

    reset: function()
    {
      this.start = 'START';
      playing = false;
      score = 0;
      blocks_counter = 0;
      curr_pos_back = [-1, -1];
      fieldTitle = 'reset';
      window.clearInterval(this.tetrisIntervalHandle)
      this.reInitField();
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