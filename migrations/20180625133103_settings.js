/* eslint-disable */
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('settings', function(table) {
      table.increments()
      table.text('name')
      table.text('value')
      table.boolean('is_deleted')
    }).then(() => {
      return knex('settings').insert({
        name: 'casparcg',
        value: ''
      })
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('settings'),
  ]);
};
