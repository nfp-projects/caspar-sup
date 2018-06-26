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

require('../socket')
require('./store')

const m = require('mithril')
const Header = require('./header')
const Menu = require('./menu')

const Add = require('./add/module')
const Graphic = require('./graphic/module')
const Dagskra = require('./dagskra/module')

m.mount(document.getElementById('header'), Header)
m.mount(document.getElementById('menu'), Menu)

m.route(document.getElementById('content'), '/', {
    '/': Dagskra,
    '/add': Add,
    '/graphic/:id': Graphic,
})
