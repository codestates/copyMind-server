const { Schema, model } = require('mongoose');

const copiesShcema = new Schema(
   {
      content: { type: String },
      title: { type: String },
      writer: { type: String },
      category: { type: String },
      likeCount: { type: String },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

module.exports = model('Copies', copiesShcema);
