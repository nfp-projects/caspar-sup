/**
 * @license
 * caspar-sup <https://filadelfia.is>
 * Copyright 2015 Jonatan Nilsson <http://jonatan.nilsson.is/>
 *
 * Available under WTFPL License (http://www.wtfpl.net/txt/copying/)
*/

'use strict'

//Add debug components to window. Allows us to play with controls
//in the console. 
window.components = {}

require('./socket')
require('./controller/store')

const m = require('mithril')
const Menu = require('./controller/menu')
const Content = require('./controller/content')

m.mount(document.getElementById('menu'), Menu)

m.route(document.getElementById('content'), '/', {
    '/': {},
    '/content': Content,
});
