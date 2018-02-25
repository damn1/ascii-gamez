var provvApp = new Vue({
  el: '#provv-app',
  data: {
    intro: '' +
      '██████  ██████  ██████  ██████  ██  ██████\n' +
      '  ██    ████      ██    ██  ██  ██  ██    \n' +
      '  ██    ██        ██    ████    ██      ██\n' +
      '  ██    ██████    ██    ██  ██  ██  ██████\n' +
      '            ascii tetris by damn1         \n',
    start: '' +
      '┌────────────────────────────┐\n' +
      '             START            \n' +
      '└────────────────────────────┘\n',
    commands1: '' +
      '      ┌───┬───┐\n' +
      '      │ ' + t_cntcl + ' │ ' + t_clock + ' │\n' +
      '      └───┴───┘',
    commands2: '' +
      '┌───┬───┬───┐\n' +
      '│ ' + s_left + ' │ ' + s_down + ' │ ' + s_right + ' │\n' +
      '└───┴───┴───┘',
    score: 0,
    blocks_counter: 0,
    name: ''
  }
});