import mongoose from 'mongoose';
const S = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  slug:       { type: String, required: true, unique: true, lowercase: true, index: true },
  aliases:    { type: [String], default: [] },
  category:   { type: String, enum: ['cardiovascular','neurological','respiratory','musculoskeletal','metabolic','infectious','dermatological','gastrointestinal','mental-health','other'], default: 'other', index: true },
  severity:   { type: String, enum: ['mild','moderate','severe'], default: 'moderate' },
  prevalence: { type: String, default: '' },
  icon:       { type: String, default: '🩺' },
  overview:   { type: String, required: true },
  causes:     [String], symptoms: [String], diagnosis: String,
  treatments: [String], prevention: [String], exercises: [String], diet: [String],
  source:     { type: String, enum: ['seed','gemini','manual'], default: 'seed' },
  views:      { type: Number, default: 0 },
}, { timestamps: true });

S.index({ name: 'text', aliases: 'text' });
S.pre('save', function(next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
  next();
});
export default mongoose.models.Disease || mongoose.model('Disease', S);
