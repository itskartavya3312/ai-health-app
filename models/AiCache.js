import mongoose from "mongoose";

const AiCacheSchema = new mongoose.Schema({
  key: String,
  response: String,
});

export const makeCacheKey = (query) => {
  return query.toLowerCase().trim();
};

export default mongoose.models.AiCache ||
  mongoose.model("AiCache", AiCacheSchema);