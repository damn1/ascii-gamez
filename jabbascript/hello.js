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

const t_clock = '↻';
const t_cntcl  = '↺';
const s_right = '→';
const s_left  = '←';
const s_down  = '↓';

var playing = false;
var name = 'damn';
var score = '0';
var blocks_counter = '0';


/**
 * init initialization function to create field and first block.
 */
function init()
{
  // init field to void
  for(var i = 0; i < MIN_ROW; i++)
  {
    var row = new Array();
    for(var j = 0; j < MIN_COL; j++)
    { row.push(false); }
    field_mat.push(row);
  }

  // init next block to void
  for(var i = 0; i < MAX_ROW_B; i++)
  {
    var row = new Array();
    for(var j = 0; j < MAX_COL_B; j++)
    { row.push(false); }
    next_mat.push(row);
    curr_mat.push(row);
  }
  curr_pos.push(0);
  curr_pos.push(0);
}


/**
 * toStringField method to build the field as a string starting from the field
 *               as a matrix.
 *
 * @return the string with the field, formatted
 */
function toStringField()
{
  var field_str = '  ┌─';
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
      field_str = printBlockRow(counterRowNext, next_mat, field_str);
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
  return field_str;
}


/**
 * printBlockRow helper method to print net block by rows into the field.
 *
 * @param row the index of the row to print
 * @param block bool matrix with the block to print
 * @field_str the string where to print the row
 * @return the modified string
 */
function printBlockRow(row, block, field_str)
{
  for (var c = 0; c < block[0].length; c++)
  { field_str += block[row][c] ? '██' : ' .'; }
  return field_str;
}


/**
 * genBlock the method to generate random blocks.
 *
 * @return the bool matrix representing the block
 */
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
}


/**
 * adiacency method to tell if in a cell a pixel can be created.
 *
 * @param row index of the cell to analyze in the block
 * @param col index of the cell to analyze in the block
 * @param block the bool matrix with the block
 * @return true if block[row][col] could be filled
 */
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

/**
 * spawn function to put blocks in the field.
 *
 * @param block the block to be spawned
 * @return the high-left corner index in the field where the block has been
 *         spawned, -1 if there where no free space to spawn
 */
function spawn(block)
{
  // check for NxM free space starting from the left
  for (var pos_x = 0; pos_x <= field_mat[0].length - MAX_COL_B; pos_x++) {
    // count free cells from pos_x
    // if ok, [pos_x][0] will be high left corner of the NxM free space
    var freeCount = 0;
    for (var x = pos_x; x < pos_x + MAX_COL_B; x++)
    {
      for (var y = 0; y < MAX_ROW_B; y++)
      {
        if (field_mat[y][x] == false)
        { freeCount++; }
      }
    }

    if (freeCount == block[0].length * block.length)
    {
      for (var x = pos_x; x < pos_x + MAX_COL_B; x++)
      {
        for (var y = 0; y < MAX_ROW_B; y++)
        { field_mat[y][x] = block[y][x - pos_x]; }
      }
      return pos_x;
    }
  }
  return -1
}


/**
 * rotateBlock function to rotate a block
 *
 * @param block the block bool[][] to rotate
 * @param clockwise rotation direction, true if clockwise
 * @return the rotated block
 */
function rotateBlock(block, clockwise)
{
  var newBlock = [];
  for(var i = 0; i < block[0].length; i++)
  {
    var row = new Array();
    for(var j = 0; j < block.length; j++)
    { row.push(false); }
    newBlock.push(row);
  }

  if (clockwise)
  {
    for (var col = 0; col < block[0].length; col++)
    {
      var rowNewB = 0
      for (var rowB = block.length - 1; rowB >= 0; rowB--)
      { 
        newBlock[col][rowNewB] = block[rowB][col];
        rowNewB++;
      }
    }
  }
  else
  {
    for (var row = 0; row < block.length; row++)
    {
      var colNewB = 0;
      for (var colB = block[0].length - 1; colB >= 0; colB--)
      {
        newBlock[colNewB][row] = block[row][colB];
        colNewB++;
      }
    }
  }
  return newBlock;
}

/**
 * substitute method to check if a rotated block is valid, and substitute the
 *            previous one.
 *
 * @param pos_xy starting coordinates of block
 * @param block the block to be substituted
 * @param rotatedBlock the block which has to substitute the other
 * @return true if the substitution has been done
 */
