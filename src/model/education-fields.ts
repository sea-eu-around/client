/**
 * University education fields as specified by the International Standard Classification of Education (ISCED), 2013.
 * @see {@link https://ec.europa.eu/eurostat/statistics-explained/index.php/International_Standard_Classification_of_Education_(ISCED)}
 * @see page 18 of {@link https://eqe.ge/res/docs/228085e.pdf}
 * @see page 18 of {@link http://uis.unesco.org/fr/file/1390} for french translations
 * See translations for the actual display name of each field.
 */

export enum EducationFieldCategory {
    GPQ = "generic-programmes-qualifications",
    EDU = "education",
    AH = "arts-humanities",
    SSJI = "social-sciences-journalism-information",
    BAL = "business-administration-law",
    NSMS = "natural-sciences-mathematics-statistics",
    ICT = "information-communication-technologies",
    EMC = "engineering-manufacturing-construction",
    AFFV = "agriculture-forestry-fisheries-veterinary",
    HW = "health-welfare",
    SER = "services",
}

export const EDUCATION_FIELD_CATEGORIES = Object.values(EducationFieldCategory) as EducationFieldCategory[];

export enum EducationFieldSubCategory {
    "basic-programmes-qualifications",
    "literacy-numeracy",
    "personal-skills-development",
    "education",
    "arts",
    "humanities",
    "languages",
    "social-behavioural-sciences",
    "journalism-information",
    "business-administration",
    "law",
    "biological-related-sciences",
    "environment",
    "physical-sciences",
    "mathematics-statistics",
    "information-communication-technologies",
    "engineering-engineering-trades",
    "manufacturing-processing",
    "architecture-construction",
    "agriculture",
    "forestry",
    "fisheries",
    "veterinary",
    "health",
    "welfare",
    "personal-services",
    "hygiene-occupational-health-services",
    "security-services",
    "transport-services",
}

export type EducationField = {
    id: string;
    category: EducationFieldCategory;
    subCategory: EducationFieldSubCategory;
};

