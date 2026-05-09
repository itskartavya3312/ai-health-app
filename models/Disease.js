import mongoose from 'mongoose';

const DiseaseSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    aliases: {
      type: [String],
      default: [],
      index: true,
    },

    category: {
      type: String,
      enum: [
        'cardiovascular',
        'neurological',
        'respiratory',
        'musculoskeletal',
        'metabolic',
        'infectious',
        'dermatological',
        'gastrointestinal',
        'mental-health',
        'endocrine',
        'autoimmune',
        'genetic',
        'cancer',
        'kidney',
        'liver',
        'eye',
        'ear-nose-throat',
        'women-health',
        'men-health',
        'child-health',
        'other',
      ],
      default: 'other',
      index: true,
    },

    severity: {
      type: String,
      enum: [
        'mild',
        'moderate',
        'severe',
        'critical',
      ],
      default: 'moderate',
      index: true,
    },

    prevalence: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: '🩺',
    },

    // Main content
    overview: {
      type: String,
      required: true,
    },

    causes: {
      type: [String],
      default: [],
    },

    symptoms: {
      type: [String],
      default: [],
      index: true,
    },

    diagnosis: {
      type: String,
      default: '',
    },

    treatments: {
      type: [String],
      default: [],
    },

    prevention: {
      type: [String],
      default: [],
    },

    exercises: {
      type: [String],
      default: [],
    },

    diet: {
      type: [String],
      default: [],
    },

    medications: {
      type: [String],
      default: [],
    },

    complications: {
      type: [String],
      default: [],
    },

    riskFactors: {
      type: [String],
      default: [],
    },

    emergencySigns: {
      type: [String],
      default: [],
    },

    // Related diseases
    relatedDiseases: {
      type: [String],
      default: [],
    },

    // SEO + AI search
    searchableTerms: {
      type: [String],
      default: [],
      index: true,
    },

    commonQuestions: {
      type: [String],
      default: [],
    },

    // India-specific support
    indiaInfo: {
      commonInIndia: {
        type: Boolean,
        default: false,
      },

      seasonalRisk: {
        type: String,
        default: '',
      },

      pollutionRelated: {
        type: Boolean,
        default: false,
      },
    },

    // AI metadata
    aiGenerated: {
      type: Boolean,
      default: false,
    },

    aiConfidence: {
      type: Number,
      default: 0,
    },

    source: {
      type: String,
      enum: [
        'seed',
        'gemini',
        'manual',
        'doctor-reviewed',
      ],
      default: 'seed',
      index: true,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },

    searches: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },

    trendingScore: {
      type: Number,
      default: 0,
    },

    // Publishing
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

// Full text search
DiseaseSchema.index({
  name: 'text',
  aliases: 'text',
  symptoms: 'text',
  overview: 'text',
  searchableTerms: 'text',
});

// Auto slug generation
DiseaseSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  next();
});

export default mongoose.models.Disease ||
  mongoose.model('Disease', DiseaseSchema);