function substitute(pos_xy, block, rotatedBlock) {
  // remove block
  for (var row = 0; row < block.length; row++)
  {
    for (var col = 0; col < block[0].length; col++)
    {
      if (block[row][col] == true)
      { field_mat[pos_xy[Y] + row][pos_xy[X] + col] = false; }
    }
  }
  // try to place new block
  var counterMoveable = 0;
  for (var row = 0; row < rotatedBlock.length; row++)
  {
    for (var col = 0; col < rotatedBlock[0].length; col++)
    {
      if (rotatedBlock[row][col] == true)
      {
        if (field_mat[pos_xy[Y] + row][pos_xy[X] + col] == false)
        { counterMoveable++; }
      }
      else
      { counterMoveable++; }
    }
  }
  if (counterMoveable == rotatedBlock.length * rotatedBlock[0].length)
  {
    for (var row = 0; row < rotatedBlock.length; row++)
    {
      for (var col = 0; col < rotatedBlock[0].length; col++)
      {
        if (rotatedBlock[row][col] == true)
        { field_mat[pos_xy[1] + row][pos_xy[0] + col] = rotatedBlock[row][col]; }
      }
    }
    return true;
  }
  else
  {
    for (var row = 0; row < rotatedBlock.length; row++)
    {
      for (var col = 0; col < rotatedBlock[0].length; col++)
      {
        if (block[row][col] == true)
        { field_mat[pos_xy[Y] + row][pos_xy[X] + col] = block[row][col]; }
      }
    }
    return false;
  }
}

/**
 * move
 *
 * @param moveChar the kind of move to be done
 * @param pos_xy high-left corner coordinates of the starting block
 * @param block the block to be moved
 * @return the modified block (e.g. if rotated)
 */
function move(moveChar, pos_xy, block)
{
  var counterMoveable;
  switch (moveChar)
  {
    case LEFT: // **************************************************************
      counterMoveable = 0;
      for (var row = 0; row < block.length; row++)
      {
        var first = true;
        for (var col = 0; col < block[0].length; col++)
        {
          if (block[row][col] == true && first)
          {
            first = false;

            var rowPossibleShift = true;
            if (field_mat[pos_xy[Y] + row][pos_xy[X] + col - 1] == true)
            { rowPossibleShift = false; }

            for (var c1 = col; c1 < block[0].length -1; c1++ )
            {
              if (block[row][c1] == false && block[row][c1+1] == true)
              {
                if (field_mat[pos_xy[Y] + row][pos_xy[X] + c1] == true)
                { rowPossibleShift = false; }
              }
            }

            if (rowPossibleShift)
            { counterMoveable++; }
          }
        }
        if (first) {
          counterMoveable++;
        }
      }
      if (counterMoveable == block.length)
      {
        for (var row = 0; row < block.length; row++)
        {
          for (var col = 0; col < block[0].length; col++)
          {
            if (block[row][col] == true)
            {
              field_mat[pos_xy[Y] + row][pos_xy[X] + col - 1] = true;
              field_mat[pos_xy[Y] + row][pos_xy[X] + col] = false;
            }
          }
        }
        pos_xy[X]--;
      }
      else
      { return false; }
      break;

    case UP: // ****************************************************************
      counterMoveable = 0;
      for (var col = block[0].length - 1; col >= 0; col--)
      {
        var first = true;
        for (var row = 0; row < block.length; row++)
        {
          if (block[row][col] == true && first)
          {
            first = false;

            var colPossibleShift = true;
            if (field_mat[pos_xy[Y] + row - 1][pos_xy[X] + col] == true)
            { colPossibleShift = false; }

            for (var r1 = row; r1 < block.length -1; r1++ )
            {
              if (block[r1][col] == false && block[r1+1][col] == true)
              {
                if (field_mat[pos_xy[Y] + r1][pos_xy[X] + col] == true)
                { colPossibleShift = false; }
              }
            }

            if (colPossibleShift)
            { counterMoveable++; }
          }
        }
        if (first) {
          counterMoveable++;
        }
      }
      if (counterMoveable == block[0].length)
      {
        for (var col = block[0].length - 1; col >= 0; col--)
        {
          for (var row = 0; row < block.length; row++)
          {
            if (block[row][col] == true)
            {
              field_mat[pos_xy[Y] + row - 1][pos_xy[X] + col] = true;
              field_mat[pos_xy[Y] + row][pos_xy[X] + col] = false;
            }
          }
        }
        pos_xy[Y]--;
      }
      else
      { return false; }
      break;

    case DOWN: // **************************************************************
      counterMoveable = 0;
      for (var col = block[0].length - 1; col >= 0; col--)
      {
        var first = true;
        for (var row = block.length - 1; row >= 0; row--)
        {
          if (block[row][col] == true && first)
          {
            first = false;

            var colPossibleShift = true;
            if (field_mat[pos_xy[Y] + row + 1][pos_xy[X] + col] == true)
            { colPossibleShift = false; }

            for (var r1 = row; r1 > 0; r1-- )
            {
              if (block[r1][col] == false && block[r1-1][col] == true)
              {
                if (field_mat[pos_xy[Y] + r1][pos_xy[X] + col] == true)
                { colPossibleShift = false; }
              }
            }

            if (colPossibleShift)
            { counterMoveable++; }
          }
        }
        if (first)
        { counterMoveable++; }
      }
      if (counterMoveable == block[0].length)
      {
        for (var col = block[0].length - 1; col >= 0; col--)
        {
          for (var row = block.length - 1; row >= 0; row--)
          {
            if (block[row][col] == true)
            {
              field_mat[pos_xy[Y] + row + 1][pos_xy[X] + col] = true;
              field_mat[pos_xy[Y] + row][pos_xy[X] + col] = false;
            }
          }
        }
        pos_xy[Y]++;
      }
      else
      { return false; }
      break;

    case RIGHT: // *************************************************************
      counterMoveable = 0;
      for (var row = 0; row < block.length; row++) {
        var first = true;
        for (var col = block[0].length - 1; col >= 0; col--) {
          if (block[row][col] == true && first)
          {
            first = false;

            var rowPossibleShift = true;
            if (field_mat[pos_xy[Y] + row][pos_xy[X] + col + 1] == true)
            { rowPossibleShift = false; }

            for (var c1 = col; c1 > 0; c1-- )
            {
              if (block[row][c1] == false && block[row][c1-1] == true)
              {
                if (field_mat[pos_xy[Y] + row][pos_xy[X] + c1] == true)
                { rowPossibleShift = false; }
              }
            }

            if (rowPossibleShift)
            { counterMoveable++; }
          }
        }
        if (first) {
          counterMoveable++;
        }
      }
      if (counterMoveable == block.length)
      {
        for (var row = 0; row < block.length; row++)
        {
          for (var col = block[0].length - 1; col >= 0; col--)
          {
            if (block[row][col] == true)
            {
              field_mat[pos_xy[Y] + row][pos_xy[X] + col + 1] = true;
              field_mat[pos_xy[Y] + row][pos_xy[X] + col] = false;
            }
          }
        }
        pos_xy[X]++;
      }
      else
      { return false; }
      break;

    case CLOCK: // *************************************************************
      var rotatedBlock = rotateBlock(block, true);
      var resultOk = substitute(pos_xy, block, rotatedBlock);
      if (resultOk)
      {
        block = [];
        for (var i = 0; i < rotatedBlock.length; i++)
        { block.push(rotatedBlock[i]); }
        break;
      }
      else
      { return false; }
    case CNTCL: // *************************************************************
      var rotatedBlock = rotateBlock(block, false);
      var resultOk = substitute(pos_xy, block, rotatedBlock);
      if (resultOk)
      {
        block = [];
        for (var i = 0; i < rotatedBlock.length; i++)
        { block.push(rotatedBlock[i]); }
        break;
      }
      else
      { return false; }
    case 'o': 
      // non faccio niente, il pezzo viene fermato dove è.
      break;
    default:
      console.log('minchione');
  }
  curr_mat = block;
  return true;
}

