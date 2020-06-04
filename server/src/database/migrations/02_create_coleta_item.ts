import Knex from 'knex';

export async function up(knex : Knex){
    return await knex.schema.createTable('coleta_item',table => {
        table.increments('id').primary();
        
        table.integer('coleta_id',11).unsigned()
        .notNullable()
        .references('id')
        .inTable('coleta');
        
        table.integer('item_id',11).unsigned()
        .notNullable()
        .references('id')
        .inTable('item')
    });
}

export async function down(knex : Knex){
    return knex.schema.dropTable('coleta_item');
}