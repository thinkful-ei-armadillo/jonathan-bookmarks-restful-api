'use strict';

const path = require('path');
const express = require('express');
const bookmarksRouter = express.Router();
const logger = require('../logger');
const BookmarksService = require('./BookmarksService');
const bodyParser = express.json();
const xss = require('xss');
const uuid = require('uuid/v4');


bookmarksRouter
  .route('/')

  // get all bookmarks
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService
      .getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })

  // add a bookmark
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, url, description, rating } = req.body;
    const newItem = {
      title,
      url,
      description,
      rating
    };

    BookmarksService
      .addItem(knexInstance, newItem)
      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl))
          .json(bookmark);
      })
      .catch(next);
  });

bookmarksRouter.route('/:id')
  
  // get a single bookmark
  .get((req, res, next) => {
    BookmarksService
      .getById(req.app.get('db'), req.params.id)
      .then(bookmark => {
        res
          .location(path.posix.join(req.originalUrl))
          .json({
            id: bookmark.id,
            title: xss(bookmark.title),
            url: xss(bookmark.url),
            description: xss(bookmark.description),
            rating: bookmark.rating
          });
      })
      .catch(next);
  })

  // delete a bookmark
  .delete((req, res, next) => {
    const itemId = req.params.id;
    BookmarksService
      .deleteItem(req.app.get('db'), itemId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const update = { title, url, description, rating };
    BookmarksService
      .updateItem(req.app.get('db'), req.params.id, update)
      
      .then(bookmark => {
        res.status(204);
        res.location(path.posix.join(req.originalUrl));
        res.json(bookmark);
      })
      
      .catch(next);
  });

module.exports = bookmarksRouter;
