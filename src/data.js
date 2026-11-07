// Official Data for JSG-PC Box Cricket League 2026
// Exact participant rosters from official tournament chits

export const LEAGUE_INFO = {
  title: "JSG-PC BOX CRICKET LEAGUE 2026",
  shortTitle: "JSG-PC BCL 2026",
  tagline: "Official Tournament & Live Chit Selection Hub",
  venue: "JSG Box Cricket Turf Club, Pune / PCMC",
  date: "November 2026",
  edition: "2026 Edition",
};

// 10 Official Male Teams with Captains from Category A (#01 to #10)
export const DEFAULT_MALE_TEAMS = [
  {
    id: "m-team-1",
    name: "Team Bhavik Fulfagar",
    shortName: "T-BF",
    captain: "Bhavik Fulfagar",
    color: "#e11d48",
    colorEnd: "#fb7185",
    icon: "crown",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-2",
    name: "Team Devraj Bafna",
    shortName: "T-DB",
    captain: "Devraj Bafna",
    color: "#f59e0b",
    colorEnd: "#facc15",
    icon: "shield",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-3",
    name: "Team Yug Kunkulol",
    shortName: "T-YK",
    captain: "Yug Kunkulol",
    color: "#0284c7",
    colorEnd: "#38bdf8",
    icon: "zap",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-4",
    name: "Team Anuj Chopda",
    shortName: "T-AC",
    captain: "Anuj Chopda",
    color: "#0f766e",
    colorEnd: "#14b8a6",
    icon: "flame",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-5",
    name: "Team Jinesh Pagariya",
    shortName: "T-JP",
    captain: "Jinesh Pagariya",
    color: "#ea580c",
    colorEnd: "#fb923c",
    icon: "sun",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-6",
    name: "Team Sarthak Fulfagar",
    shortName: "T-SF",
    captain: "Sarthak Fulfagar",
    color: "#7c3aed",
    colorEnd: "#a78bfa",
    icon: "swords",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-7",
    name: "Team Gaurav Pagariya",
    shortName: "T-GP",
    captain: "Gaurav Pagariya",
    color: "#2563eb",
    colorEnd: "#60a5fa",
    icon: "award",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-8",
    name: "Team Sanket S Jain",
    shortName: "T-SJ",
    captain: "Sanket S Jain",
    color: "#db2777",
    colorEnd: "#f472b6",
    icon: "star",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-9",
    name: "Team Pranav Khabiya",
    shortName: "T-PK",
    captain: "Pranav Khabiya",
    color: "#dc2626",
    colorEnd: "#ef4444",
    icon: "target",
    slotsTotal: 8,
    division: "male"
  },
  {
    id: "m-team-10",
    name: "Team Pratik Chuttar",
    shortName: "T-PC",
    captain: "Pratik Chuttar",
    color: "#0891b2",
    colorEnd: "#22d3ee",
    icon: "trophy",
    slotsTotal: 8,
    division: "male"
  }
];

// 4 Official Female Teams with Captains from Category A
export const DEFAULT_FEMALE_TEAMS = [
  {
    id: "f-team-1",
    name: "Team Pooja Bhansali",
    shortName: "T-PB",
    captain: "Pooja Bhansali",
    color: "#ec4899",
    colorEnd: "#f43f5e",
    icon: "crown",
    slotsTotal: 10,
    division: "female"
  },
  {
    id: "f-team-2",
    name: "Team Kshitija Khinvasara",
    shortName: "T-KK",
    captain: "Kshitija Khinvasara",
    color: "#8b5cf6",
    colorEnd: "#c084fc",
    icon: "shield",
    slotsTotal: 10,
    division: "female"
  },
  {
    id: "f-team-3",
    name: "Team Leena Porwal",
    shortName: "T-LP",
    captain: "Leena Porwal",
    color: "#f43f5e",
    colorEnd: "#fb7185",
    icon: "sparkles",
    slotsTotal: 10,
    division: "female"
  },
  {
    id: "f-team-4",
    name: "Team SUSHMA Bafna",
    shortName: "T-SB",
    captain: "SUSHMA Bafna",
    color: "#06b6d4",
    colorEnd: "#38bdf8",
    icon: "zap",
    slotsTotal: 10,
    division: "female"
  }
];

