import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import Disease from "../../../models/Disease";

/*
|--------------------------------------------------------------------------
| Massive HealthAI Disease Seed Database
|--------------------------------------------------------------------------
| Startup-grade medical dataset
| Optimized for:
| - Search
| - AI suggestions
| - Symptom matching
| - SEO
| - Future monetization
|--------------------------------------------------------------------------
*/

const SEEDS = [
  {
    name: 'Type 2 Diabetes',
    slug: 'type-2-diabetes',
    category: 'metabolic',
    severity: 'moderate',
    icon: '🩸',
    prevalence: '~10% of adults',
    overview: 'A chronic metabolic disorder causing high blood sugar due to insulin resistance.',
    aliases: ['diabetes', 'high blood sugar', 't2dm'],
    symptoms: [
      'Frequent urination',
      'Excessive thirst',
      'Fatigue',
      'Blurred vision',
      'Slow wound healing',
      'Weight changes'
    ],
    causes: [
      'Obesity',
      'Poor diet',
      'Lack of exercise',
      'Genetics'
    ],
    diagnosis: 'Blood sugar tests, HbA1c, fasting glucose.',
    treatments: [
      'Metformin',
      'Insulin therapy',
      'Lifestyle changes',
      'Diet management'
    ],
    prevention: [
      'Regular exercise',
      'Healthy weight',
      'Low sugar diet'
    ],
    exercises: [
      'Walking',
      'Cycling',
      'Swimming'
    ],
    diet: [
      'Whole grains',
      'Vegetables',
      'Low sugar foods'
    ]
  },

  {
    name: 'Hypertension',
    slug: 'hypertension',
    category: 'cardiovascular',
    severity: 'moderate',
    icon: '❤️',
    prevalence: '1 in 3 adults',
    overview: 'Persistently elevated blood pressure increasing cardiovascular risk.',
    aliases: ['high blood pressure', 'bp'],
    symptoms: [
      'Headache',
      'Dizziness',
      'Blurred vision',
      'Chest pain'
    ],
    causes: [
      'High salt diet',
      'Stress',
      'Obesity',
      'Smoking'
    ],
    diagnosis: 'Repeated blood pressure measurements.',
    treatments: [
      'ACE inhibitors',
      'Lifestyle modification',
      'Exercise'
    ],
    prevention: [
      'Reduce salt intake',
      'Exercise regularly',
      'Manage stress'
    ],
    exercises: [
      'Walking',
      'Yoga',
      'Swimming'
    ],
    diet: [
      'DASH diet',
      'Low sodium foods'
    ]
  },

  {
    name: 'Asthma',
    slug: 'asthma',
    category: 'respiratory',
    severity: 'moderate',
    icon: '🫁',
    prevalence: '300 million worldwide',
    overview: 'A chronic lung disease causing airway inflammation and breathing difficulty.',
    aliases: ['breathing problem', 'wheezing'],
    symptoms: [
      'Shortness of breath',
      'Wheezing',
      'Chest tightness',
      'Night cough'
    ],
    causes: [
      'Allergies',
      'Pollution',
      'Cold air',
      'Exercise'
    ],
    diagnosis: 'Spirometry and pulmonary function testing.',
    treatments: [
      'Inhalers',
      'Bronchodilators',
      'Steroids'
    ],
    prevention: [
      'Avoid smoke',
      'Control allergies'
    ],
    exercises: [
      'Swimming',
      'Light cardio'
    ],
    diet: [
      'Anti-inflammatory foods'
    ]
  },

  {
    name: 'Migraine',
    slug: 'migraine',
    category: 'neurological',
    severity: 'moderate',
    icon: '🧠',
    prevalence: '15% of population',
    overview: 'A neurological condition causing intense headaches and sensitivity to light.',
    aliases: ['headache disorder'],
    symptoms: [
      'Severe headache',
      'Light sensitivity',
      'Nausea',
      'Aura'
    ],
    causes: [
      'Stress',
      'Hormonal changes',
      'Sleep issues'
    ],
    diagnosis: 'Clinical neurological evaluation.',
    treatments: [
      'Pain relievers',
      'Triptans'
    ],
    prevention: [
      'Adequate sleep',
      'Hydration'
    ],
    exercises: [
      'Yoga',
      'Meditation'
    ],
    diet: [
      'Magnesium rich foods'
    ]
  },

  {
    name: 'Influenza',
    slug: 'influenza',
    category: 'infectious',
    severity: 'mild',
    icon: '🤒',
    prevalence: 'Millions annually',
    overview: 'A viral respiratory infection commonly known as flu.',
    aliases: ['flu', 'viral fever'],
    symptoms: [
      'Fever',
      'Body pain',
      'Cough',
      'Sore throat',
      'Fatigue'
    ],
    causes: [
      'Influenza virus'
    ],
    diagnosis: 'Rapid flu test.',
    treatments: [
      'Rest',
      'Hydration',
      'Antiviral medications'
    ],
    prevention: [
      'Flu vaccine',
      'Hand hygiene'
    ],
    exercises: [],
    diet: [
      'Warm fluids',
      'Soup'
    ]
  },

  {
    name: 'Pneumonia',
    slug: 'pneumonia',
    category: 'respiratory',
    severity: 'severe',
    icon: '🫁',
    prevalence: 'Common worldwide',
    overview: 'Lung infection causing inflammation and fluid accumulation.',
    aliases: ['lung infection'],
    symptoms: [
      'Fever',
      'Chest pain',
      'Cough with mucus',
      'Shortness of breath'
    ],
    causes: [
      'Bacteria',
      'Viruses',
      'Fungi'
    ],
    diagnosis: 'Chest X-ray and blood tests.',
    treatments: [
      'Antibiotics',
      'Hospitalization',
      'Oxygen therapy'
    ],
    prevention: [
      'Vaccination',
      'Avoid smoking'
    ]
  },

  {
    name: 'Tuberculosis',
    slug: 'tuberculosis',
    category: 'infectious',
    severity: 'severe',
    icon: '🦠',
    prevalence: 'Millions globally',
    overview: 'A serious bacterial infection mainly affecting the lungs.',
    aliases: ['tb'],
    symptoms: [
      'Weight loss',
      'Night sweats',
      'Persistent cough',
      'Fever'
    ],
    causes: [
      'Mycobacterium tuberculosis'
    ],
    diagnosis: 'TB skin test, chest X-ray.',
    treatments: [
      'Long-term antibiotics'
    ],
    prevention: [
      'BCG vaccine',
      'Avoid exposure'
    ]
  },

  {
    name: 'Anemia',
    slug: 'anemia',
    category: 'metabolic',
    severity: 'mild',
    icon: '🩸',
    prevalence: 'Very common',
    overview: 'Low red blood cell count causing reduced oxygen delivery.',
    aliases: ['low hemoglobin'],
    symptoms: [
      'Fatigue',
      'Pale skin',
      'Weakness',
      'Dizziness'
    ],
    causes: [
      'Iron deficiency',
      'Vitamin deficiency'
    ],
    diagnosis: 'CBC blood test.',
    treatments: [
      'Iron supplements',
      'Vitamin therapy'
    ],
    prevention: [
      'Iron rich diet'
    ]
  },

  {
    name: 'Depression',
    slug: 'depression',
    category: 'mental-health',
    severity: 'moderate',
    icon: '🧩',
    prevalence: '280 million worldwide',
    overview: 'A mood disorder causing persistent sadness and loss of interest.',
    aliases: ['clinical depression'],
    symptoms: [
      'Sadness',
      'Low motivation',
      'Sleep changes',
      'Hopelessness'
    ],
    causes: [
      'Stress',
      'Trauma',
      'Brain chemistry'
    ],
    diagnosis: 'Psychological assessment.',
    treatments: [
      'Therapy',
      'Antidepressants'
    ],
    prevention: [
      'Mental wellness',
      'Exercise'
    ]
  },

  {
    name: 'GERD',
    slug: 'gerd',
    category: 'gastrointestinal',
    severity: 'mild',
    icon: '🔥',
    prevalence: 'Common digestive disorder',
    overview: 'Acid reflux condition causing heartburn.',
    aliases: ['acid reflux'],
    symptoms: [
      'Heartburn',
      'Chest discomfort',
      'Acid taste'
    ],
    causes: [
      'Weak esophageal sphincter',
      'Obesity'
    ],
    diagnosis: 'Endoscopy.',
    treatments: [
      'Antacids',
      'PPIs'
    ],
    prevention: [
      'Avoid spicy foods'
    ]
  },

  // NEW CONDITIONS

  {
    name: 'COVID-19',
    slug: 'covid-19',
    category: 'infectious',
    severity: 'moderate',
    icon: '🦠',
    prevalence: 'Global',
    overview: 'A viral respiratory illness caused by SARS-CoV-2.',
    aliases: ['coronavirus', 'covid'],
    symptoms: [
      'Fever',
      'Dry cough',
      'Loss of smell',
      'Fatigue',
      'Breathing difficulty'
    ],
    causes: ['Coronavirus infection'],
    diagnosis: 'PCR or antigen test.',
    treatments: [
      'Rest',
      'Hydration',
      'Antivirals'
    ],
    prevention: [
      'Vaccination',
      'Masks',
      'Hand hygiene'
    ]
  },

  {
    name: 'Dengue Fever',
    slug: 'dengue-fever',
    category: 'infectious',
    severity: 'severe',
    icon: '🦟',
    prevalence: 'Common in tropical regions',
    overview: 'Mosquito-borne viral infection causing high fever and pain.',
    aliases: ['dengue'],
    symptoms: [
      'High fever',
      'Joint pain',
      'Rash',
      'Headache'
    ],
    causes: ['Mosquito bites'],
    diagnosis: 'Blood testing.',
    treatments: [
      'Fluids',
      'Pain control'
    ],
    prevention: [
      'Mosquito control',
      'Avoid stagnant water'
    ]
  },

  {
    name: 'Typhoid',
    slug: 'typhoid',
    category: 'infectious',
    severity: 'moderate',
    icon: '🌡️',
    prevalence: 'Common in developing countries',
    overview: 'A bacterial infection spread through contaminated food and water.',
    aliases: ['typhoid fever'],
    symptoms: [
      'Fever',
      'Abdominal pain',
      'Weakness',
      'Constipation'
    ],
    causes: ['Salmonella typhi'],
    diagnosis: 'Blood culture.',
    treatments: [
      'Antibiotics'
    ],
    prevention: [
      'Safe drinking water',
      'Vaccination'
    ]
  }
];

export async function GET() {
  try {
    await connectDB();

    let inserted = 0;
    let skipped = 0;

    for (const disease of SEEDS) {
      const exists = await Disease.findOne({
        slug: disease.slug
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Disease.create({
        ...disease,
        source: 'seed'
      });

      inserted++;
    }

    const total = await Disease.countDocuments();

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      totalDiseases: total,
      message: `✅ Database upgraded successfully with ${inserted} new diseases.`
    });

  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e.message
    }, { status: 500 });
  }
}