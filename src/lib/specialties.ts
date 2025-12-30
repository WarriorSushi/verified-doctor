/**
 * List of medical specialties for doctor profiles.
 */
export const MEDICAL_SPECIALTIES = [
  // Primary Care
  "General Practice",
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Geriatrics",

  // Surgical Specialties
  "General Surgery",
  "Orthopedic Surgery",
  "Cardiothoracic Surgery",
  "Neurosurgery",
  "Plastic Surgery",
  "Vascular Surgery",
  "Pediatric Surgery",
  "Transplant Surgery",

  // Internal Medicine Subspecialties
  "Cardiology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
  "Rheumatology",
  "Infectious Disease",
  "Hematology",
  "Oncology",
  "Allergy & Immunology",

  // Other Major Specialties
  "Obstetrics & Gynecology",
  "Psychiatry",
  "Neurology",
  "Dermatology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Urology",
  "Anesthesiology",
  "Radiology",
  "Pathology",
  "Emergency Medicine",
  "Critical Care Medicine",
  "Physical Medicine & Rehabilitation",
  "Sports Medicine",

  // Dental
  "Dentistry",
  "Oral & Maxillofacial Surgery",
  "Orthodontics",
  "Periodontics",
  "Endodontics",

  // Other
  "Pain Medicine",
  "Sleep Medicine",
  "Palliative Care",
  "Preventive Medicine",
  "Occupational Medicine",
  "Aerospace Medicine",
  "Nuclear Medicine",
  "Medical Genetics",
  "Neonatology",

  // Alternative/Complementary
  "Ayurveda",
  "Homeopathy",
  "Traditional Chinese Medicine",
  "Naturopathy",
];

export type MedicalSpecialty = (typeof MEDICAL_SPECIALTIES)[number];
