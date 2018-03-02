/**
 * tetris_data object containing data to bind in the vue component
 */
var tetris_data = {
  intro: '' +
  '██████  ██████  ██████  ██████  ██  ██████\n' +
  '  ██    ████      ██    ██  ██  ██  ██    \n' +
  '  ██    ██        ██    ████    ██      ██\n' +
  '  ██    ██████    ██    ██  ██  ██  ██████\n' +
  '            damn1-ascii-tetris            \n',
  field_str_vue: toStringField(),
  // dynamic styling element, updated from events of child components
  dynamicColor: {
    color: DEFAULT_COLOR
  },
  score: 0,
  blocks_counter: 0,
}


/**
 * asciiTetrisComponent Vue.js component that hold the tetris application.
 */ 
const AsciiTetrisComponent = Vue.component('ascii-tetris', {
  template: '' +
  '  <div id="app-tetris"> ' +
  '    <div class="container"> ' +
  '    <div class="row"> ' +
  '      <div class="game-intro"> ' +
  '        <pre v-bind:style="dynamicColor">{{ intro }}</pre> ' +
  '      </div> ' +
  '    </div> ' +
  '    <div class="row"> ' +
  '      <div class="game-intro col-sm-8"> ' +
  '        <pre  v-bind:style="dynamicColor">{{ field_str_vue }}</pre> ' +
  '      </div> ' +
  '      <div class="col-sm-4"> ' +
  '        <ascii-tetris-commands @colorPick="onColorPickTetrisCommands"></ascii-tetris-commands>' +
  '      </div> ' +
  '    </div> ' +
  '    </div> ' +
  '  </div> ',
  components:
  {
    AsciiTetrisCommandsComponent
  },
  data: function()
  {
    return tetris_data;
  },
  methods:
  {
    /**
     * updateField simple function to update reactive element field.
     */
    updateField: function()
    {
      this.field_str_vue = toStringField();
    },

    /**
     * onColorPickTetrisCommands is invoked from an event emitted from child
     *                           <ascii-tetris-commands>, sets the color to the
     *                           chosen one from that component.
     *
     * @param childDynStyle the object containing dynamic styling
     */
    onColorPickTetrisCommands(childDynStyle)
    {
      this.dynamicColor = childDynStyle;
    }
  }
});
