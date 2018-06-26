/* eslint-disable */
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('content', function(table) {
      table.increments()
      table.text('graphic')
      table.text('name')
      table.text('html')
      table.text('css')
      table.text('data')
      table.boolean('is_deleted')
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('content'),
  ]);
};
