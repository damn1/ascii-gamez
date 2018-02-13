const PIXEL_PROBABILITY = 0.6;
// field constants:
const MIN_ROW = 6;
const MIN_COL = 8;
// pieces constants:
const MAX_ROW_B = 3;
const MAX_COL_B = 3;
// boolean matrices for field and next
var field_mat = [];
var next_mat = [];

const t_clock = '↻';
const t_anti  = '↺';
const s_right = '→';
const s_left  = '←';
const s_down  = '↓';

var playing = false;

// init field
for(var i = 0; i < MIN_ROW; i++)
{
  var row = new Array();
  for(var j = 0; j < MIN_COL; j++)
  {
    row.push(false);
  }
  field_mat.push(row);
}

// init next block
for(var i = 0; i < MAX_ROW_B; i++)
{
  var row = new Array();
  for(var j = 0; j < MAX_COL_B; j++)
  {
    row.push(false);
  }
  next_mat.push(row);
}

var field_str = '';
var name = 'damn';
var score = '0';
var blocks_counter = '0';

/**
 * toStringField method to build the field as a string starting from the field
 *               as a matrix. 
 */
function toStringField()
{
  field_str = '  ┌─';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '─┐  \n';
  field_str += ' *│┌';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '┐│* ';
  field_str += '    Player    ' + ('         ' + name).slice(-9) + '\n';

  field_str += ' *││';
  for (var c = 0; c < field_mat[0].length; c++)
  {
    field_str += (c == field_mat[0].length / 2 - 4) ? 'D4MN T E T R I S' : '  ';
    if (c == field_mat[0].length / 2 - 4)
    { c += 7; }
  }
  field_str += '││* \n'; //◣◢ maybe this in place of **

  field_str += ' *│├';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '┤│* ';
  field_str += '    Score         ' + ('     ' + score).slice(-5) + '\n';

  var printingNext = false;
  var counterRowNext = 0;
  for (var r = 0; r < field_mat.length; r++)
  { //CIAO DAMI
    field_str += ' *││';
    for (var c = 0; c < field_mat[r].length; c++)
    { field_str += field_mat[r][c] ? '██' : ' .'; }
    field_str += '││* ';
    if (r == 3) 
    { printingNext = true; }
    if (r == 1)
    { field_str += '    Blocks        ' + ('     ' + blocks_counter).slice(-5) + '\n'; }
    else if (printingNext)
    {
      if (counterRowNext == (Math.floor(next_mat[0].length / 2 - 0.1)))
      { field_str += '    Next         '; }
      else
      { field_str += '                 '; }
      printBlockRow(counterRowNext, next_mat);
      field_str += '\n';
      counterRowNext++;
      if (counterRowNext >= MAX_ROW_B)
      { printingNext = false; }
    } else if (r == MAX_ROW_B + 4)
    {
      /* qui si può aggiungere qualcosa all'interfaccia. */
      // in tal caso bisognerebbe incrementare il numero minimo di righe.
      field_str += '\t';
    }
    else
    { field_str += '\n'; }
  }
  field_str += '──┴┴';
  for (var c = 0; c < field_mat[1].length; c++)
  { field_str += '──'; }
  field_str += '┴┴──\n////////';
  for (var c = 0; c < field_mat[1].length; c++)
  { field_str += '//'; }
  field_str += '\n';
  console.log(field_str);
}

function genBlock()
{
  var block = [];
  for(var i = 0; i < MAX_ROW_B; i++)
  {
    var row = new Array();
    for(var j = 0; j < MAX_COL_B; j++)
    {
      row.push(false);
    }
    block.push(row);
  }
  console.log(block);
  var first = Math.floor(Math.random() * MAX_ROW_B * MAX_COL_B);
  console.log(Math.random());
  console.log(first);
  var counter = 0;
  for (var i = 0; i < MAX_ROW_B; i++)
  {
    for (var j = 0; j < MAX_COL_B; j++)
    {
      if (first == counter)
      { block[i][j] = true; }
      counter++;
    }
  }
  for (var i = 0; i < MAX_ROW_B; i++)
  {
    for (var j = 0; j < MAX_COL_B; j++)
    {
      if (adiacency(i, j, block))
      {
        if (Math.random() < PIXEL_PROBABILITY)
        { block[i][j] = true; }
      }
    }
  }
  return block;
  console.log(block);
}

function adiacency(row, col, block) {
  switch (row) {
    case 0:
      if (block[row + 1][col])
      { return true; }
      break;
    case MAX_ROW_B - 1:
      if (block[row - 1][col])
      { return true; }
      break;
    default:
      if (block[row + 1][col] || block[row - 1][col])
      { return true; }
  }
  switch (col) {
    case 0:
      if (block[row][col + 1])
      { return true; }
      break;
    case MAX_COL_B - 1:
      if (block[row][col - 1])
      { return true; }
      break;
    default:
      if (block[row][col + 1] || block[row][col - 1])
      { return true; }
  }
  return false;
}

var commands = '' +
    '┌───┬───┐\n' +
    '│ ' + t_anti + ' │ ' + t_clock + ' │\n' +
    '└───┴───┘\n' +
    '   ┌───┬───┬───┐\n' +
    '   │ ' + s_left + ' │ ' + s_down + ' │ ' + s_right + ' │\n' +
    '   └───┴───┴───┘\n';


function printBlockRow(row, block)
{
  for (var c = 0; c < block[0].length; c++)
  { field_str += block[row][c] ? '██' : ' .'; }
}

toStringField();

var app = new Vue({
  el: '#tetris-app',

  data: {
    intro: '' +
    '██████  ██████  ██████  ██████  ██  ██████\n' +
    '  ██    ████      ██    ██  ██  ██  ██    \n' +
    '  ██    ██        ██    ████    ██      ██\n' +
    '  ██    ██████    ██    ██  ██  ██  ██████\n' +
    '            ascii tetris by damn1         \n',
    start: '' +
    '┌─────────────┐\n' +
    '     START     \n' +
    '└─────────────┘\n',
    field_str_vue: field_str,
    commands: commands,
    // pieces random geneation:
    score: 0,
    blocks_counter: 0,
    name: ''
  },

  methods: {
    keymonitor: function(event) {
      console.log(event.key);
      if(event.key == "Enter")
      {
        console.log("enter key was pressed!");
      }
    },
    startMatch: function() {
      // `this` inside methods points to the Vue instance
      playing = true;
      console.log(playing);
      next_mat = genBlock();
      toStringField();
      this.field_str_vue = field_str;
    }
  }
});
