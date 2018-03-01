/**
 * To add an element to the navbar, just insert the game in this list.
 * Also, define dimension and color of the .svg in the CSS for the
 * '#game-name-icon' element id.
 */
var navData = {
  asciiGames: [
    {
      key: 0,
      name: 'ascii-tetris',
      img: '005-shapes-3.svg'
    },
    {
      key: 1,
      name: 'ascii-blackjack',
      img: '003-cards.svg'
    }
  ]
};

// Define navbar link component
Vue.component('ascii-nav-link', {
  props: ['game'],
  template: '' +
  '    <div class="nav-link active">' +
  '      <router-link :to="`/` + game.name">' +
  '        <span class="nav-icon">' +
  '          <img :id="game.name + `-icon`" class="svg" :src="`./assets/icons/` + game.img"></img>' +
  '        </span> ' +
  '        <p>{{ game.name }}</p>' +
  '      </router-link>' +
  '    </div>'
});

// Define navbar component
Vue.component('ascii-nav', {
  template: '' +
  '  <div class="navbar">' +
  '    <ascii-nav-link' +
  '      v-for="asciiGame in asciiGames"' +
  '      v-bind:game="asciiGame"' +
  '      v-bind:key="asciiGame.key">' +
  '    </ascii-nav-link>' +
  '  </div>',
  data: function()
  {
    return navData;
  }
});
