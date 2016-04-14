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
const Header = require('./controller/header')
const Menu = require('./controller/menu')
const Add = require('./controller/add')
const Graphic = require('./controller/graphic/controller')

m.mount(document.getElementById('header'), Header)
m.mount(document.getElementById('menu'), Menu)

m.route(document.getElementById('content'), '/', {
    '/': {},
    '/add': Add,
    '/graphic/:id': Graphic,
});
