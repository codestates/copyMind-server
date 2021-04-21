const { Schema, model } = require('mongoose');

const userSchema = new Schema(
   {
      email: { type: String },
      userName: { type: String },
      content: { type: String },
      password: { type: String },
      bookmark: [{ type: Schema.Types.ObjectId, ref: 'Copies' }],
      posting: [{ type: Schema.Types.ObjectId, ref: 'Copies' }],
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

module.exports = model('User', userSchema);
