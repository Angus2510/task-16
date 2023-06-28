const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
title: { type: String, required: true, default: null },
time: { type: String, required: true, default: null },
rating: { type: Number, required: true, default: 0 },
blurb: { type: String, required: true, default: null },
steps: {type: Array, default: [] },
ingredients:{type: Array, default: [] },
approved: { type: Boolean, default: false },
type: { type: String, required: true, default: null },
});

module.exports = model("recipe", recipeSchema);