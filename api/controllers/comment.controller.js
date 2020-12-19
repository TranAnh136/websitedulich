"use strict";
const _comment = require("../models/comment.model");
const tour = require("../models/tour.model");

exports.mycomment = async (req, res) => {
  if (
    typeof req.body.user_id === "undefined" ||
    typeof req.body.tour_id === "undefined" ||
    typeof req.body.name === "undefined" ||
    typeof req.body.comment === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }

  let { user_id, tour_id, name, comment } = req.body;
  let tourFind;
  try {
    tourFind = await tour.findById(tour_id);
  } catch (err) {
    res.status(422).json({ msg: " ID tour Invalid data" });
    return;
  }
  const new_comment = _comment({
    user_id: user_id,
    tour_id: tour_id,
    name: name,
    comment: comment
  });
  try {
    new_comment.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }
  res.status(201).json({ msg: "success" });
  return;
};

exports.getCommentByIDTour = async (req, res) => {
  if (
    typeof req.body.tour_id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { tour_id, page } = req.body;
  let count = await _comment.count({ tour_id: tour_id });
  let totalPage = parseInt((count - 1) / 9 + 1);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  _comment
    .find({ tour_id: tour_id })
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .sort({ date: 1 })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
      res.status(200).json({ data: docs, totalPage });
    });
};