init();
var curr_pos_back = [-1, -1];

var fallingBlock = function() {
  if (curr_pos_back[X] !== curr_pos[X] ||
      curr_pos_back[Y] !== curr_pos[Y])
  {
    curr_pos_back[X] = curr_pos[X];
    curr_pos_back[Y] = curr_pos[Y];
    move(DOWN, curr_pos, curr_mat); 
  }
  else
  {
    console.log('fixed!!');
    curr_pos_back = [-1, -1];
  }
}


/**
 * Vue.js application to rule the game.
 */ 
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
    field_str_vue: toStringField(),
    commands: '' +
    '┌───┬───┐\n' +
    '│ ' + t_cntcl + ' │ ' + t_clock + ' │\n' +
    '└───┴───┘\n' +
    '   ┌───┬───┬───┐\n' +
    '   │ ' + s_left + ' │ ' + s_down + ' │ ' + s_right + ' │\n' +
    '   └───┴───┴───┘\n',

    // pieces random geneation:
    score: 0,
    blocks_counter: 0,
    name: ''
  },

  methods: {
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
      next_mat = genBlock();
      curr_mat = next_mat;
      next_mat = genBlock();
      curr_pos[X] = spawn(curr_mat);
      curr_pos[Y] = 0;
      this.field_str_vue = toStringField();
    },
    updateField: function()
    {
      this.field_str_vue = toStringField();
    }
  }
});

window.setInterval(function(){
  fallingBlock();
  app.updateField();
}, 1000);
