/* eslint-disable */
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('store'),
    knex.schema.createTable('graphics', function(table) {
      table.increments()
      table.text('name')
      table.text('engine')
      table.text('settings')
      table.boolean('is_deleted')
    }),
    knex.schema.createTable('presets', function(table) {
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
    knex.schema.dropTable('graphics'),
    knex.schema.dropTable('presets'),
  ]);
};