export const EDUCATION_FIELDS: EducationField[] = [
    {
        id: "basic-programmes-qualifications",
        category: EducationFieldCategory.GPQ,
        subCategory: EducationFieldSubCategory["basic-programmes-qualifications"],
    },
    {
        id: "literacy-numeracy",
        category: EducationFieldCategory.GPQ,
        subCategory: EducationFieldSubCategory["literacy-numeracy"],
    },
    {
        id: "personal-skills-development",
        category: EducationFieldCategory.GPQ,
        subCategory: EducationFieldSubCategory["personal-skills-development"],
    },
    {
        id: "education-science",
        category: EducationFieldCategory.EDU,
        subCategory: EducationFieldSubCategory["education"],
    },
    {
        id: "training-for-pre-school-teachers",
        category: EducationFieldCategory.EDU,
        subCategory: EducationFieldSubCategory["education"],
    },
    {
        id: "teacher-training-without-subject-specialisation",
        category: EducationFieldCategory.EDU,
        subCategory: EducationFieldSubCategory["education"],
    },
    {
        id: "teacher-training-with-subject-specialisation",
        category: EducationFieldCategory.EDU,
        subCategory: EducationFieldSubCategory["education"],
    },
    {
        id: "audio-visual-techniques-media-production",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["arts"],
    },
    {
        id: "fashion-interior-industrial-design",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["arts"],
    },
    {
        id: "fine-arts",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["arts"],
    },
    {
        id: "handicrafts",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["arts"],
    },
    {
        id: "music-performing-arts",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["arts"],
    },
    {
        id: "religion-theology",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["humanities"],
    },
    {
        id: "history-archaeology",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["humanities"],
    },
    {
        id: "philosophy-ethics",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["humanities"],
    },
    {
        id: "language-acquisition",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["languages"],
    },
    {
        id: "literature-linguistics",
        category: EducationFieldCategory.AH,
        subCategory: EducationFieldSubCategory["languages"],
    },
    {
        id: "economics",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["social-behavioural-sciences"],
    },
    {
        id: "political-sciences-civics",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["social-behavioural-sciences"],
    },
    {
        id: "psychology",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["social-behavioural-sciences"],
    },
    {
        id: "sociology-cultural-studies",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["social-behavioural-sciences"],
    },
    {
        id: "journalism-reporting",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["journalism-information"],
    },
    {
        id: "library-information-archival-studies",
        category: EducationFieldCategory.SSJI,
        subCategory: EducationFieldSubCategory["journalism-information"],
    },
    {
        id: "accounting-taxation",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "finance-banking-insurance",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "management-administration",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "marketing-advertising",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "secretarial-office-work",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "wholesale-retail-sales",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "work-skills",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["business-administration"],
    },
    {
        id: "law",
        category: EducationFieldCategory.BAL,
        subCategory: EducationFieldSubCategory["law"],
    },
    {
        id: "biology",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["biological-related-sciences"],
    },
    {
        id: "biochemistry",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["biological-related-sciences"],
    },
    {
        id: "environmental-sciences",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["environment"],
    },
    {
        id: "natural-environments-wildlife",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["environment"],
    },
    {
        id: "chemistry",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["physical-sciences"],
    },
    {
        id: "earth-sciences",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["physical-sciences"],
    },
    {
        id: "physics",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["physical-sciences"],
    },
    {
        id: "mathematics",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["mathematics-statistics"],
    },
    {
        id: "statistics",
        category: EducationFieldCategory.NSMS,
        subCategory: EducationFieldSubCategory["mathematics-statistics"],
    },
    {
        id: "computer-use",
        category: EducationFieldCategory.ICT,
        subCategory: EducationFieldSubCategory["information-communication-technologies"],
    },
    {
        id: "database-network-design-administration",
        category: EducationFieldCategory.ICT,
        subCategory: EducationFieldSubCategory["information-communication-technologies"],
    },
    {
        id: "software-applications-development-analysis",
        category: EducationFieldCategory.ICT,
        subCategory: EducationFieldSubCategory["information-communication-technologies"],
    },
    {
        id: "chemical-engineering-processes",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "environmental-protection-technology",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "electricity-energy",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "electronics-automation",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "mechanics-metal-trades",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "motor-vehicles-ships-aircraft",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["engineering-engineering-trades"],
    },
    {
        id: "food-processing",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["manufacturing-processing"],
    },
    {
        id: "materials",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["manufacturing-processing"],
    },
    {
        id: "textiles",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["manufacturing-processing"],
    },
    {
        id: "mining-extraction",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["manufacturing-processing"],
    },
    {
        id: "architecture-town-planning",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["architecture-construction"],
    },
    {
        id: "building-civil-engineering",
        category: EducationFieldCategory.EMC,
        subCategory: EducationFieldSubCategory["architecture-construction"],
    },
    {
        id: "crop-livestock-production",
        category: EducationFieldCategory.AFFV,
        subCategory: EducationFieldSubCategory["agriculture"],
    },
    {
        id: "horticulture",
        category: EducationFieldCategory.AFFV,
        subCategory: EducationFieldSubCategory["agriculture"],
    },
    {
        id: "forestry",
        category: EducationFieldCategory.AFFV,
        subCategory: EducationFieldSubCategory["forestry"],
    },
    {
        id: "fisheries",
        category: EducationFieldCategory.AFFV,
        subCategory: EducationFieldSubCategory["fisheries"],
    },
    {
        id: "veterinary",
        category: EducationFieldCategory.AFFV,
        subCategory: EducationFieldSubCategory["veterinary"],
    },
    {
        id: "dental-studies",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "medicine",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "nursing-midwifery",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "medical-diagnostic-treatment-technology",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "therapy-rehabilitation",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "pharmacy",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "traditional-complementary-medicine-therapy",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["health"],
    },
    {
        id: "care-elderly-disabled-adults",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["welfare"],
    },
    {
        id: "child-care-youth-services",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["welfare"],
    },
    {
        id: "social-work-counselling",
        category: EducationFieldCategory.HW,
        subCategory: EducationFieldSubCategory["welfare"],
    },
    {
        id: "domestic-services",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["personal-services"],
    },
    {
        id: "hair-beauty-services",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["personal-services"],
    },
    {
        id: "hotel-restaurants-catering",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["personal-services"],
    },
    {
        id: "sports",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["personal-services"],
    },
    {
        id: "travel-tourism-leisure",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["personal-services"],
    },
    {
        id: "community-sanitation",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["hygiene-occupational-health-services"],
    },
    {
        id: "occupational-health-safety",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["hygiene-occupational-health-services"],
    },
    {
        id: "military-defence",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["security-services"],
    },
    {
        id: "protection-of-persons-property",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["security-services"],
    },
    {
        id: "transport-services",
        category: EducationFieldCategory.SER,
        subCategory: EducationFieldSubCategory["transport-services"],
    },
];

/*const organized: Map<EducationFieldCategory, string[]> = new Map();
EDUCATION_FIELD_CATEGORIES.forEach((cat: EducationFieldCategory) => organized.set(cat, []));
EDUCATION_FIELDS.forEach((f) => organized.get(f.category)?.push(f.id));

export const EDUCATION_FIELDS_ORGANIZED = organized;*/

// Pre-process the education fields to pass as the "items" prop of dropdowns
const sectioned: {[key: string]: {id: string; items: string[]}} = {};
EDUCATION_FIELD_CATEGORIES.forEach((id: EducationFieldCategory) => (sectioned[id] = {id, items: []}));
EDUCATION_FIELDS.forEach((f) => sectioned[f.category].items.push(f.id));

export const EDUCATION_FIELDS_SECTIONED = Object.values(sectioned);
