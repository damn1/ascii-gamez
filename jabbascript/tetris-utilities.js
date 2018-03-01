const DEFAULT_COLOR = '#00aa00';
const PIXEL_PROBABILITY = 0.6;
const X = 0;
const Y = 1;
// field constants:
const MIN_ROW = 10;
const MIN_COL = 10;
// pieces constants:
const DEFAULT_ROW_B = 3;
const DEFAULT_COL_B = 3;
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
var name = DEFAULT_NAME;

// boolean matrices for field, block, next block
var field_mat = [];
var next_block  = [];
var curr_block  = [];
// (X,Y) position container
var curr_pos = [];
// ruler variable for falling blocks
var playing = false;
// header of the field
var fieldTitle = ' T E T R I S';
var score = 0;
var blocks_counter = 0;
// backup position
var curr_pos_back = [-1, -1];

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

/**
 * fallingBlock gravity function to move current block down.
 *
 * @return true if the block has been moved, false if the move failed and the
 *         block needs to be stopped
 */
var fallingBlock = function() {
  curr_pos_back[X] = curr_pos[X];
  curr_pos_back[Y] = curr_pos[Y];
  move(DOWN, curr_pos, curr_block);
  if (curr_pos_back[Y] !== curr_pos[Y])
  { return true; }
  else
  {
    return false;
    curr_pos_back = [-1, -1];
  }
}

/**
 * stepOver function to manage passing from one block to the next.
 */
var stepOver = function()
{
  if (playing)
  {
    var falling = fallingBlock();
    appMain.$refs.asciiTetrisComponent.updateField();
    if (!falling)
    {
      var clean = cleanField();
      adjustAfterClean(clean);
      curr_block = next_block;
      blocks_counter++;
      next_block = genBlock();
      curr_pos[X] = spawn(curr_block);
      curr_pos[Y] = 0;
      if (curr_pos[X] > -1)
      { score += scoreBlock(curr_block); }
      else
      { 
        playing = false;
        fieldTitle = 'You lost... bye';
      }
      appMain.$refs.asciiTetrisComponent.updateField();
    }
  }
}

/**
 * toStringField method to build the field as a string starting from the field
 *               as a matrix.
 *
 * @return the string with the field, formatted
 */
