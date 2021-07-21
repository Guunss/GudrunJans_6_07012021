const Sauce = require("../models/sauce");

exports.listerSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.creerSauce = (req, res, next) => {
  const sauce = new Sauce({
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    dislikes: 0,
    likes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.sauceUnique = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.supprimerSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifierSauce = (req, res, next) => {
  let sauceModif;
  if (req.file) {
    sauceModif = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    sauceModif = {
      ...req.body,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauceModif)
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likerSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like == 0) {
        index = sauce.usersLiked.indexOf(req.body.userId);
        if (index >= 0) {
          sauce.usersLiked.splice(index, 1);
          sauce.likes--;
        }
        index = sauce.usersDisliked.indexOf(req.body.userId);
        if (index >= 0) {
          sauce.usersDisliked.splice(index, 1);
          sauce.dislikes--;
        }
      } else if (req.body.like == 1) {
        index = sauce.usersLiked.indexOf(req.body.userId);
        indexDisliked = sauce.usersDisliked.indexOf(req.body.userId);
        if (index == -1 && indexDisliked == -1) {
          sauce.usersLiked.push(req.body.userId);
          sauce.likes++;
        }
      } else if (req.body.like == -1) {
        index = sauce.usersLiked.indexOf(req.body.userId);
        indexDisliked = sauce.usersDisliked.indexOf(req.body.userId);
        if (index == -1 && indexDisliked == -1) {
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes++;
        }
      }
      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "Objet modifié" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
