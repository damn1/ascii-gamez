// field constants:
const MIN_ROW = 6;
const MIN_COL = 8;
// pieces constants:
const MAX_ROW_B = 3;
const MAX_COL_B = 3;
// boolean matrices for field and next
var field_mat = [];
var next_mat = [];

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
var score = '200';
var blocks_counter = '23';

/**
 * toStringField Il metodo per stampare il campo di gioco. Non riceve nessun parametro
 * perchè il campo di gioco è globale possiamo accedere in qualunque
 * momento.
 */
function toStringField() {

  field_str += '  ┌─';
  for (var c = 0; c < field_mat[0].length; c++) {
    field_str += '──';
  }
  field_str += '─┐  \n';
  field_str += ' *│┌';
  for (var c = 0; c < field_mat[0].length; c++) {
    field_str += '──';
  }
  field_str += '┐│* ';
  field_str += '\tPlayer\t\t' + name + '\n';

  field_str += ' *││';
  for (var c = 0; c < field_mat[0].length; c++) {
    field_str += (c == field_mat[0].length / 2 - 4) ? 'D4MN T E T R I S' : '  ';
    if (c == field_mat[0].length / 2 - 4) {
      c += 7;
    }
  }
  field_str += '││* \n'; //◣◢ maybe this in place of **

  field_str += ' *│├';
  for (var c = 0; c < field_mat[0].length; c++) {
    field_str += '──';
  }
  field_str += '┤│* ';
  field_str += '\tScore\t\t' + score + '\n';

  var printingNext = false;
  var counterRowNext = 0;
  for (var r = 0; r < field_mat.length; r++) { //CIAO DAMI
    field_str += ' *││';
    for (var c = 0; c < field_mat[r].length; c++) {
      field_str += field_mat[r][c] ? '██' : ' .';
    }
    field_str += '││* ';
    if (r == 3) {
      printingNext = true;
    }
    if (r == 1) {
      field_str += '\tBlocks\t\t' + blocks_counter + '\n';
    } else if (printingNext) {
      if (counterRowNext == (Math.floor(next_mat[0].length / 2 - 0.1))) {
        field_str += '\tNext\t\t';
      } else {
        field_str += '\t\t\t';
      }
      printBlockRow(counterRowNext, next_mat);
      field_str += '\n';
      counterRowNext++;
      if (counterRowNext >= MAX_ROW_B) {
        printingNext = false;
      }
    } else if (r == MAX_ROW_B + 4) {
      /* qui si può aggiungere qualcosa all'interfaccia. */
      // in tal caso bisognerebbe incrementare il numero minimo di righe.
      field_str += '\t';
    } else {
      field_str += '\n';
    }
  }
  field_str += '──┴┴';
  for (var c = 0; c < field_mat[1].length; c++) {
    field_str += '──';
  }
  field_str += '┴┴──\n////////';
  for (var c = 0; c < field_mat[1].length; c++) {
    field_str += '//';
  }
  field_str += '\n';
}


function printBlockRow(row, block) {
  for (var c = 0; c < block[0].length; c++) {
    field_str += block[row][c] ? '██' : ' .';
  }
}

toStringField();

var app = new Vue({
  el: '#tetris-app',

  data: {
    intro: '██████  ██████  ██████  ██████  ██  ██████\n' +
           '  ██    ████      ██    ██  ██  ██  ██    \n' +
           '  ██    ██        ██    ████    ██      ██\n' +
           '  ██    ██████    ██    ██  ██  ██  ██████\n' +
           '         ascii tetris game by damn1       \n',
    field_str: field_str,
    next_str: '',

    // pieces random geneation:
    PIXEL_PROBABILITY: .6,
    score: 0,
    blocks_counter: 0,
    name: ''
  },

  methods: {
    getRows: function() {
      console.log(field_mat);
      //      if (e.keyCode === 13) {
      //      alert('Enter was pressed');
      //    } else if (e.keyCode === 50) {
      //    alert('@ was pressed');
      //    }      
      //    this.log += e.key;
    }
  }
});
