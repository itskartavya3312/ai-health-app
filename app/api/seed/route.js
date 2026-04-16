import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import Disease from "../../../models/Disease";

const SEEDS = [
  { name:'Type 2 Diabetes', slug:'type-2-diabetes', category:'metabolic', severity:'moderate', icon:'🩸', prevalence:'~10% of adults',
    overview:'Chronic condition where cells become resistant to insulin, causing high blood sugar levels.',
    causes:['Obesity','Physical inactivity','Genetics','Poor diet','Age over 45'],
    symptoms:['Increased thirst','Frequent urination','Fatigue','Blurred vision','Slow-healing sores'],
    treatments:['Blood sugar monitoring','Oral medications (Metformin)','Insulin therapy','Weight loss','Regular check-ups'],
    prevention:['Healthy weight','Exercise 30min/day','Low-sugar diet','Regular screening'],
    exercises:['Brisk walking','Swimming','Cycling','Resistance training'],
    diet:['Whole grains','Half plate vegetables','Limit sugary drinks','Portion control'],
    diagnosis:'Fasting glucose ≥126 mg/dL or HbA1c ≥6.5%' },

  { name:'Hypertension', slug:'hypertension', category:'cardiovascular', severity:'moderate', icon:'❤️', prevalence:'1 in 3 adults',
    overview:'Persistently high blood pressure (≥130/80 mmHg) that damages arteries and increases heart disease risk.',
    causes:['High salt diet','Obesity','Inactivity','Stress','Alcohol','Genetics'],
    symptoms:['Often no symptoms','Headaches','Shortness of breath','Nosebleeds','Chest pain (severe)'],
    treatments:['ACE inhibitors','Beta-blockers','Diuretics','DASH diet','Exercise'],
    prevention:['Reduce sodium','Regular exercise','Limit alcohol','Manage stress'],
    exercises:['Aerobic walking','Cycling','Swimming','Yoga','Tai chi'],
    diet:['DASH diet','Low sodium','High potassium foods','Avoid excess caffeine'],
    diagnosis:'Blood pressure readings ≥130/80 mmHg on multiple occasions' },

  { name:'Asthma', slug:'asthma', category:'respiratory', severity:'moderate', icon:'🫁', prevalence:'300 million worldwide',
    overview:'Chronic airway inflammation causing recurrent wheezing, breathlessness, and coughing episodes.',
    causes:['Allergens','Air pollution','Infections','Exercise','Genetics','Occupational dust'],
    symptoms:['Wheezing','Shortness of breath','Chest tightness','Nocturnal cough','Exercise intolerance'],
    treatments:['Rescue inhalers','Inhaled corticosteroids','Long-acting beta-agonists','Allergy meds','Trigger avoidance'],
    prevention:['Identify triggers','Annual flu vaccine','Air purifiers','Medication compliance'],
    exercises:['Swimming','Moderate walking','Yoga','Indoor cycling'],
    diet:['Omega-3 rich foods','Vitamin D','Avoid sulfites','Stay hydrated'],
    diagnosis:'Spirometry, peak flow test, bronchodilator reversibility test' },

  { name:'Migraine', slug:'migraine', category:'neurological', severity:'moderate', icon:'🧠', prevalence:'15% of population',
    overview:'Neurological condition causing severe recurring headaches with nausea and light sensitivity.',
    causes:['Hormonal changes','Stress','Poor sleep','Certain foods','Bright lights','Dehydration'],
    symptoms:['Throbbing one-sided headache','Nausea/vomiting','Light sensitivity','Sound sensitivity','Visual aura'],
    treatments:['Triptans','NSAIDs','Preventive medications','Dark quiet room','Cold compress'],
    prevention:['Headache diary','Regular sleep','Stay hydrated','Limit caffeine','Manage stress'],
    exercises:['Yoga','Light aerobics','Neck stretches','Meditation'],
    diet:['Avoid aged cheese & red wine','Regular meals','Magnesium-rich foods','Limit caffeine'],
    diagnosis:'Clinical diagnosis via ICHD criteria, MRI to exclude other causes' },

  { name:'Influenza', slug:'influenza', category:'infectious', severity:'mild', icon:'🤧', prevalence:'1 billion cases/year',
    overview:'Contagious respiratory illness from influenza viruses affecting nose, throat, and lungs.',
    causes:['Influenza A & B viruses','Person-to-person contact','Contaminated surfaces'],
    symptoms:['Fever & chills','Cough','Body aches','Fatigue','Sore throat','Headache'],
    treatments:['Antivirals (Tamiflu)','Rest','Hydration','Fever reducers','Decongestants'],
    prevention:['Annual flu vaccine','Hand washing','Avoid face touching','Cover coughs'],
    exercises:['Rest during illness','Gentle walking in recovery'],
    diet:['Hot soups','Vitamin C foods','Ginger tea','Plenty of fluids'],
    diagnosis:'Rapid flu test, PCR test, clinical presentation in first 48 hours' },

  { name:'Osteoarthritis', slug:'osteoarthritis', category:'musculoskeletal', severity:'moderate', icon:'🦴', prevalence:'300 million globally',
    overview:'Degenerative joint disease where cartilage breaks down causing pain and reduced mobility.',
    causes:['Aging','Joint injury','Obesity','Genetics','Sedentary lifestyle'],
    symptoms:['Joint pain with activity','Morning stiffness <30min','Joint swelling','Reduced flexibility','Grating sensation'],
    treatments:['NSAIDs','Physical therapy','Weight loss','Steroid injections','Joint replacement'],
    prevention:['Healthy weight','Regular exercise','Avoid joint overuse','Good posture'],
    exercises:['Water aerobics','Cycling','Tai chi','Gentle stretching'],
    diet:['Anti-inflammatory foods','Omega-3 fatty acids','Vitamin D & calcium','Healthy weight diet'],
    diagnosis:'X-ray showing joint space narrowing, MRI for cartilage assessment' },

  { name:'Depression', slug:'depression', category:'mental-health', severity:'moderate', icon:'🧩', prevalence:'280 million worldwide',
    overview:'Mental health condition causing persistent sadness, loss of interest, and impaired daily functioning.',
    causes:['Brain chemistry','Genetics','Trauma','Chronic illness','Substance abuse','Hormones'],
    symptoms:['Persistent sadness','Loss of interest','Fatigue','Sleep problems','Appetite changes','Poor concentration'],
    treatments:['SSRIs/SNRIs','CBT therapy','Psychotherapy','Exercise','Support groups'],
    prevention:['Social connections','Regular exercise','Adequate sleep','Stress management','Early help-seeking'],
    exercises:['Aerobic exercise 30min/day','Yoga','Group fitness','Outdoor walking'],
    diet:['Omega-3 fatty acids','Reduce processed sugar','Magnesium-rich foods','Vitamin B12 & D'],
    diagnosis:'Clinical interview, DSM-5 criteria, PHQ-9 questionnaire, symptoms ≥2 weeks' },

  { name:'Eczema', slug:'eczema', category:'dermatological', severity:'mild', icon:'🌿', prevalence:'10-20% of children',
    overview:'Chronic inflammatory skin condition causing itchy, red, cracked patches of skin in flares.',
    causes:['Skin barrier gene mutation','Immune dysfunction','Allergens','Soaps','Stress','Dry climate'],
    symptoms:['Intense itching','Red/gray patches','Oozing bumps','Thickened skin','Swelling from scratching'],
    treatments:['Daily moisturizers','Topical corticosteroids','Calcineurin inhibitors','Antihistamines','Biologics (severe)'],
    prevention:['Moisturize daily','Gentle fragrance-free products','Avoid triggers','Soft fabrics'],
    exercises:['Swimming (shower after)','Yoga','Indoor cycling'],
    diet:['Anti-inflammatory foods','Identify food triggers','Stay hydrated','Vitamin E'],
    diagnosis:'Clinical examination, patch testing, IgE blood tests, family history' },

  { name:'GERD', slug:'gerd', category:'gastrointestinal', severity:'mild', icon:'🔥', prevalence:'20% of Western adults',
    overview:'Chronic acid reflux where stomach acid flows back into the esophagus causing irritation.',
    causes:['Weak lower esophageal sphincter','Obesity','Hiatal hernia','Smoking','Certain foods'],
    symptoms:['Heartburn','Regurgitation','Difficulty swallowing','Chest pain','Chronic cough','Hoarseness'],
    treatments:['Proton pump inhibitors','H2 blockers','Antacids','Lifestyle changes','Surgery (severe)'],
    prevention:['Avoid trigger foods','Small frequent meals','No lying down after eating','Elevate bed head'],
    exercises:['Walking after meals','Yoga (no inversions)','Low-impact activities'],
    diet:['Avoid caffeine & alcohol','Reduce fatty foods','Smaller meals','Alkaline foods'],
    diagnosis:'Endoscopy, pH monitoring, esophageal manometry, clinical diagnosis' },

  { name:'Anemia', slug:'anemia', category:'metabolic', severity:'mild', icon:'💉', prevalence:'1.62 billion people',
    overview:'Insufficient healthy red blood cells to carry adequate oxygen to body tissues.',
    causes:['Iron deficiency','Vitamin B12/folate deficiency','Chronic disease','Blood loss','Bone marrow issues'],
    symptoms:['Fatigue & weakness','Pale skin','Shortness of breath','Dizziness','Cold extremities','Headache'],
    treatments:['Iron supplements','Dietary changes','B12 injections','Blood transfusion (severe)','Treat cause'],
    prevention:['Iron-rich diet','Vitamin C for absorption','Regular blood tests','Prenatal vitamins'],
    exercises:['Gentle yoga','Light walking','Breathing exercises','Gradual intensity increase'],
    diet:['Red meat & fish (heme iron)','Leafy greens & legumes','Vitamin C with iron meals','Fortified cereals'],
    diagnosis:'CBC test, serum ferritin, iron studies. Hb <12 g/dL (women) or <13 g/dL (men)' },
];

export async function GET() {
  try {
    await connectDB();
    let inserted = 0, skipped = 0;
    for (const d of SEEDS) {
      const exists = await Disease.findOne({ slug: d.slug });
      if (!exists) { await Disease.create({ ...d, source: 'seed' }); inserted++; }
      else skipped++;
    }
    return NextResponse.json({ success: true, message: `✅ Seeded ${inserted} diseases, ${skipped} already existed.`, inserted, skipped });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
