/* eslint-disable */
/**
 * EduHub Pakistan — Database Seed Script
 * Run with: bun run scripts/seed.ts
 *
 * Seeds the database with realistic demo data on first run.
 * Idempotent — safe to run multiple times.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const hash = (s: string) => bcrypt.hashSync(s, 10);

async function main() {
  console.log("🌱 Seeding EduHub Pakistan database...");

  // ===== Users =====
  const admin = await db.user.upsert({
    where: { email: "admin@eduhub.pk" },
    update: {},
    create: {
      email: "admin@eduhub.pk",
      password: hash("123456"),
      name: "Platform Admin",
      role: "admin",
      phone: "+92 300 0000000",
    },
  });

  const studentUser = await db.user.upsert({
    where: { email: "student@eduhub.pk" },
    update: {},
    create: {
      email: "student@eduhub.pk",
      password: hash("123456"),
      name: "Ahsan Khan",
      role: "student",
      phone: "+92 300 1234567",
      address: "House 12, Block C, Model Town, Lahore",
    },
  });

  const academyUser = await db.user.upsert({
    where: { email: "academy@eduhub.pk" },
    update: {},
    create: {
      email: "academy@eduhub.pk",
      password: hash("123456"),
      name: "Corvit Admin",
      role: "academy",
      phone: "+92 42 3575 1234",
    },
  });

  const teacherUser = await db.user.upsert({
    where: { email: "teacher@eduhub.pk" },
    update: {},
    create: {
      email: "teacher@eduhub.pk",
      password: hash("123456"),
      name: "Engr. Ahmed Raza",
      role: "teacher",
      phone: "+92 300 1234567",
    },
  });

  console.log("  ✓ Users seeded");

  // Create stub owner accounts for each non-primary academy
  const stubOwners = [
    { email: "owner.aptech@eduhub.pk", name: "Aptech Owner" },
    { email: "owner.navttc@eduhub.pk", name: "NAVTTC Owner" },
    { email: "owner.evs@eduhub.pk", name: "EVS Owner" },
    { email: "owner.educators@eduhub.pk", name: "Educators Owner" },
    { email: "owner.nicon@eduhub.pk", name: "NICON Owner" },
    { email: "owner.pny@eduhub.pk", name: "PNY Owner" },
    { email: "owner.btech@eduhub.pk", name: "Beaconhouse Owner" },
    { email: "owner.saylani@eduhub.pk", name: "Saylani Owner" },
    { email: "owner.arena@eduhub.pk", name: "Arena Owner" },
    { email: "owner.pia@eduhub.pk", name: "PIA Owner" },
    { email: "owner.lums@eduhub.pk", name: "LUMS Owner" },
    { email: "owner.preston@eduhub.pk", name: "Preston Owner" },
    { email: "owner.kips@eduhub.pk", name: "KIPS Owner" },
    { email: "owner.cwh@eduhub.pk", name: "CodeWithHarry Owner" },
    { email: "owner.aitchison@eduhub.pk", name: "Aitchison Owner" },
  ];
  const stubOwnerIds: string[] = [];
  for (const s of stubOwners) {
    const u = await db.user.upsert({
      where: { email: s.email },
      update: {},
      create: { email: s.email, password: hash("123456"), name: s.name, role: "academy", phone: "+92 300 0000000" },
    });
    stubOwnerIds.push(u.id);
  }

  // ===== Academies =====
  const academyData = [
    {
      name: "Corvit Systems", slug: "corvit-systems", logo: "🎓",
      coverColor: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
      rating: 4.8, reviewsCount: 1240, city: "Lahore", area: "Gulberg III",
      address: "65-A, Main Boulevard, Gulberg III, Lahore",
      phone: "+92 42 3575 1234", email: "info@corvit.edu.pk", website: "www.corvit.edu.pk",
      description: "Corvit Systems is a premier IT training institute in Pakistan, offering cutting-edge courses in networking, cybersecurity, cloud computing, and software development. With over 15 years of excellence, Corvit has trained more than 50,000 professionals who are now working in leading tech companies worldwide.",
      category: "IT & Technology", feeRange: "Rs 25,000 - Rs 150,000", minFee: 25000, maxFee: 150000,
      distance: 2.4, timings: "9:00 AM - 9:00 PM",
      facilities: ["Modern Labs", "AC Classrooms", "Library", "Parking", "Cafeteria", "Free WiFi"],
      coursesList: ["CCNA", "CCNP", "Ethical Hacking", "AWS Cloud", "Python Development", "Network Security"],
      totalStudents: 850, totalTeachers: 32, verified: true, latitude: 31.5204, longitude: 74.3587,
    },
    {
      name: "Aptech Computer Education", slug: "aptech-computer-education", logo: "💻",
      coverColor: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
      rating: 4.6, reviewsCount: 980, city: "Karachi", area: "Shahrah-e-Faisal",
      address: "Plot 14-C, Shahrah-e-Faisal, Block 6, PECHS, Karachi",
      phone: "+92 21 3456 7890", email: "info@aptech.pk", website: "www.aptech.pk",
      description: "Aptech Computer Education is a global leader in IT training with presence in over 40 countries. Our Karachi campus offers comprehensive programs in software engineering, mobile app development, data science, and digital marketing.",
      category: "IT & Technology", feeRange: "Rs 35,000 - Rs 200,000", minFee: 35000, maxFee: 200000,
      distance: 5.1, timings: "8:00 AM - 10:00 PM",
      facilities: ["Modern Labs", "AC Classrooms", "Placement Cell", "Library", "Cafeteria", "Free WiFi"],
      coursesList: ["Software Engineering", "Mobile App Development", "Data Science", "Digital Marketing", "Web Development", "UI/UX Design"],
      totalStudents: 1200, totalTeachers: 45, verified: true, latitude: 24.8607, longitude: 67.0011,
    },
    {
      name: "NAVTTC Training Center", slug: "navttc-training-center", logo: "🏛️",
      coverColor: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      rating: 4.4, reviewsCount: 720, city: "Islamabad", area: "G-9 Markaz",
      address: "National Vocational & Technical Training Commission, G-9 Markaz, Islamabad",
      phone: "+92 51 9100 234", email: "info@navttc.gov.pk", website: "www.navttc.gov.pk",
      description: "The National Vocational & Technical Training Commission (NAVTTC) is the government's flagship program for technical and vocational education. We offer free and subsidized courses in high-demand skills including AI, blockchain, IoT, and advanced manufacturing.",
      category: "Government", feeRange: "Rs 5,000 - Rs 50,000", minFee: 5000, maxFee: 50000,
      distance: 8.2, timings: "9:00 AM - 6:00 PM",
      facilities: ["Government Certified", "Free Courses", "Job Placement", "AC Classrooms", "Library"],
      coursesList: ["Artificial Intelligence", "Blockchain Development", "IoT Systems", "CNC Programming", "Mobile Repair", "Tailoring & Fashion"],
      totalStudents: 650, totalTeachers: 28, verified: true, latitude: 33.6844, longitude: 73.0479,
    },
    {
      name: "EVS Professional Training", slug: "evs-professional-training", logo: "📊",
      coverColor: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      rating: 4.5, reviewsCount: 850, city: "Lahore", area: "Johar Town",
      address: "Block H-2, Johar Town, Lahore",
      phone: "+92 42 3521 9876", email: "info@evs.edu.pk", website: "www.evs.edu.pk",
      description: "EVS Professional Training Institute specializes in accounting, finance, and business management courses. We are an ACCA-approved learning partner and offer globally recognized certifications including CMA, CIA, and QuickBooks.",
      category: "Business & Finance", feeRange: "Rs 30,000 - Rs 250,000", minFee: 30000, maxFee: 250000,
      distance: 3.7, timings: "8:00 AM - 9:00 PM",
      facilities: ["AC Classrooms", "Computer Lab", "Library", "Career Counseling", "Parking"],
      coursesList: ["ACCA", "CMA", "QuickBooks", "SAP FICO", "Taxation", "Audit & Assurance"],
      totalStudents: 540, totalTeachers: 22, verified: true, latitude: 31.4694, longitude: 74.2739,
    },
    {
      name: "The Educators Academy", slug: "the-educators-academy", logo: "📚",
      coverColor: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
      rating: 4.7, reviewsCount: 1560, city: "Lahore", area: "Model Town",
      address: "Block B, Model Town Extension, Lahore",
      phone: "+92 42 3544 5566", email: "info@educatorsacademy.pk", website: "www.educatorsacademy.pk",
      description: "The Educators Academy is a leading coaching center for intermediate and entry test preparation. We specialize in MDCAT, ECAT, NUST, GIKI, and LUMS entry test preparation with a proven track record of producing top position holders.",
      category: "Test Preparation", feeRange: "Rs 15,000 - Rs 80,000", minFee: 15000, maxFee: 80000,
      distance: 1.8, timings: "6:00 AM - 10:00 PM",
      facilities: ["AC Classrooms", "Digital Library", "Hostel", "Transport", "Cafeteria", "Sports Complex"],
      coursesList: ["MDCAT Preparation", "ECAT Preparation", "NUST Entry Test", "FSc Pre-Eng", "FSc Pre-Med", "A-Levels"],
      totalStudents: 1450, totalTeachers: 58, verified: true, latitude: 31.4739, longitude: 74.3231,
    },
    {
      name: "NICON Group of Colleges", slug: "nicon-group-of-colleges", logo: "🎯",
      coverColor: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
      rating: 4.3, reviewsCount: 620, city: "Rawalpindi", area: "Saddar",
      address: "The Mall Road, Saddar, Rawalpindi Cantt",
      phone: "+92 51 555 1234", email: "info@nicon.edu.pk", website: "www.nicon.edu.pk",
      description: "NICON Group of Colleges is a multidisciplinary educational institute offering courses in IT, business, languages, and vocational training. We are affiliated with the Federal Board and offer HEC-recognized programs.",
      category: "Languages & IT", feeRange: "Rs 10,000 - Rs 120,000", minFee: 10000, maxFee: 120000,
      distance: 6.5, timings: "8:00 AM - 8:00 PM",
      facilities: ["Smart Classrooms", "Language Lab", "Computer Lab", "Library", "Cafeteria"],
      coursesList: ["IELTS Preparation", "German Language", "Chinese Language", "Web Development", "Office Management", "Graphic Design"],
      totalStudents: 780, totalTeachers: 35, verified: true, latitude: 33.5973, longitude: 73.0479,
    },
    {
      name: "PNY Trainings", slug: "pny-trainings", logo: "⚡",
      coverColor: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
      rating: 4.5, reviewsCount: 1100, city: "Lahore", area: "Arfa Karim Tower",
      address: "Arfa Software Technology Park, Ferozepur Road, Lahore",
      phone: "+92 42 3588 9999", email: "info@pnytrainings.com", website: "www.pnytrainings.com",
      description: "PNY Trainings is Pakistan's largest IT training institute with campuses in all major cities. We offer 100+ courses in emerging technologies including Amazon FBA, digital marketing, SEO, graphic designing, and web development.",
      category: "IT & Technology", feeRange: "Rs 20,000 - Rs 100,000", minFee: 20000, maxFee: 100000,
      distance: 4.2, timings: "9:00 AM - 11:00 PM",
      facilities: ["Modern Labs", "AC Classrooms", "Online Classes", "Career Support", "Free WiFi", "Cafeteria"],
      coursesList: ["Amazon FBA", "Digital Marketing", "SEO Training", "Graphic Designing", "Web Development", "Video Editing"],
      totalStudents: 1600, totalTeachers: 52, verified: true, latitude: 31.4504, longitude: 74.3396,
    },
    {
      name: "Beaconhouse Tech Academy", slug: "beaconhouse-tech-academy", logo: "🏫",
      coverColor: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
      rating: 4.6, reviewsCount: 890, city: "Lahore", area: "Garden Town",
      address: "Beaconhouse National University, Garden Town, Lahore",
      phone: "+92 42 3590 7777", email: "admissions@btech.edu.pk", website: "www.btech.edu.pk",
      description: "Beaconhouse Tech Academy, part of the Beaconhouse group, offers world-class education in computer science, software engineering, and data analytics. We are affiliated with leading international universities and offer exchange programs.",
      category: "Higher Education", feeRange: "Rs 50,000 - Rs 350,000", minFee: 50000, maxFee: 350000,
      distance: 7.3, timings: "8:00 AM - 6:00 PM",
      facilities: ["Research Labs", "Startup Incubator", "Library", "Sports Complex", "Hostel", "Transport"],
      coursesList: ["BS Computer Science", "Software Engineering", "Data Analytics", "Game Development", "Cyber Security", "Cloud Computing"],
      totalStudents: 920, totalTeachers: 48, verified: true, latitude: 31.5050, longitude: 74.3313,
    },
    // ===== Additional academies (expanded dataset) =====
    {
      name: "Saylani Mass IT Training", slug: "saylani-mass-it-training", logo: "🕌",
      coverColor: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      rating: 4.7, reviewsCount: 2100, city: "Karachi", area: "Bahadurabad",
      address: "Saylani Welfare Trust, Bahadurabad Chowrangi, Karachi",
      phone: "+92 21 3431 2345", email: "admissions@saylani.edu.pk", website: "www.saylani.edu.pk",
      description: "Saylani Mass IT Training (SMIT) is Pakistan's largest free IT training program, offering courses in AI, web development, mobile apps, and digital marketing to over 50,000 students. Backed by Saylani Welfare Trust, our mission is to make tech education accessible to everyone.",
      category: "IT & Technology", feeRange: "Rs 0 - Rs 5,000", minFee: 0, maxFee: 5000,
      distance: 9.5, timings: "9:00 AM - 9:00 PM",
      facilities: ["Free Courses", "Modern Labs", "AC Classrooms", "Job Placement", "Free WiFi", "Cafeteria"],
      coursesList: ["Web & Mobile App Development", "AI & ChatGPT", "Digital Marketing", "Graphic Design", "Python", "Cyber Security"],
      totalStudents: 5200, totalTeachers: 95, verified: true, latitude: 24.8934, longitude: 67.0617,
    },
    {
      name: "Arena Multimedia", slug: "arena-multimedia", logo: "🎨",
      coverColor: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
      rating: 4.4, reviewsCount: 540, city: "Lahore", area: "Liberty Market",
      address: "24-B, Liberty Market, Gulberg III, Lahore",
      phone: "+92 42 3575 6789", email: "info@arena.edu.pk", website: "www.arena-multimedia.pk",
      description: "Arena Multimedia is a specialized institute for creative arts including animation, VFX, graphic design, and game development. With industry-experienced faculty and Adobe-certified curriculum, we prepare students for careers in the booming digital media industry.",
      category: "Creative Arts", feeRange: "Rs 40,000 - Rs 180,000", minFee: 40000, maxFee: 180000,
      distance: 2.8, timings: "10:00 AM - 8:00 PM",
      facilities: ["Mac Lab", "Drawing Tablets", "AC Classrooms", "Studio", "Cafeteria", "Free WiFi"],
      coursesList: ["3D Animation", "Graphic Design", "Video Editing", "UI/UX Design", "Game Art", "VFX"],
      totalStudents: 480, totalTeachers: 18, verified: true, latitude: 31.5152, longitude: 74.3438,
    },
    {
      name: "PIA Training Institute", slug: "pia-training-institute", logo: "✈️",
      coverColor: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
      rating: 4.2, reviewsCount: 380, city: "Karachi", area: "Airport Road",
      address: "PIA Training Centre, Airport Road, Karachi",
      phone: "+92 21 3461 7777", email: "training@piac.com.pk", website: "www.piac.com.pk/training",
      description: "Pakistan International Airlines Training Institute offers aviation, hospitality, and travel management courses. As the national carrier's training arm, we provide internationally recognized certifications in cabin crew, ticketing, and airport operations.",
      category: "Aviation & Hospitality", feeRange: "Rs 60,000 - Rs 350,000", minFee: 60000, maxFee: 350000,
      distance: 12.0, timings: "9:00 AM - 5:00 PM",
      facilities: ["Mock Cabin", "AC Classrooms", "Simulator", "Library", "Cafeteria", "Hostel"],
      coursesList: ["Cabin Crew Training", "Airline Ticketing", "Airport Operations", "Travel & Tourism", "Hospitality Management", "Aviation Safety"],
      totalStudents: 320, totalTeachers: 24, verified: true, latitude: 24.9008, longitude: 67.1681,
    },
    {
      name: "LUMS Language Center", slug: "lums-language-center", logo: "🗣️",
      coverColor: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
      rating: 4.8, reviewsCount: 720, city: "Lahore", area: "DHA Phase 5",
      address: "Lahore University of Management Sciences, DHA Phase 5, Lahore",
      phone: "+92 42 3560 8000", email: "language@lums.edu.pk", website: "www.lums.edu.pk/language",
      description: "LUMS Language Center offers premium language courses in English, German, French, Chinese, and Arabic. Our certified instructors follow the Common European Framework of Reference (CEFR) and prepare students for IELTS, TOEFL, Goethe, and HSK certifications.",
      category: "Languages", feeRange: "Rs 25,000 - Rs 150,000", minFee: 25000, maxFee: 150000,
      distance: 5.5, timings: "8:00 AM - 8:00 PM",
      facilities: ["Language Lab", "AC Classrooms", "Library", "Audio-Visual Center", "Cafeteria", "Parking"],
      coursesList: ["IELTS Academic", "German (A1-B2)", "French (A1-B2)", "Chinese (HSK 1-6)", "English Conversation", "Arabic"],
      totalStudents: 650, totalTeachers: 28, verified: true, latitude: 31.4807, longitude: 74.4054,
    },
    {
      name: "Preston Institute of Management", slug: "preston-institute-management", logo: "🏢",
      coverColor: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
      rating: 4.1, reviewsCount: 290, city: "Islamabad", area: "F-8 Markaz",
      address: "Preston University, F-8 Markaz, Islamabad",
      phone: "+92 51 2288 999", email: "info@preston.edu.pk", website: "www.preston.edu.pk",
      description: "Preston Institute of Management offers MBA, BBA, and professional management certifications. Affiliated with HEC-recognized universities, our programs combine academic rigor with practical industry exposure through internships and live projects.",
      category: "Business & Finance", feeRange: "Rs 80,000 - Rs 450,000", minFee: 80000, maxFee: 450000,
      distance: 7.8, timings: "9:00 AM - 6:00 PM",
      facilities: ["AC Classrooms", "Computer Lab", "Library", "Career Cell", "Cafeteria", "Transport"],
      coursesList: ["MBA", "BBA", "Project Management (PMP)", "Human Resource Management", "Supply Chain", "Marketing"],
      totalStudents: 420, totalTeachers: 22, verified: false, latitude: 33.6844, longitude: 73.0479,
    },
    {
      name: "Kips Academy", slug: "kips-academy", logo: "🏆",
      coverColor: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
      rating: 4.6, reviewsCount: 3400, city: "Lahore", area: "Model Town",
      address: "KIPS Education System, Model Town Link Road, Lahore",
      phone: "+92 42 3544 1111", email: "info@kips.edu.pk", website: "www.kips.edu.pk",
      description: "KIPS Academy is Pakistan's largest test preparation network with 200+ campuses nationwide. We produce top positions in MDCAT, ECAT, NUST, FAST, and GIKI entry tests every year. Our experienced faculty and rigorous testing system ensure student success.",
      category: "Test Preparation", feeRange: "Rs 20,000 - Rs 120,000", minFee: 20000, maxFee: 120000,
      distance: 2.2, timings: "6:00 AM - 11:00 PM",
      facilities: ["AC Classrooms", "Digital Library", "Hostel", "Transport", "Cafeteria", "Sports Complex"],
      coursesList: ["MDCAT Preparation", "ECAT Preparation", "NUST NET", "FAST Entry Test", " Intermediate", "A-Levels"],
      totalStudents: 8500, totalTeachers: 180, verified: true, latitude: 31.4739, longitude: 74.3231,
    },
    {
      name: "CodeWithHarry Academy", slug: "codewithharry-academy", logo: "👨‍💻",
      coverColor: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
      rating: 4.5, reviewsCount: 920, city: "Islamabad", area: "I-8 Markaz",
      address: "CodeWithHarry Training Center, I-8 Markaz, Islamabad",
      phone: "+92 51 4441 234", email: "admissions@codewithharry.pk", website: "www.codewithharry.pk",
      description: "CodeWithHarry Academy brings Pakistan's most popular programming YouTube channel into a physical classroom. We offer intensive bootcamps in web development, Python, JavaScript, and full-stack engineering with 100% placement support.",
      category: "IT & Technology", feeRange: "Rs 35,000 - Rs 180,000", minFee: 35000, maxFee: 180000,
      distance: 6.8, timings: "9:00 AM - 10:00 PM",
      facilities: ["Modern Labs", "Online Classes", "Career Support", "Free WiFi", "Cafeteria", "Co-working Space"],
      coursesList: ["Full Stack Web Development", "Python Mastery", "JavaScript Bootcamp", "React & Next.js", "Node.js Backend", "DevOps"],
      totalStudents: 1100, totalTeachers: 14, verified: true, latitude: 33.6677, longitude: 73.0752,
    },
    {
      name: "Aitchison College Prep", slug: "aitchison-college-prep", logo: "🏛️",
      coverColor: "linear-gradient(135deg, #4338CA 0%, #312E81 100%)",
      rating: 4.9, reviewsCount: 180, city: "Lahore", area: "Jail Road",
      address: "Aitchison College, Shahrah-e-Quaid-e-Azam, Lahore",
      phone: "+92 42 3636 5555", email: "prep@aitchison.edu.pk", website: "www.aitchison.edu.pk",
      description: "Aitchison College Prep offers elite O-Level and A-Level preparation with a legacy of producing Rhodes Scholars and world leaders. Our distinguished faculty, world-class facilities, and century-old tradition of excellence make us Pakistan's premier institution.",
      category: "Higher Education", feeRange: "Rs 200,000 - Rs 850,000", minFee: 200000, maxFee: 850000,
      distance: 3.2, timings: "8:00 AM - 4:00 PM",
      facilities: ["Heritage Campus", "Library", "Sports Complex", "Swimming Pool", "Hostel", "Auditorium"],
      coursesList: ["O-Level", "A-Level", "SAT Preparation", "Cambridge Exams", "University Counseling", "Scholarship Prep"],
      totalStudents: 280, totalTeachers: 45, verified: true, latitude: 31.5607, longitude: 74.3358,
    },
  ];

  const academyIds: Record<string, string> = {};

  for (let i = 0; i < academyData.length; i++) {
    const a = academyData[i];
    const { facilities, coursesList, ...academyFields } = a;
    // First academy (Corvit) is owned by academyUser, rest by stub owners
    const ownerId = i === 0 ? academyUser.id : stubOwnerIds[i - 1];
    const created = await db.academy.upsert({
      where: { slug: a.slug },
      update: {
        rating: a.rating, reviewsCount: a.reviewsCount,
        facilitiesJson: JSON.stringify(facilities),
        coursesListJson: JSON.stringify(coursesList),
        totalStudents: a.totalStudents, totalTeachers: a.totalTeachers,
        verified: a.verified, latitude: a.latitude, longitude: a.longitude,
        ownerId,
      },
      create: {
        ...academyFields,
        ownerId,
        facilitiesJson: JSON.stringify(facilities),
        coursesListJson: JSON.stringify(coursesList),
        galleryJson: JSON.stringify([
          { emoji: "🎓", gradient: a.coverColor, title: "Graduation Ceremony" },
          { emoji: "📚", gradient: "linear-gradient(135deg, #10B981, #059669)", title: "Library" },
          { emoji: "💻", gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", title: "Computer Lab" },
          { emoji: "🏛️", gradient: "linear-gradient(135deg, #F59E0B, #D97706)", title: "Main Building" },
        ]),
      },
    });
    academyIds[a.slug] = created.id;
  }
  console.log(`  ✓ Academies seeded (${academyData.length})`);

  // ===== Courses =====
  // Delete existing first to avoid duplicates on re-seed
  await db.course.deleteMany({});
  const courseData = [
    { academySlug: "corvit-systems", name: "CCNA Routing & Switching", duration: "6 months", fee: 75000, description: "Comprehensive Cisco networking certification covering routing, switching, and network fundamentals.", instructor: "Engr. Ahmed Raza", seats: 30, enrolled: 22, category: "Networking" },
    { academySlug: "corvit-systems", name: "Ethical Hacking & Cybersecurity", duration: "4 months", fee: 120000, description: "Learn penetration testing, vulnerability assessment, and security best practices.", instructor: "Usman Khalid", seats: 25, enrolled: 25, category: "Cybersecurity", status: "full" },
    { academySlug: "corvit-systems", name: "AWS Cloud Practitioner", duration: "3 months", fee: 50000, description: "Master Amazon Web Services cloud platform and earn industry-recognized certification.", instructor: "Sana Tariq", seats: 40, enrolled: 18, category: "Cloud" },
    { academySlug: "aptech-computer-education", name: "Diploma in Software Engineering", duration: "2 years", fee: 200000, description: "Complete software engineering program covering full-stack development, databases, and DevOps.", instructor: "Bilal Khan", seats: 50, enrolled: 38, category: "Software" },
    { academySlug: "aptech-computer-education", name: "Mobile App Development", duration: "8 months", fee: 95000, description: "Build native and cross-platform mobile apps for Android and iOS using React Native.", instructor: "Farhan Ahmed", seats: 35, enrolled: 28, category: "Mobile" },
    { academySlug: "aptech-computer-education", name: "Data Science Bootcamp", duration: "6 months", fee: 150000, description: "Learn Python, ML, deep learning, and data visualization with real datasets.", instructor: "Dr. Ayesha Malik", seats: 30, enrolled: 25, category: "Data Science" },
    { academySlug: "navttc-training-center", name: "AI & Machine Learning", duration: "6 months", fee: 25000, description: "Government-subsidized AI/ML course with hands-on project experience.", instructor: "Hamza Sheikh", seats: 40, enrolled: 35, category: "AI" },
    { academySlug: "evs-professional-training", name: "ACCA Foundation", duration: "1 year", fee: 120000, description: "Start your ACCA journey with foundational accounting and business knowledge.", instructor: "CA Saima Noreen", seats: 60, enrolled: 45, category: "Accounting" },
    { academySlug: "evs-professional-training", name: "SAP FICO Consultant", duration: "3 months", fee: 250000, description: "Become a certified SAP FICO consultant with hands-on ERP training.", instructor: "FCMA Tahir Mehmood", seats: 20, enrolled: 12, category: "ERP" },
    { academySlug: "the-educators-academy", name: "MDCAT Crash Course", duration: "3 months", fee: 45000, description: "Intensive medical college admission test preparation with daily tests.", instructor: "Dr. Imran Qureshi", seats: 100, enrolled: 85, category: "Test Prep" },
    { academySlug: "the-educators-academy", name: "ECAT Preparation", duration: "4 months", fee: 35000, description: "Engineering College Admission Test prep covering Physics, Math, Chemistry.", instructor: "Prof. Naveed Iqbal", seats: 80, enrolled: 60, category: "Test Prep" },
    { academySlug: "nicon-group-of-colleges", name: "IELTS Academic", duration: "2 months", fee: 18000, description: "Achieve band 7+ in IELTS with experienced British Council trainers.", instructor: "Sarah Williams", seats: 30, enrolled: 24, category: "Languages" },
    { academySlug: "pny-trainings", name: "Amazon FBA Mastery", duration: "2 months", fee: 35000, description: "Build a profitable Amazon FBA business from Pakistan with complete training.", instructor: "Muhammad Yasin", seats: 50, enrolled: 42, category: "E-commerce" },
    { academySlug: "pny-trainings", name: "Digital Marketing Pro", duration: "3 months", fee: 40000, description: "Master SEO, PPC, social media, and content marketing.", instructor: "Hina Aslam", seats: 45, enrolled: 38, category: "Marketing" },
    { academySlug: "beaconhouse-tech-academy", name: "BS Computer Science", duration: "4 years", fee: 350000, description: "Comprehensive CS degree covering algorithms, AI, software engineering, and more.", instructor: "Dr. Saeed Ahmed", seats: 60, enrolled: 55, category: "Degree" },
    // ===== Courses for expanded academies =====
    { academySlug: "saylani-mass-it-training", name: "Web & Mobile App Development", duration: "1 year", fee: 0, description: "Free comprehensive full-stack bootcamp covering React, Node.js, React Native, and Python.", instructor: "Sir Ghous", seats: 200, enrolled: 180, category: "Software" },
    { academySlug: "saylani-mass-it-training", name: "AI & ChatGPT Course", duration: "6 months", fee: 5000, description: "Master AI tools, prompt engineering, and build AI-powered applications.", instructor: "Sir Ali", seats: 150, enrolled: 130, category: "AI" },
    { academySlug: "arena-multimedia", name: "3D Animation Master", duration: "1 year", fee: 180000, description: "Master 3D modeling, rigging, animation, and rendering with Maya and Blender.", instructor: "Yasir Khan", seats: 25, enrolled: 18, category: "Animation" },
    { academySlug: "arena-multimedia", name: "Graphic Design Pro", duration: "6 months", fee: 65000, description: "Adobe Photoshop, Illustrator, InDesign, and brand identity design.", instructor: "Sidra Ali", seats: 30, enrolled: 25, category: "Design" },
    { academySlug: "pia-training-institute", name: "Cabin Crew Training", duration: "6 months", fee: 180000, description: "Become a certified flight attendant with PIA's official training program.", instructor: "Capt. Rehan", seats: 40, enrolled: 28, category: "Aviation" },
    { academySlug: "lums-language-center", name: "IELTS Academic Plus", duration: "3 months", fee: 45000, description: "Premium IELTS preparation with native speakers, guaranteed band 7+.", instructor: "Dr. Emily Carter", seats: 20, enrolled: 18, category: "Languages" },
    { academySlug: "lums-language-center", name: "German A1-B2", duration: "10 months", fee: 95000, description: "Complete German language program from beginner to intermediate.", instructor: "Herr Müller", seats: 25, enrolled: 22, category: "Languages" },
    { academySlug: "preston-institute-management", name: "MBA Executive", duration: "2 years", fee: 450000, description: "HEC-recognized MBA for working professionals with weekend classes.", instructor: "Dr. Khalid Mehmood", seats: 40, enrolled: 32, category: "Business" },
    { academySlug: "kips-academy", name: "MDCAT 2025 Prime", duration: "4 months", fee: 85000, description: "Comprehensive MDCAT prep with daily tests, top faculty, and proven results.", instructor: "Dr. Saima Aslam", seats: 200, enrolled: 185, category: "Test Prep" },
    { academySlug: "kips-academy", name: "ECAT Crash Program", duration: "2 months", fee: 45000, description: "Intensive ECAT preparation for engineering university admission.", instructor: "Prof. Riaz Ahmed", seats: 150, enrolled: 120, category: "Test Prep" },
    { academySlug: "codewithharry-academy", name: "Full Stack Web Development", duration: "6 months", fee: 120000, description: "Master MERN stack: MongoDB, Express, React, Node.js with real projects.", instructor: "Harry Khan", seats: 35, enrolled: 32, category: "Software" },
    { academySlug: "codewithharry-academy", name: "Python Mastery", duration: "4 months", fee: 65000, description: "From Python basics to advanced OOP, web scraping, and automation.", instructor: "Hassan Raza", seats: 40, enrolled: 35, category: "Programming" },
    { academySlug: "aitchison-college-prep", name: "A-Level Mathematics", duration: "2 years", fee: 450000, description: "Cambridge A-Level Mathematics with distinguished faculty.", instructor: "Dr. Ahsan Iqbal", seats: 25, enrolled: 22, category: "A-Level" },
  ];
  for (const c of courseData) {
    await db.course.create({
      data: {
        academyId: academyIds[c.academySlug],
        name: c.name, duration: c.duration, fee: c.fee,
        description: c.description, instructor: c.instructor,
        seats: c.seats, enrolled: c.enrolled, category: c.category,
        status: (c as any).status || "active",
      },
    });
  }
  console.log(`  ✓ Courses seeded (${courseData.length})`);

  // ===== Teachers =====
  await db.teacher.deleteMany({});
  const teacherData = [
    { academySlug: "corvit-systems", name: "Engr. Ahmed Raza", qualification: "MS Network Engineering (NUST)", experience: "12 years", specialization: "Cisco Networking", phone: "+92 300 1234567", email: "ahmed.raza@corvit.edu.pk", userId: teacherUser.id },
    { academySlug: "corvit-systems", name: "Usman Khalid", qualification: "CEH, OSCP Certified", experience: "8 years", specialization: "Cybersecurity", phone: "+92 301 2345678", email: "usman.k@corvit.edu.pk" },
    { academySlug: "corvit-systems", name: "Sana Tariq", qualification: "AWS Solutions Architect", experience: "6 years", specialization: "Cloud Computing", phone: "+92 302 3456789", email: "sana.t@corvit.edu.pk" },
    { academySlug: "aptech-computer-education", name: "Bilal Khan", qualification: "MS Computer Science (LUMS)", experience: "10 years", specialization: "Full-Stack Development", phone: "+92 333 4567890", email: "bilal.k@aptech.pk" },
    { academySlug: "the-educators-academy", name: "Dr. Imran Qureshi", qualification: "MBBS, MD (King Edward)", experience: "15 years", specialization: "Biology & Chemistry", phone: "+92 321 5678901", email: "imran.q@educators.pk" },
  ];
  const teacherIds: string[] = [];
  for (const t of teacherData) {
    const created = await db.teacher.create({
      data: {
        academyId: academyIds[t.academySlug],
        name: t.name, qualification: t.qualification,
        experience: t.experience, specialization: t.specialization,
        phone: t.phone, email: t.email,
        userId: (t as any).userId,
        assignedCourseIdsJson: "[]",
      },
    });
    teacherIds.push(created.id);
  }
  console.log("  ✓ Teachers seeded (5)");

  // ===== Students =====
  await db.student.deleteMany({});
  const studentData = [
    { academySlug: "corvit-systems", name: "Ahsan Khan", rollNumber: "COR-2024-001", course: "CCNA Routing & Switching", teacherName: "Engr. Ahmed Raza", phone: "+92 300 1111111", email: "ahsan.khan@gmail.com", gender: "male", address: "House 12, Block C, Model Town, Lahore", attendance: 92, progress: 78, teacherIdx: 0 },
    { academySlug: "corvit-systems", name: "Fatima Ali", rollNumber: "COR-2024-002", course: "CCNA Routing & Switching", teacherName: "Engr. Ahmed Raza", phone: "+92 300 2222222", email: "fatima.ali@gmail.com", gender: "female", address: "Flat 5, Gulberg V, Lahore", attendance: 88, progress: 82, teacherIdx: 0 },
    { academySlug: "corvit-systems", name: "Bilal Ahmed", rollNumber: "COR-2024-003", course: "CCNA Routing & Switching", teacherName: "Engr. Ahmed Raza", phone: "+92 300 3333333", email: "bilal.ahmed@gmail.com", gender: "male", address: "34-B, DHA Phase 5, Lahore", attendance: 95, progress: 88, teacherIdx: 0 },
    { academySlug: "corvit-systems", name: "Zainab Hassan", rollNumber: "COR-2024-004", course: "Ethical Hacking & Cybersecurity", teacherName: "Usman Khalid", phone: "+92 300 4444444", email: "zainab.h@gmail.com", gender: "female", address: "78, Johar Town, Lahore", attendance: 90, progress: 75, teacherIdx: 1 },
    { academySlug: "corvit-systems", name: "Hamza Sheikh", rollNumber: "COR-2024-005", course: "Ethical Hacking & Cybersecurity", teacherName: "Usman Khalid", phone: "+92 300 5555555", email: "hamza.s@gmail.com", gender: "male", address: "12-A, Faisal Town, Lahore", attendance: 85, progress: 70, teacherIdx: 1 },
    { academySlug: "corvit-systems", name: "Ayesha Siddiqui", rollNumber: "COR-2024-006", course: "AWS Cloud Practitioner", teacherName: "Sana Tariq", phone: "+92 300 6666666", email: "ayesha.s@gmail.com", gender: "female", address: "45, Garden Town, Lahore", attendance: 87, progress: 65, teacherIdx: 2 },
    { academySlug: "aptech-computer-education", name: "Usman Tariq", rollNumber: "APT-2024-001", course: "Diploma in Software Engineering", teacherName: "Bilal Khan", phone: "+92 301 7777777", email: "usman.t@gmail.com", gender: "male", address: "Block 6, PECHS, Karachi", attendance: 89, progress: 72, teacherIdx: 3 },
    { academySlug: "the-educators-academy", name: "Mariam Iqbal", rollNumber: "EDU-2024-001", course: "MDCAT Crash Course", teacherName: "Dr. Imran Qureshi", phone: "+92 321 8888888", email: "mariam.i@gmail.com", gender: "female", address: "23-A, Model Town, Lahore", attendance: 96, progress: 90, teacherIdx: 4 },
    { academySlug: "the-educators-academy", name: "Abdullah Malik", rollNumber: "EDU-2024-002", course: "MDCAT Crash Course", teacherName: "Dr. Imran Qureshi", phone: "+92 321 9999999", email: "abdullah.m@gmail.com", gender: "male", address: "78-B, Garden Town, Lahore", attendance: 91, progress: 85, teacherIdx: 4 },
  ];
  for (const s of studentData) {
    await db.student.create({
      data: {
        academyId: academyIds[s.academySlug],
        teacherId: s.teacherIdx != null ? teacherIds[s.teacherIdx] : null,
        name: s.name, rollNumber: s.rollNumber, course: s.course,
        teacherName: s.teacherName, phone: s.phone, email: s.email,
        gender: s.gender, address: s.address,
        admissionDate: "2024-03-15",
        status: "active",
        attendance: s.attendance, progress: s.progress,
      },
    });
  }
  console.log("  ✓ Students seeded (9)");

  // ===== Reviews =====
  await db.review.deleteMany({});
  const reviewData = [
    { academySlug: "corvit-systems", studentName: "Ali Hassan", rating: 5, comment: "Excellent training institute. The CCNA course was comprehensive and the instructor was very knowledgeable. Got my certification on the first attempt!" },
    { academySlug: "corvit-systems", studentName: "Sana Khan", rating: 5, comment: "Best IT institute in Lahore. Modern labs and great teaching methodology. Highly recommended for anyone serious about IT career." },
    { academySlug: "corvit-systems", studentName: "Bilal Ahmed", rating: 4, comment: "Good infrastructure and helpful teachers. Scheduling could be more flexible but overall great experience." },
    { academySlug: "aptech-computer-education", studentName: "Hina Aslam", rating: 5, comment: "The software engineering diploma completely transformed my career. Got a job at a top IT firm even before completing the course!" },
    { academySlug: "aptech-computer-education", studentName: "Kamran Shah", rating: 4, comment: "Quality education with industry-relevant curriculum. Placement cell is very supportive." },
    { academySlug: "the-educators-academy", studentName: "Ayesha Noor", rating: 5, comment: "Cleared MDCAT with 195/200 thanks to The Educators Academy. The teachers are exceptional and the test series is gold!" },
    { academySlug: "the-educators-academy", studentName: "Hamza Ali", rating: 5, comment: "Best decision of my life. Got admission in King Edward Medical University. Highly recommended for MDCAT prep." },
    { academySlug: "pny-trainings", studentName: "Faisal Raza", rating: 5, comment: "Amazon FBA course is worth every rupee. Built a $5000/month business within 6 months of completing the course." },
    { academySlug: "pny-trainings", studentName: "Nida Khan", rating: 4, comment: "Great digital marketing course. Practical projects helped me land a remote job immediately." },
    { academySlug: "evs-professional-training", studentName: "Imran Malik", rating: 5, comment: "ACCA preparation at EVS was outstanding. Passed all papers in first attempt. Faculty is highly experienced." },
    // ===== Additional reviews for expanded academies =====
    { academySlug: "saylani-mass-it-training", studentName: "Bilal Khan", rating: 5, comment: "Best free IT training in Pakistan. Got a job as React developer after completing the Web & Mobile course. Life-changing opportunity!" },
    { academySlug: "saylani-mass-it-training", studentName: "Ayesha Siddiqui", rating: 5, comment: "The AI & ChatGPT course opened new career possibilities. Sir Ali's teaching style is exceptional and practical." },
    { academySlug: "saylani-mass-it-training", studentName: "Hassan Raza", rating: 4, comment: "Great initiative for underprivileged students. The quality is on par with paid bootcamps. Highly recommend." },
    { academySlug: "arena-multimedia", studentName: "Mariam Khan", rating: 5, comment: "The 3D animation program is incredible. Got hired at a top animation studio right after graduation. Yasir sir is the best!" },
    { academySlug: "arena-multimedia", studentName: "Usman Ali", rating: 4, comment: "Good graphic design course with industry-standard tools. The Mac lab is well-equipped." },
    { academySlug: "lums-language-center", studentName: "Fatima Ahmed", rating: 5, comment: "Achieved IELTS band 8.0 thanks to LUMS Language Center. The instructors are world-class and the methodology is proven." },
    { academySlug: "lums-language-center", studentName: "Ahmed Raza", rating: 5, comment: "Completed German B2 here and now studying in Germany. The structured CEFR approach really works." },
    { academySlug: "kips-academy", studentName: "Zainab Malik", rating: 5, comment: "KIPS gave me the discipline and testing rigor I needed. Scored 198/200 in MDCAT. The mock tests are exactly like the real exam." },
    { academySlug: "kips-academy", studentName: "Hira Aslam", rating: 5, comment: "Best ECAT prep in Lahore. The faculty knows exactly what NUST and FAST entry tests require." },
    { academySlug: "kips-academy", studentName: "Bilal Tariq", rating: 4, comment: "Intensive but worth it. The daily test system keeps you on your toes. Got admission in NUST Islamabad!" },
    { academySlug: "codewithharry-academy", studentName: "Saad Anwar", rating: 5, comment: "Harry sir's teaching is exactly like his YouTube channel but with personalized attention. Built 3 real projects during the course." },
    { academySlug: "codewithharry-academy", studentName: "Hira Khan", rating: 5, comment: "The Python Mastery course is the best in Islamabad. Practical projects, not just theory. Got a remote job immediately." },
    { academySlug: "aitchison-college-prep", studentName: "Ali Akbar", rating: 5, comment: "The A-Level program at Aitchison is unparalleled. Got into Cambridge University for Engineering. The faculty opens doors globally." },
    { academySlug: "pia-training-institute", studentName: "Sana PIA", rating: 4, comment: "Cabin crew training was thorough and professional. Got hired by PIA immediately after completing the course." },
    { academySlug: "beaconhouse-tech-academy", studentName: "Ahsan Bashir", rating: 5, comment: "BS Computer Science at Beaconhouse Tech was a great decision. Modern curriculum and excellent industry connections for internships." },
    { academySlug: "navttc-training-center", studentName: "Imran Sheikh", rating: 4, comment: "Government-subsidized AI course changed my career trajectory. Quality education at minimal cost. Thank you NAVTTC!" },
    { academySlug: "preston-institute-management", studentName: "Kamran Akhtar", rating: 4, comment: "Executive MBA program is well-structured for working professionals. The weekend classes work perfectly with my job." },
  ];
  for (const r of reviewData) {
    await db.review.create({
      data: {
        academyId: academyIds[r.academySlug],
        studentName: r.studentName, rating: r.rating, comment: r.comment,
      },
    });
  }
  console.log(`  ✓ Reviews seeded (${reviewData.length})`);

  // ===== Announcements =====
  await db.announcement.deleteMany({});
  const announcementData = [
    { academySlug: "corvit-systems", title: "New Batch for CCNA Starting Nov 1st", content: "We are excited to announce a new batch for CCNA Routing & Switching starting November 1st, 2024. Limited seats available. Early bird discount of 15% for first 20 registrations." },
    { academySlug: "corvit-systems", title: "Free AWS Certification Workshop", content: "Join our free workshop on AWS Cloud Practitioner certification this Saturday at 3 PM. Open for all students and professionals." },
    { academySlug: "corvit-systems", title: "Holiday Notice - Eid Milad un Nabi", content: "The institute will remain closed on September 17th in observance of Eid Milad un Nabi. Regular classes will resume from September 18th." },
    { academySlug: "the-educators-academy", title: "MDCAT 2024 Result Celebration", content: "Alhamdulillah, our students achieved 12 positions in MDCAT 2024 top 100. Join us for the celebration ceremony on October 25th." },
  ];
  for (const a of announcementData) {
    await db.announcement.create({
      data: {
        academyId: academyIds[a.academySlug],
        title: a.title, content: a.content, published: true,
      },
    });
  }
  console.log("  ✓ Announcements seeded (4)");

  // ===== Admissions =====
  await db.admission.deleteMany({});
  const admissionData = [
    { academySlug: "corvit-systems", studentName: "Ahsan Khan", course: "CCNA Routing & Switching", fee: 75000, status: "confirmed" },
    { academySlug: "corvit-systems", studentName: "Fatima Ali", course: "CCNA Routing & Switching", fee: 75000, status: "confirmed" },
    { academySlug: "corvit-systems", studentName: "Zainab Hassan", course: "Ethical Hacking", fee: 120000, status: "confirmed" },
    { academySlug: "corvit-systems", studentName: "Ayesha Siddiqui", course: "AWS Cloud", fee: 50000, status: "pending" },
  ];
  for (const a of admissionData) {
    await db.admission.create({
      data: {
        academyId: academyIds[a.academySlug],
        studentName: a.studentName, course: a.course,
        fee: a.fee, status: a.status,
      },
    });
  }
  console.log("  ✓ Admissions seeded (4)");

  // ===== Inquiries =====
  await db.inquiry.deleteMany({});
  const inquiryData = [
    { academySlug: "corvit-systems", studentName: "Saad Anwar", email: "saad@gmail.com", phone: "+92 333 1234567", course: "CCNA Routing & Switching", message: "I want to know about the next batch schedule and fee structure.", status: "pending" },
    { academySlug: "corvit-systems", studentName: "Hira Tariq", email: "hira@gmail.com", phone: "+92 333 7654321", course: "AWS Cloud Practitioner", message: "Is there any weekend batch available?", status: "responded" },
    { academySlug: "corvit-systems", studentName: "Asad Mehmood", email: "asad@gmail.com", phone: "+92 333 9876543", course: "Ethical Hacking", message: "What are the prerequisites for this course?", status: "pending" },
  ];
  for (const i of inquiryData) {
    await db.inquiry.create({
      data: {
        academyId: academyIds[i.academySlug],
        studentName: i.studentName, email: i.email,
        phone: i.phone, course: i.course,
        message: i.message, status: i.status,
      },
    });
  }
  console.log("  ✓ Inquiries seeded (3)");

  // ===== Notifications =====
  await db.notification.deleteMany({});
  await db.notification.createMany({
    data: [
      { userId: studentUser.id, title: "New Course Available", message: "A new AWS Cloud Practitioner batch is starting at Corvit Systems", type: "info" },
      { userId: studentUser.id, title: "Price Drop Alert", message: "PNY Trainings is offering 20% off on Digital Marketing course", type: "success" },
      { userId: studentUser.id, title: "Admission Open", message: "The Educators Academy MDCAT 2025 batch admissions are now open", type: "info", read: true },
      { userId: academyUser.id, title: "New Inquiry", message: "You have a new inquiry from Saad Anwar", type: "info" },
      { userId: academyUser.id, title: "Admission Confirmed", message: "Ahsan Khan's admission has been confirmed", type: "success" },
    ],
  });
  console.log("  ✓ Notifications seeded (5)");

  // ===== Favorites =====
  await db.favorite.deleteMany({});
  await db.favorite.create({
    data: {
      userId: studentUser.id,
      academyId: academyIds["corvit-systems"],
    },
  });
  await db.favorite.create({
    data: {
      userId: studentUser.id,
      academyId: academyIds["the-educators-academy"],
    },
  });
  console.log("  ✓ Favorites seeded (2)");

  // ===== Scholarships =====
  await db.scholarship.deleteMany({});
  const scholarshipData = [
    { academySlug: "corvit-systems", title: "Merit Scholarship 2024", description: "50% fee waiver for students with 85%+ marks in matric/intermediate.", amount: "50% Fee Waiver", eligibility: "85%+ in matric/intermediate", deadline: "2024-12-31" },
    { academySlug: "corvit-systems", title: "Need-Based Financial Aid", description: "Full scholarship for underprivileged students. Application with income certificate required.", amount: "Full Scholarship", eligibility: "Family income < Rs 50,000/month", deadline: "2024-11-30" },
    { academySlug: "saylani-mass-it-training", title: "100% Free Education", description: "All courses at SMIT are free for everyone. No hidden charges.", amount: "100% Free", eligibility: "Open to all", deadline: "2025-12-31" },
    { academySlug: "the-educators-academy", title: "Top Position Holder Award", description: "Full fee refund + cash prize for students scoring top 10 positions in MDCAT 2025.", amount: "Full Refund + Rs 50,000", eligibility: "Top 10 in MDCAT", deadline: "2025-01-15" },
    { academySlug: "kips-academy", title: "Women in STEM Scholarship", description: "30% discount for female students enrolling in ECAT prep programs.", amount: "30% Discount", eligibility: "Female students", deadline: "2024-12-15" },
    { academySlug: "lums-language-center", title: "LUMS NOP Scholarship", description: "National Outreach Programme — full scholarship for students from underprivileged areas.", amount: "Full Scholarship", eligibility: "NOP qualifying test", deadline: "2024-11-15" },
    { academySlug: "aitchison-college-prep", title: "Rhodes Prep Scholarship", description: "Full scholarship for exceptional students applying to Oxford/Cambridge.", amount: "Full Scholarship + Stipend", eligibility: "A-Level A* grades", deadline: "2024-10-31" },
    { academySlug: "beaconhouse-tech-academy", title: "Tech Excellence Award", description: "Up to 40% scholarship based on programming aptitude test.", amount: "20-40% Fee Waiver", eligibility: "Pass aptitude test", deadline: "2024-12-01" },
  ];
  for (const s of scholarshipData) {
    await db.scholarship.create({
      data: {
        academyId: academyIds[s.academySlug],
        title: s.title, description: s.description, amount: s.amount,
        eligibility: s.eligibility, deadline: s.deadline, status: "active",
      },
    });
  }
  console.log(`  ✓ Scholarships seeded (${scholarshipData.length})`);

  // ===== Categories =====
  await db.category.deleteMany({});
  const categoryData = [
    { name: "IT & Technology", icon: "💻", color: "#2563EB", description: "Computer science, programming, networking, and IT certifications" },
    { name: "Test Preparation", icon: "📚", color: "#10B981", description: "MDCAT, ECAT, NUST, FAST, and university entry test prep" },
    { name: "Business & Finance", icon: "📊", color: "#F59E0B", description: "ACCA, CMA, MBA, SAP, and business management" },
    { name: "Languages", icon: "🗣️", color: "#8B5CF6", description: "IELTS, TOEFL, German, French, Chinese, Arabic" },
    { name: "Government", icon: "🏛️", color: "#EC4899", description: "Government-funded and subsidized training programs" },
    { name: "Higher Education", icon: "🎓", color: "#06B6D4", description: "Bachelor's, Master's, and doctoral degree programs" },
    { name: "Creative Arts", icon: "🎨", color: "#DB2777", description: "Animation, graphic design, VFX, and multimedia" },
    { name: "Aviation & Hospitality", icon: "✈️", color: "#0EA5E9", description: "Cabin crew, airport operations, travel, and tourism" },
  ];
  for (const c of categoryData) {
    await db.category.create({
      data: {
        name: c.name,
        slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        icon: c.icon, color: c.color, description: c.description,
      },
    });
  }
  console.log(`  ✓ Categories seeded (${categoryData.length})`);

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📋 Demo credentials:");
  console.log("  Student: student@eduhub.pk / 123456");
  console.log("  Academy: academy@eduhub.pk / 123456");
  console.log("  Teacher: teacher@eduhub.pk / 123456");
  console.log("  Admin:   admin@eduhub.pk / 123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
