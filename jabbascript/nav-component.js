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
      img: '005-shapes-3.svg',
      attributionAuth: 'Freepik',
      attributionLink: 'https://www.flaticon.com/authors/freepik',
    },
    {
      key: 1,
      name: 'ascii-blackjack',
      img: '003-cards.svg',
      attributionAuth: 'Freepik',
      attributionLink: 'https://www.flaticon.com/authors/freepik',
    }
  ]
};

// A simple div with attributions to author of the icons.
// It's more footer than nav. But here are the data.
// For now icons are all from same author so reduce the element to a div to
// stick into the footer.
Vue.component('icons-attribution', {
  template: '' +
  '  <div class="icons-attribution">' +
  '    <div class="sub-icons-attr">' +
  '      <a href="https://www.flaticon.com/">' +
  '        <img id="flaticonlogo" src="./assets/img/flaticon-logo.png"></img>' +
  '      </a>' +
  '    </div>' +
  '    <div class="sub-icons-attr">' +
  '      <p>' +
  '        games icons by' +
  '        <a :href="asciiGames[0].attributionLink">{{ asciiGames[0].attributionAuth }}</a>' +
  '      </p>' +
  '    </div>' +
  '  </div>',
  data: function()
  {
    return navData;
  }
});

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
