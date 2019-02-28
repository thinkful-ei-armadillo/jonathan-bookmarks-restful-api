'use strict';

const BookmarksService = {

  getAllBookmarks(knex) {
    return knex
      .select('*')
      .from('bookmarks');
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('bookmarks')
      .where({ id })
      .first();
  },

  addItem(knex, item) {
    return knex
      .insert(item)
      .into('bookmarks')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  deleteItem(knex, id) {
    return knex
      .select('*')
      .from('bookmarks')
      .where({ id })
      .delete();
  },

  updateItem(knex, id, newItem) {
    return knex
      .select('*')
      .from('bookmarks')
      .where({ id })
      .update({
        title: newItem.title,
        url: newItem.url,
        description: newItem.description,
        rating: newItem.rating
      }, ['title', 'url', 'description', 'rating']);
  }
};

module.exports = BookmarksService;