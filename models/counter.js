const { Schema, model } = require('mongoose');

const counterSchema = new Schema(
   {
      id: { type: String },
      sequence_value: { type: Number },
   },
   {
      versionKey: false,
   }
);

const Counter = model('Counter', counterSchema);

const increaseValue = async (insertValue) => {
   const counter = new Counter({ id: 'copyId', sequence_value: 0 });
   await counter.save();
   const increseValue = await Counter.findOneAndUpdate(
      { id: insertValue },
      { $inc: { sequence_value: 1 } },
      { new: true }
   );
   return increseValue.sequence_value;
};

const decreaseValue = async (insertValue) => {
   const decreaseValue = await Counter.findOneAndUpdate(
      { id: insertValue },
      { $dec: { sequence_value: 1 } },
      { new: true }
   );
   return decreaseValue.sequence_value;
};

module.exports = { increaseValue, decreaseValue };
