
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
  Favorites.find({}).populate('comments.author')
            .then((Favorites) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(Favorites)
            }, (err) => next(err)).catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Favorites.create(req.body).then((dish) => {
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.json(dish)
    console.log('Dish Created')
  }, (err) => next(err)).catch((err) => next(err))
})

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403
      res.end('PUT operation is not supported on /Favorites')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.remove({}).then((result) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
      }, (err) => next(err)).catch((err) => next(err))
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOne({user: req.user._id})
        .then((favorites) => {
          if (!favorites) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            return res.json({'exists': false, 'favorites': favorites})
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              return res.json({'exists': false, 'favorites': favorites})
            } else {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              return res.json({'exists': true, 'favorites': favorites})
            }
          }
        }, (err) => next(err))
        .catch((err) => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403
      res.end('POST operation is not supported on /Favorites/' + req.params.dishId)
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
      }, {
        new: true
      }).then((dish) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, (err) => next(err)).catch((err) => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findByIdAndRemove(req.params.dishId).then((result) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
      }, (err) => next(err)).catch((err) => next(err))
    })

favoriteRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
      Favorites.findById(req.params.dishId).populate('comments.author').then((dish) => {
        if (dish != null) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(dish.comments)
        } else {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findById(req.params.dishId).then((dish) => {
        if (dish != null) {
          req.body.author = req.user._id
          dish.comments.push(req.body)
          dish.save().then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, (err) => next(err)).catch((err) => next(err))
        } else {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403
      res.end('PUT operation is not supported on /Favorites/' + req.params.dishId + '/comments')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findById(req.params.dishId).then((dish) => {
        if (dish != null) {
          console.log(dish)
          for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove()
          }
          dish.save().then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, (err) => next(err)).catch((err) => next(err))
        } else {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

favoriteRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
      Favorites.findById(req.params.dishId).populate('comments.author').then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(dish.comments.id(req.params.commentId))
        } else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        } else {
          err = new Error('Comment ' + req.params.commentId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403
      res.end('POST operation is not supported on /Favorites/' + req.params.dishId + '/comments/' + req.params.commentId)
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findById(req.params.dishId).then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
          if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
            err = new Error('You are not authorized to edit this comment')
            err.status = 403
            return next(err)
          }
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating
          }

          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment
          }
          dish.save().then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, (err) => next(err)).catch((err) => next(err))
        } else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        } else {
          err = new Error('Comment ' + req.params.commentId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorites.findById(req.params.dishId).then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
          if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
            err = new Error('You are not authorized to edit this comment')
            err.status = 403
            return next(err)
          }
          dish.comments.id(req.params.commentId).remove()
          dish.save().then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, (err) => next(err)).catch((err) => next(err))
        } else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found')
          err.status = 404
          return next(err)
        } else {
          err = new Error('Comment ' + req.params.commentId + ' not found')
          err.status = 404
          return next(err)
        }
      }, (err) => next(err)).catch((err) => next(err))
    })

module.exports = favoriteRouter