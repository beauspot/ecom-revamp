import { Schema, model } from "mongoose";

// Declare the Schema of the Mongo model
const blacklistTokensSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Export the model
export const blacklistTokens = model("BlacklistTokens", blacklistTokensSchema);