// Dynamic Categories definition
export const CATEGORIES = [
  { id: "A", name: "Cat A - Captains", badgeColor: "#f59e0b", description: "Designated Team Captains" },
  { id: "B", name: "Cat B - Star Players", badgeColor: "#10b981", description: "Category B Participants" },
  { id: "BB", name: "Cat BB - Star Players", badgeColor: "#34d399", description: "Category BB Participants" },
  { id: "C", name: "Cat C", badgeColor: "#3b82f6", description: "Category C Participants" },
  { id: "C+", name: "Cat C+", badgeColor: "#0ea5e9", description: "Category C+ Participants" },
  { id: "CC", name: "Cat CC", badgeColor: "#60a5fa", description: "Category CC Participants" },
  { id: "D", name: "Cat D", badgeColor: "#ec4899", description: "Category D Participants" },
  { id: "E", name: "Cat E", badgeColor: "#8b5cf6", description: "Category E Participants" },
  { id: "F", name: "Cat F", badgeColor: "#14b8a6", description: "Category F Participants (20 Chits)" },
  { id: "Z", name: "Cat Z - Special / Pairs", badgeColor: "#f97316", description: "Category Z Chits & Pairs" }
];

// EXACT 80 MALE PARTICIPANTS FROM PDF CHITS
export const INITIAL_MALE_PLAYERS = [

  // CATEGORY A
  { id: "mp-1", name: "Bhavik Fulfagar", category: "A", role: "Captain", division: "male", teamId: "m-team-1", chitNumber: 1, phone: "8446883406", age: "20" },
  { id: "mp-2", name: "Devraj Bafna", category: "A", role: "Captain", division: "male", teamId: "m-team-2", chitNumber: 2, phone: "9322648731", age: "20" },
  { id: "mp-3", name: "Yug Kunkulol", category: "A", role: "Captain", division: "male", teamId: "m-team-3", chitNumber: 3, phone: "9822364141", age: "21" },
  { id: "mp-4", name: "Anuj Chopda", category: "A", role: "Captain", division: "male", teamId: "m-team-4", chitNumber: 4, phone: "8275180699", age: "22" },
  { id: "mp-5", name: "Jinesh Pagariya", category: "A", role: "Captain", division: "male", teamId: "m-team-5", chitNumber: 5, phone: "8421485858", age: "22" },
  { id: "mp-6", name: "Sarthak Fulfagar", category: "A", role: "Captain", division: "male", teamId: "m-team-6", chitNumber: 6, phone: "7770066966", age: "23" },
  { id: "mp-7", name: "Gaurav Pagariya", category: "A", role: "Captain", division: "male", teamId: "m-team-7", chitNumber: 7, phone: "9272730102", age: "25" },
  { id: "mp-8", name: "Sanket S Jain", category: "A", role: "Captain", division: "male", teamId: "m-team-8", chitNumber: 8, phone: "9822822029", age: "28" },
  { id: "mp-9", name: "Pranav Khabiya", category: "A", role: "Captain", division: "male", teamId: "m-team-9", chitNumber: 9, phone: "9890455155", age: "33" },
  { id: "mp-10", name: "Pratik Chuttar", category: "A", role: "Captain", division: "male", teamId: "m-team-10", chitNumber: 10, phone: "8237151430", age: "33" },

  // CATEGORY B
  { id: "mp-11", name: "Veer Kankriya", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "7499124885", age: "17" },
  { id: "mp-12", name: "Aryan Chopda", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "7249830098", age: "20" },
  { id: "mp-13", name: "Om Pagariya", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "7028228014", age: "22" },
  { id: "mp-14", name: "Kushal Shah", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "9511767029", age: "23" },
  { id: "mp-15", name: "Hardik Dhoka", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "8329822694", age: "24" },
  { id: "mp-16", name: "Om Bagmar", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9405439796", age: "25" },
  { id: "mp-17", name: "Samyak Fulfagar", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "9168278216", age: "25" },
  { id: "mp-18", name: "Shubham Pagariya", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "8530941451", age: "26" },
  { id: "mp-19", name: "Palash Kothari", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "8275200284", age: "32" },
  { id: "mp-20", name: "Jitesh Dhoka", category: "B", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "9975005800", age: "35" },

  // CATEGORY BB
  { id: "mp-21", name: "Ridit Porwal", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "8766011338", age: "16" },
  { id: "mp-22", name: "Anup Saklecha", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "7798303030", age: "38" },
  { id: "mp-23", name: "Suyash Bafna", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "9619759739", age: "39" },
  { id: "mp-24", name: "Vinayak Bafna", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "9766551906", age: "42" },
  { id: "mp-25", name: "Rajan Porwal", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "7498867575", age: "44" },
  { id: "mp-26", name: "Prasanna Chopda", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9921366633", age: "46" },
  { id: "mp-27", name: "Vardhaman Bafna", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "9552588316", age: "46" },
  { id: "mp-28", name: "Parag Kunkulol", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "9822364141", age: "47" },
  { id: "mp-29", name: "Vinod Bhansali", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "9766551901", age: "40" },
  { id: "mp-30", name: "Arihant Ranka", category: "BB", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "9960029600", age: "41" },

  // CATEGORY C
  { id: "mp-31", name: "Anant Desarda", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "9970017191", age: "41" },
  { id: "mp-32", name: "Rushab Shingavi", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "8149670160", age: "27" },
  { id: "mp-33", name: "Bhushan Lunkad", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "9422800655", age: "33" },
  { id: "mp-34", name: "Sanket Shingavi", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "8600055557", age: "35" },
  { id: "mp-35", name: "Aakash Bora", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "9404413241", age: "41" },
  { id: "mp-36", name: "Swapnil Khinvasara", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9822111500", age: "42" },
  { id: "mp-37", name: "Atul Kankriya", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "9822761841", age: "49" },
  { id: "mp-38", name: "Kalpesh Pagariya", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "9422036832", age: "51" },
  { id: "mp-39", name: "Akshay Jain", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "8850479603", age: "34" },
  { id: "mp-40", name: "Rupesh Munot", category: "C", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "9096041415", age: "37" },

  // CATEGORY D
  { id: "mp-41", name: "Tushar Baphana", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "9372875517", age: "43" },
  { id: "mp-42", name: "Nitin Tathed", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "9822039592", age: "50" },
  { id: "mp-43", name: "Arnav Bhansali", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "8329399455", age: "16" },
  { id: "mp-44", name: "Jinay Gadiya", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "7276211000", age: "31" },
  { id: "mp-45", name: "Ankit Jain", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "7709000901", age: "32" },
  { id: "mp-46", name: "Pratik Bhansali", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9960977787", age: "37" },
  { id: "mp-47", name: "Pritesh Lodha", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "9920202803", age: "38" },
  { id: "mp-48", name: "Amit Tatiya", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "9028708499", age: "40" },
  { id: "mp-49", name: "Yogesh Meher", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "9511750785", age: "43" },
  { id: "mp-50", name: "Yogesh Bafna", category: "D", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "9326136006", age: "48" },

  // CATEGORY E
  { id: "mp-51", name: "Shaurya Tatiya", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "9028708499", age: "12" },
  { id: "mp-52", name: "Vihaan Lodha", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "9960306451", age: "12" },
  { id: "mp-53", name: "Advik Baphana", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "9021575520", age: "12" },
  { id: "mp-54", name: "Viraj Khinvasara", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "8149895143", age: "13" },
  { id: "mp-55", name: "Hardhik Surana", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "7542028276", age: "14" },
  { id: "mp-56", name: "Parv Pagariya", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9730500444", age: "14" },
  { id: "mp-57", name: "Arnav Baphana", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "9372875511", age: "16" },
  { id: "mp-58", name: "Himanshu Nahata", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "9156787001", age: "16" },
  { id: "mp-59", name: "Parshv Tathed", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "7558656922", age: "19" },
  { id: "mp-60", name: "Arham Sanghavi", category: "E", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "8446410428", age: "22" },

  // CATEGORY F
  { id: "mp-61", name: "Pankaj Khivasara", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 1, phone: "9834084853", age: "32" },
  { id: "mp-62", name: "Rohan Chhajed", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 2, phone: "9420406421", age: "32" },
  { id: "mp-63", name: "Akshay Gadiya", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 3, phone: "7620006050", age: "33" },
  { id: "mp-64", name: "Saurabh Ranka", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 4, phone: "9970343470", age: "36" },
  { id: "mp-65", name: "Dinesh Jain", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 5, phone: "8087953989", age: "37" },
  { id: "mp-66", name: "Nitesh Lunavat", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 6, phone: "9730448261", age: "37" },
  { id: "mp-67", name: "Ishant Saklecha", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 7, phone: "8087103995", age: "38" },
  { id: "mp-68", name: "Pritam Jain", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 8, phone: "9975721626", age: "39" },
  { id: "mp-69", name: "Abhay Bokdiya", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 9, phone: "9922953395", age: "40" },
  { id: "mp-70", name: "Parag Mutha", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 10, phone: "9373443800", age: "40" },
  { id: "mp-71", name: "Manish Jain", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 11, phone: "7798768000", age: "43" },
  { id: "mp-72", name: "Manoj Surana", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 12, phone: "9852453390", age: "44" },
  { id: "mp-73", name: "Abhijit Nahata", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 13, phone: "9370721463", age: "45" },
  { id: "mp-74", name: "Ashish Gandhi", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 14, phone: "9273251688", age: "45" },
  { id: "mp-75", name: "Rakesh Mandesha", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 15, phone: "9822412928", age: "45" },
  { id: "mp-76", name: "Nitin Surana", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 16, phone: "8296604744", age: "46" },
  { id: "mp-77", name: "Nilesh Lunkad", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 17, phone: "9822513130", age: "48" },
  { id: "mp-78", name: "Avinash Bhandari", category: "F", role: "Player", division: "male", teamId: null, chitNumber: 18, phone: "9326521077", age: "49" },
  { id: "mp-79", name: "Sachin Mutha & Vihaan Bafna", category: "F", role: "Player Pair", division: "male", teamId: null, chitNumber: 19, phone: "8793012289 / 8668455379", age: "57 & 10" },
  { id: "mp-80", name: "Riyansh Bokdiya & Rajesh Sanghavi", category: "F", role: "Player Pair", division: "male", teamId: null, chitNumber: 20, phone: "8888802949 / 9890595932", age: "11 & 58" },
];

// EXACT 40 FEMALE PARTICIPANTS FROM PDF CHITS
export const INITIAL_FEMALE_PLAYERS = [

  // CATEGORY A
  { id: "fp-1", name: "Pooja Bhansali", category: "A", role: "Captain", division: "female", teamId: "f-team-1", chitNumber: 35, phone: "7972194685", age: "35" },
  { id: "fp-2", name: "Kshitija Khinvasara", category: "A", role: "Captain", division: "female", teamId: "f-team-2", chitNumber: 41, phone: "9850111500", age: "41" },
  { id: "fp-3", name: "Leena Porwal", category: "A", role: "Captain", division: "female", teamId: "f-team-3", chitNumber: 45, phone: "8668990191", age: "45" },
  { id: "fp-4", name: "SUSHMA Bafna", category: "A", role: "Captain", division: "female", teamId: "f-team-4", chitNumber: 47, phone: "9822254278", age: "47" },

  // CATEGORY B
  { id: "fp-5", name: "Riddhi Katariya", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "7058096096", age: "19" },
  { id: "fp-6", name: "Suhani Rajan porwal", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "9168155205", age: "19" },
  { id: "fp-7", name: "Khushi Pagariya", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 24, phone: "9766760250", age: "24" },
  { id: "fp-8", name: "Sakshi Jain", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 24, phone: "9011380044", age: "24" },
  { id: "fp-9", name: "Samruddhi Sancheti", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 24, phone: "9172677501", age: "24" },
  { id: "fp-10", name: "Saloni Jain", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 26, phone: "7385155999", age: "26" },
  { id: "fp-11", name: "Siddhi S Dhoka", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 26, phone: "8805276363", age: "29" },
  { id: "fp-12", name: "Siddhi Dhoka", category: "B", role: "Player", division: "female", teamId: null, chitNumber: 29, phone: "8805276363", age: "29" },

  // CATEGORY C
  { id: "fp-13", name: "Dhruvi Khinvasara", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 17, phone: "9922111500", age: "17" },
  { id: "fp-14", name: "Bhakti Tathed", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "8261020760", age: "19" },
  { id: "fp-15", name: "Jinal Shah", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "7588041818", age: "19" },
  { id: "fp-16", name: "Palak Nahata", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "9322812515", age: "19" },
  { id: "fp-17", name: "Rashi Pagariya", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 19, phone: "9890735834", age: "19" },
  { id: "fp-18", name: "Komal Shingavi", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 22, phone: "8237956311", age: "22" },
  { id: "fp-19", name: "Sachi Dhoka", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 22, phone: "8766538035", age: "22" },
  { id: "fp-20", name: "Tamanna Shingavi", category: "C", role: "Player", division: "female", teamId: null, chitNumber: 26, phone: "9665766311", age: "26" },

  // CATEGORY C+
  { id: "fp-21", name: "Riddhi Karnawat", category: "C+", role: "Player", division: "female", teamId: null, chitNumber: 27, phone: "7767049945", age: "27" },
  { id: "fp-22", name: "Swati Pagariya", category: "C+", role: "Player", division: "female", teamId: null, chitNumber: 50, phone: "8788910914", age: "50" },
  { id: "fp-23", name: "Sonal Saklecha", category: "C+", role: "Player", division: "female", teamId: null, chitNumber: 35, phone: "9422363124", age: "35" },
  { id: "fp-24", name: "Ashwini Baphana", category: "C+", role: "Player", division: "female", teamId: null, chitNumber: 41, phone: "9021575520", age: "41" },

  // CATEGORY CC
  { id: "fp-25", name: "Sejal Shingavi", category: "CC", role: "Player", division: "female", teamId: null, chitNumber: 33, phone: "9665766311", age: "26" },
  { id: "fp-26", name: "Ruchi Ranka", category: "CC", role: "Player", division: "female", teamId: null, chitNumber: 34, phone: "8177887517", age: "34" },
  { id: "fp-27", name: "Pooja Tathed", category: "CC", role: "Player", division: "female", teamId: null, chitNumber: 47, phone: "7350947549", age: "47" },
  { id: "fp-28", name: "Dipali Nikhil Parakh", category: "CC", role: "Player", division: "female", teamId: null, chitNumber: 34, phone: "8999470236", age: "34" },

  // CATEGORY D
  { id: "fp-29", name: "Kesar Khinvasara", category: "D", role: "Player", division: "female", teamId: null, chitNumber: 12, phone: "9822111500", age: "12" },
  { id: "fp-30", name: "Shanaya Bhansali", category: "D", role: "Player", division: "female", teamId: null, chitNumber: 12, phone: "9766551901", age: "12" },
  { id: "fp-31", name: "Trisha Khinvasara", category: "D", role: "Player", division: "female", teamId: null, chitNumber: 15, phone: "7498149347", age: "15" },
  { id: "fp-32", name: "Samiksha Sancheti", category: "D", role: "Player", division: "female", teamId: null, chitNumber: 16, phone: "9270177501", age: "16" },

  // CATEGORY E
  { id: "fp-33", name: "Neelam Jain", category: "E", role: "Player", division: "female", teamId: null, chitNumber: 37, phone: "9922448123", age: "37" },
  { id: "fp-34", name: "Shraddha Lunavat", category: "E", role: "Player", division: "female", teamId: null, chitNumber: 37, phone: "9921217349", age: "37" },
  { id: "fp-35", name: "Pradnya Lodha", category: "E", role: "Player", division: "female", teamId: null, chitNumber: 38, phone: "9960306451", age: "38" },
  { id: "fp-36", name: "Sneha Bokdiya", category: "E", role: "Player", division: "female", teamId: null, chitNumber: 38, phone: "8888802949", age: "38" },

  // CATEGORY Z
  { id: "fp-37", name: "Pehel Bhansali & Swati Gandhi", category: "Z", role: "Player Pair", division: "female", teamId: null, chitNumber: 45, phone: "7972194685 / 868359767", age: "10 & 45" },
  { id: "fp-38", name: "Tanaya Saklecha & Rupali Sancheti", category: "Z", role: "Player Pair", division: "female", teamId: null, chitNumber: 46, phone: "9096823243 / 7722077501", age: "9 & 46" },
  { id: "fp-39", name: "Sheetal Desarda", category: "Z", role: "Player", division: "female", teamId: null, chitNumber: 40, phone: "9970017191", age: "40" },
  { id: "fp-40", name: "Samta Surana", category: "Z", role: "Player", division: "female", teamId: null, chitNumber: 42, phone: "7903042826", age: "42" },
];

// Official Box Cricket Rules
export const OFFICIAL_RULES = [
  {
    id: "rule-1",
    title: "Squad Composition & Match Overs",
    icon: "users",
    category: "General",
    badge: "Core Rule",
    summary: "Men's division features 8 players a-side (8 overs); Women's division features 10 players a-side (6-8 overs).",
    details: [
      "Men's Division: Playing 8 per side across 10 official teams. Total squad size is 8 players per team.",
      "Women's Division: Playing 10 per side across 4 official teams. Total squad size is 10 players per team.",
      "Each match will consist of 8 overs per side for Men, and 6 or 8 overs per side for Women (decided by tournament committee).",
      "All players must be present at the turf 15 minutes before scheduled toss time."
    ]
  },
  {
    id: "rule-2",
    title: "Net Boundaries & Scoring System",
    icon: "grid",
    category: "Scoring",
    badge: "Crucial",
    summary: "Direct top net is OUT. Side net contact gives 1 run. Back wall boundary gives 4 or 6 runs.",
    details: [
      "Roof / Top Net: Ball hitting the top ceiling net directly without bounce is declared OUT.",
      "Side Nets: Ball hitting side nets allows batsmen to score 1 physical or automatic net run (depending on turf marking).",
      "Straight Boundary (Back Wall): Direct hit without bounce is 6 Runs. Along the carpet turf into back net is 4 Runs.",
      "Net Rebounds: If ball hits side net and is caught before touching the turf, batsman is OUT (as per Box Cricket standard)."
    ]
  },
  {
    id: "rule-3",
    title: "Bowling Regulations & Quotas",
    icon: "target",
    category: "Bowling",
    badge: "Discipline",
    summary: "Maximum 2 overs per bowler in 8-over matches. Strict underarm/throw restrictions apply.",
    details: [
      "Bowling Quota: Maximum 2 overs per bowler in an 8-over innings. Minimum 4 different bowlers must bowl.",
      "Bowling Style: Straight-arm bowling with bent elbow warning. Illegal chucking/throwing leads to 'No Ball' warning, followed by bowler suspension if repeated.",
      "Crease Rule: Bowler must deliver from behind the bowling crease line.",
      "Underarm matches (if agreed for women's division): Bowler must release ball along the ground or below knee height."
    ]
  },
  {
    id: "rule-4",
    title: "Extras: Wide, No Ball & Free Hit",
    icon: "alert-circle",
    category: "Extras",
    badge: "Penalty",
    summary: "Wide and No-ball give 1 extra run + re-ball. Every front-foot or height No-ball results in Free Hit.",
    details: [
      "Wide Ball: Any ball pitched outside the designated wide markings grants 1 run + 1 extra ball.",
      "No Ball: Front-foot overstep, waist-height full toss, or throw bowling results in 1 run + Free Hit on the next delivery.",
      "Free Hit Rule: Batsman cannot be dismissed bowled, caught, or stumped on a Free Hit (only Run Out applies).",
      "Overthrows: If ball rebounds off stumps or fielders onto boundaries, additional runs are counted."
    ]
  },
  {
    id: "rule-5",
    title: "Wicketkeeping & Stumping",
    icon: "shield",
    category: "Fielding",
    badge: "Standard",
    summary: "Wicketkeeper must remain in keeper box until ball passes the batsman.",
    details: [
      "The wicket-keeper must remain behind the stumps within the designated keeper box until the ball has been released and reached the batsman.",
      "Direct stumping is valid only if keeper takes the ball completely behind the stumps.",
      "Leg-before-wicket (LBW) is NOT applicable in Box Cricket."
    ]
  },
  {
    id: "rule-6",
    title: "Time Limit & Over Rate Penalties",
    icon: "clock",
    category: "Timing",
    badge: "Strict",
    summary: "25 minutes allotted per innings. 5 runs penalty per over delayed.",
    details: [
      "Innings duration: Each team is given 25 minutes to bowl their 8 overs.",
      "Slow Over Rate: If a fielding side fails to start their final over before the countdown timer hits 0:00, 5 penalty runs are awarded to the batting side for every over delayed.",
      "In case of rain or lighting stoppage, tournament committee's DLS/average run rate rule applies."
    ]
  },
  {
    id: "rule-7",
    title: "Ties, Super Over & Decision Authority",
    icon: "award",
    category: "Finality",
    badge: "Decision",
    summary: "Tied matches decided by a 1-over Super Over. Umpire decisions are final & absolute.",
    details: [
      "Super Over: In knockout/playoff ties, a 1-over eliminator will be played (3 batsmen nominated, 2 wickets max).",
      "If Super Over is also tied, the team with most boundaries (4s and 6s) in the main match wins.",
      "Umpire's Decision: On-field umpire's call is final and binding on all captains and players.",
      "Code of Conduct: Any form of dissent, abusive language, or misconduct will lead to immediate 10-run penalty or player disqualification."
    ]
  }
];

// Initial League Match Schedule with Actual Captain Teams
export const INITIAL_SCHEDULE = [
  // Men's Division Matches (Pool A & Pool B)
  {
    id: "match-m1",
    matchNumber: 1,
    division: "male",
    stage: "League Match",
    group: "Pool A",
    team1Id: "m-team-1",
    team2Id: "m-team-2",
    date: "2026-11-14",
    time: "09:00 AM",
    turf: "Turf Alpha (Main Arena)",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Bhavik Fulfagar vs Team Devraj Bafna"
  },
  {
    id: "match-m2",
    matchNumber: 2,
    division: "male",
    stage: "League Match",
    group: "Pool B",
    team1Id: "m-team-3",
    team2Id: "m-team-4",
    date: "2026-11-14",
    time: "10:00 AM",
    turf: "Turf Beta",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Yug Kunkulol vs Team Anuj Chopda"
  },
  {
    id: "match-m3",
    matchNumber: 3,
    division: "male",
    stage: "League Match",
    group: "Pool A",
    team1Id: "m-team-5",
    team2Id: "m-team-6",
    date: "2026-11-14",
    time: "11:00 AM",
    turf: "Turf Alpha",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Jinesh Pagariya vs Team Sarthak Fulfagar"
  },
  {
    id: "match-m4",
    matchNumber: 4,
    division: "male",
    stage: "League Match",
    group: "Pool B",
    team1Id: "m-team-7",
    team2Id: "m-team-8",
    date: "2026-11-14",
    time: "12:00 PM",
    turf: "Turf Beta",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Gaurav Pagariya vs Team Sanket S Jain"
  },
  {
    id: "match-m5",
    matchNumber: 5,
    division: "male",
    stage: "League Match",
    group: "Pool A",
    team1Id: "m-team-9",
    team2Id: "m-team-10",
    date: "2026-11-14",
    time: "01:00 PM",
    turf: "Turf Alpha",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Pranav Khabiya vs Team Pratik Chuttar"
  },

  // Women's Division Matches (4 teams)
  {
    id: "match-w1",
    matchNumber: 101,
    division: "female",
    stage: "League Match",
    group: "Women's League",
    team1Id: "f-team-1",
    team2Id: "f-team-2",
    date: "2026-11-14",
    time: "02:30 PM",
    turf: "Turf Alpha",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Pooja Bhansali vs Team Kshitija Khinvasara"
  },
  {
    id: "match-w2",
    matchNumber: 102,
    division: "female",
    stage: "League Match",
    group: "Women's League",
    team1Id: "f-team-3",
    team2Id: "f-team-4",
    date: "2026-11-14",
    time: "03:30 PM",
    turf: "Turf Beta",
    status: "Upcoming",
    team1Score: { runs: 0, wickets: 0, overs: "0.0" },
    team2Score: { runs: 0, wickets: 0, overs: "0.0" },
    winnerId: null,
    mom: null,
    summary: "Team Leena Porwal vs Team SUSHMA Bafna"
  }
];