function toStringField()
{
  var distance = '   ';
  for (var c = 0; c < curr_block[0].length; c++)
  { distance += '  '; }

  var field_str = '  ┌─';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '─┐  \n';
  field_str += ' *│┌';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '┐│* ';
  field_str += '    Player    ' + (distance + name).slice(-distance.length) + '\n';

  // title row:
  field_str += ' *││';

  if (Math.ceil(fieldTitle.length / 2) > field_mat[0].length)
  {
    fieldTitle = ' ';
  }
  if (fieldTitle.length % 2 == 1)
  { fieldTitle = ' ' + fieldTitle; } // make length even
  // find starting point based on length of the field
  var startingAt = 0;
  var surplus = (field_mat[0].length - (fieldTitle.length / 2));
  startingAt = Math.floor(surplus / 2)

  for (var c = 0; c < field_mat[0].length; c++)
  {
    field_str += (c == startingAt) ? fieldTitle : '  ';
    if (c == startingAt)
    { c += (fieldTitle.length / 2 - 1); } // -1 because of c++
  }
  field_str += '││* \n'; //◣◢ maybe this in place of **

  field_str += ' *│├';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '┤│* ';
  field_str += '    Score     ' + (distance + score).slice(-distance.length) + '\n';

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
    { field_str += '    Blocks    ' + (distance + blocks_counter).slice(-distance.length) + '\n'; }
    else if (printingNext)
    {
      if (counterRowNext == (Math.floor(next_block.length / 2 - 0.1)))
      { field_str += '    Next         '; }
      else
      { field_str += '                 '; }
      field_str = printBlockRow(counterRowNext, next_block, field_str);
      field_str += '\n';
      counterRowNext++;
      if (counterRowNext >= next_block.length)
      { printingNext = false; }
    } else if (r == curr_block.length + 4)
    {
      /* qui si può aggiungere qualcosa all'interfaccia. */
      // in tal caso bisognerebbe incrementare il numero minimo di righe.
      field_str += '\t\n';
    }
    else
    { field_str += '\n'; }
  }
  field_str += '──┴┴';
  for (var c = 0; c < field_mat[0].length; c++)
  { field_str += '──'; }
  field_str += '┴┴──\n////////';
  for (var c = 0; c < field_mat[0].length; c++)
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
  for(var i = 0; i < curr_block.length; i++)
  {
    var row = new Array();
    for(var j = 0; j < curr_block[0].length; j++)
    {
      row.push(false);
    }
    block.push(row);
  }
  var first = Math.floor(Math.random() * curr_block.length * curr_block[0].length);
  var counter = 0;
  for (var i = 0; i < curr_block.length; i++)
  {
    for (var j = 0; j < curr_block[0].length; j++)
    {
      if (first == counter)
      { block[i][j] = true; }
      counter++;
    }
  }
  for (var i = 0; i < curr_block.length; i++)
  {
    for (var j = 0; j < curr_block[0].length; j++)
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
      if (block.length <= 1)
      { break; }
      if (block[row + 1][col])
      { return true; }
      break;
    case curr_block.length - 1:
      if (block[row - 1][col])
      { return true; }
      break;
    default:
      if (block[row + 1][col] || block[row - 1][col])
      { return true; }
  }
  switch (col) {
    case 0:
      if (block[row].length <= 1)
      { break; }
      if (block[row][col + 1])
      { return true; }
      break;
    case curr_block[0].length - 1:
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
  for (var pos_x = 0; pos_x <= field_mat[0].length - curr_block[0].length; pos_x++) {
    // count free cells from pos_x
    // if ok, [pos_x][0] will be high left corner of the NxM free space
    var freeCount = 0;
    for (var x = pos_x; x < pos_x + curr_block[0].length; x++)
    {
      for (var y = 0; y < curr_block.length; y++)
      {
        if (field_mat[y][x] == false)
        { freeCount++; }
      }
    }

    if (freeCount == block[0].length * block.length)
    {
      for (var x = pos_x; x < pos_x + curr_block[0].length; x++)
      {
        for (var y = 0; y < curr_block.length; y++)
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
 *
 */
function isBlankCol(col, block)
{
  for (var row = 0; row < block.length; row++)
  {
    if (block[row][col])
    { return false; }
  }
  return true;
}


/**
 *
 */
function isBlankRow(row, block)
{
  for (var col = 0; col < block[0].length; col++)
  {
    if (block[row][col])
    { return false; }
  }
  return true;
}


/**
 * moveable function to check if there is enough space in the field to move a
 *          block in a certain direction.
 *
 * @param moveChar the kind of move
 * @param block the block to move
 * @return true if the move can be done
 */
function moveable(move, block)
{
  switch (move)
  {
    case LEFT:
      if (curr_pos[X] > 0)
      { return true; }
      if (isBlankCol(-curr_pos[X], block))
      { return true; }
      return false;
    case RIGHT:
      if (curr_pos[X] < field_mat[0].length - block[0].length)
      { return true; }
      if (isBlankCol(field_mat[0].length - curr_pos[X] - 1, block))
      { return true; }
      return false;
    case UP:
      if (curr_pos[Y] > 0)
      { return true; }
      if (isBlankRow(-curr_pos[Y], block))
      { return true; }
      return false;
    case DOWN:
      if (curr_pos[Y] < field_mat.length - block.length)
      { return true; }
      if (isBlankRow(field_mat.length - curr_pos[Y] - 1, block))
      { return true; }
      return false;
    default:
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
function move(move, pos_xy, block)
{
  var counterMoveable;
  switch (move)
  {
    case LEFT: // **************************************************************
      if (!moveable(LEFT, block)) 
      { break; }

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
      if (!moveable(UP, block)) 
      { break; }

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
      if (!moveable(DOWN, block)) 
      { break; }

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
      if (!moveable(RIGHT, block)) 
      { break; }

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
  curr_block = block;
  return true;
}

/**
 * scoreBlock function to count cells in a block.
 *
 * @param block the block to compute the score of
 * @return the integer number of the 'true' cells in the block
 */
function scoreBlock(block)
{
  var cellCount = 0;
  for (var r = 0; r < block.length; r++)
  {
    for (var c = 0; c < block[0].length; c++)
    {
      if (block[r][c])
      { cellCount++; }
    }
  }
  return cellCount;
}

/**
 * cleanField function to clean field after a move: clean filled rows.
 *
 * @return an array containing the indices of the rows that are completed and
 *         have been cleaned
 */
function cleanField()
{
  var rowsToClean = []
  for (var row = field_mat.length - 1; row >= 0; row--)
  {
    var cellCounter = 0;
    for (var col = 0; col < field_mat[row].length; col++)
    {
      if (field_mat[row][col] == true)
      { cellCounter++; }
    }

    if (cellCounter == field_mat[row].length) // row to clean
    {
      rowsToClean.push(row);
      for (var col = 0; col < field_mat[row].length; col++) {
        field_mat[row][col] = false;
      }
    }
  }
  return rowsToClean;
}

/**
 * adjustAfterClean function to adjust the field after some rows have been
 *                  cleaned. Moves the blocks above the empty lines down.
 *
 * @param rowsClean the array returned from cleanField() function.
 */
function adjustAfterClean(rowsClean)
{
  if (rowsClean.length <= 0)
  { return; }

  for (var r = 0; r < rowsClean.length; r++)
  {
    score += (r + 1) * field_mat[0].length;
    for (var rowC = rowsClean[r]; rowC >= 0; rowC--)
    {
      for (var c = 0; c < field_mat[rowC].length; c++)
      {
        if (rowC > 0)
        { field_mat[rowC][c] = field_mat[rowC - 1][c]; }
        else
        { field_mat[rowC][c] = false; }
      }
    }

    // update rows cleaned that have moved below
    for (var r1 = r + 1; r1 < rowsClean.length; r1++)
    { rowsClean[r1] = rowsClean[r1] + 1; }
  }
}
