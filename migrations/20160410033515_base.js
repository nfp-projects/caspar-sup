/* eslint-disable */
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('store', function(table) {
      table.increments()
      table.text('name')
      table.text('value')
    }).then(() => {
      return knex('store').insert({
        name: 'content',
        value: '{}'
      })
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('store'),
  ]);
};
