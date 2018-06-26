/* eslint-disable */
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('schedule', function(table) {
      table.increments()
      table.integer('graphic_id').references('graphics.id')
      table.text('values')
      table.integer('sort')
      table.boolean('is_deleted')
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('schedule'),
  ]);
};
