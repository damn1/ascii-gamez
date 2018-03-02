//var appMain = new Vue({
//  el: '#app-main'
//})

const AsciiBlackjackComponent = { template: '<div style="color: #666; margin-bottom: 30px;">lol nope sorry</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
  { path: '/ascii-tetris', component: AsciiTetrisComponent },
  { path: '/ascii-blackjack', component: AsciiBlackjackComponent }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here.
const router = new VueRouter({
  routes // short for `routes: routes`
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const appMain = new Vue({
  router
}).$mount('#app-main')

// Now the app has started!
