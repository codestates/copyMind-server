const { Schema, model } = require('mongoose');

const copiesShcema = new Schema(
   {
      content: { type: String },
      title: { type: String },
      writer: { type: String },
      category: { type: String },
      likeCount: { type: Number, default: 0 },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

module.exports = model('Copies', copiesShcema);
