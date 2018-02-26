const Entry = require('../models/Entry');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getMyWriting = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  Entry.find({ user_id: req.user._id })
  .limit(10)
  .sort({created_at: -1})
  .select('title created_at _id password_protected')
  .exec((err, entries) => {
    res.render('myWriting', {
      title: 'My Writing',
      entries: entries,
      entryTitle: req.session.newEntryTitle,
      entryContent: req.session.newEntryContent,
      passwordProtected: req.session.newEntrypasswordProtected
    });
  });

};

exports.postText = (req, res) => {
  req.assert('newEntryTitle', 'Title cannot be blank (draft saved)').notEmpty();
  req.assert('newEntryContent', 'Entry must be at least 10 characters (draft saved)').notEmpty();
  req.assert('newEntryMood', 'Please enter a mood').notEmpty();
  req.assert('newEntryContent', 'Entry must be at least 10 characters (draft saved)').isLength({ min: 10 });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    req.session.entryTitle = req.body.newEntryTitle;
    req.session.entryContent = req.body.newEntryContent;
    req.session.passwordProtected = req.body.newEntrypasswordProtected;
    req.session.mood = req.body.newEntryMood;
    return res.redirect('/my-writing');
  } else if (req.session) {
    delete req.session.newEntryTitle;
    delete req.session.newEntryContent;
    delete req.session.newEntrypasswordProtected;
    delete req.session.newEntryMood;
  }

  const entry = new Entry({
    user_id: req.user._id,
    title: req.body.newEntryTitle,
    content: req.body.newEntryContent,
    password_protected: req.body.newEntryPasswordProtected=='on',
    mood: req.body.newEntryMood
  });

  entry.save((err) => {
    if (err) { return next(err); }
    res.redirect('/my-writing');
  });

};

exports.getEntry = (req, res) => {
  Entry.findOne({user_id: req.user._id, _id: mongoose.Types.ObjectId(req.params.entryId)})
  .exec((err, foundEntry) => {
    if (!foundEntry.password_protected){
      res.status(200).send(foundEntry);
    } else {
      res.status(400).send('Password protected entry.')
    }
  });
};

exports.getProtectedEntry = (req, res) => {
  req.assert('protectedEntryPasswordView', 'Incorrect password').notEmpty();
  const errors = req.validationErrors();
  if (!errors){
      req.user.comparePassword(req.body.protectedEntryPasswordView, function(err, isMatch){
        if (!isMatch){
          res.status(401).send('Incorrect password');
        } else {
          Entry.findOne({user_id: req.user._id, _id: mongoose.Types.ObjectId(req.body.entryId)})
          .exec((err, foundEntry) => {
            res.status(200).send(foundEntry);
          });
        }
    });
  } else {
    res.status(401).send('Incorrect password');
  }
};

exports.postDeleteEntry = (req, res, next) => {
  console.log(req.body)
  Entry.remove({user_id: req.user._id, _id: mongoose.Types.ObjectId(req.body.entryId)}, (err) => {
    if (err) { return next(err); }
    res.status(200).send('success');
  });
};

exports.postDeleteProtectedEntry = (req, res, next) => {
  console.log(req.body)
  req.user.comparePassword(req.body.protectedEntryPasswordDelete, function(err, isMatch){
      if (!isMatch){
        res.status(401).send('Incorrect password');
      } else {
        Entry.remove({user_id: req.user._id, _id:  mongoose.Types.ObjectId(req.body.entryId)}, (err) => {
          if (err) { return next(err); }
          res.status(200).send('success');
        });
      }
  });
};