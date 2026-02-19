import fs from "fs";

const statuses = ["new", "contacted", "qualified", "lost"];
const sources = ["website", "referral", "cold call", "social media"];
const companies = [
  "TechNova Pvt Ltd",
  "Skyline Solutions",
  "NextGen Technologies",
  "BrightPath Consulting",
  "BlueWave Systems",
  "Vertex Enterprises",
  "Zenith Corp",
  "PrimeEdge Solutions",
  "CodeCraft Labs",
  "InfiniSoft Pvt Ltd",
];

const firstNames = [
  "Rahul",
  "Priya",
  "Amit",
  "Neha",
  "Vikas",
  "Anjali",
  "Rohit",
  "Sneha",
  "Karan",
  "Pooja",
  "Manish",
  "Divya",
  "Sandeep",
  "Ritika",
  "Harsh",
  "Meera",
  "Arjun",
  "Tanvi",
  "Aditya",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Singh",
  "Kapoor",
  "Mehta",
  "Gupta",
  "Kumar",
  "Reddy",
  "Malhotra",
  "Nair",
];

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  company: string;
  assignedTo: number;
  createdAt: string;
}

const leads: Lead[] = [];

for (let i = 1; i <= 1000; i++) {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];

  const last = lastNames[Math.floor(Math.random() * lastNames.length)];

  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));

  leads.push({
    id: i,
    name: `${first} ${last}`,
    email: `lead${i}@gmail.com`,
    phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    assignedTo: Math.random() > 0.5 ? 2 : 3,
    createdAt: createdDate.toISOString(),
  });
}

const db = {
  users: [
    { id: 1, email: "admin@gmail.com", password: "Admin@123", role: "admin" },
    { id: 2, email: "sales@gmail.com", password: "Sales@123", role: "sales" },
    {
      id: 3,
      email: "manager@gmail.com",
      password: "Manager@123",
      role: "manager",
    },
  ],
  leads,
};

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
