import {
  Academy,
  Course,
  Teacher,
  Student,
  Review,
  Announcement,
  User,
  Notification,
  Inquiry,
  Admission,
} from "./types";

// Realistic sample data for EduHub Pakistan

export const SAMPLE_ACADEMIES: Academy[] = [
  {
    id: "acad_corvit",
    name: "Corvit Systems",
    logo: "🎓",
    cover: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
    rating: 4.8,
    reviewsCount: 1240,
    city: "Lahore",
    area: "Gulberg III",
    address: "65-A, Main Boulevard, Gulberg III, Lahore",
    phone: "+92 42 3575 1234",
    email: "info@corvit.edu.pk",
    website: "www.corvit.edu.pk",
    description:
      "Corvit Systems is a premier IT training institute in Pakistan, offering cutting-edge courses in networking, cybersecurity, cloud computing, and software development. With over 15 years of excellence, Corvit has trained more than 50,000 professionals who are now working in leading tech companies worldwide. Our state-of-the-art labs and Cisco-certified instructors ensure you receive world-class education that meets international standards.",
    courses: ["CCNA", "CCNP", "Ethical Hacking", "AWS Cloud", "Python Development", "Network Security"],
    feeRange: "Rs 25,000 - Rs 150,000",
    minFee: 25000,
    maxFee: 150000,
    distance: 2.4,
    timings: "9:00 AM - 9:00 PM",
    facilities: ["Modern Labs", "AC Classrooms", "Library", "Parking", "Cafeteria", "Free WiFi"],
    gallery: [],
    verified: true,
    category: "IT & Technology",
    totalStudents: 850,
    totalTeachers: 32,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "acad_aptech",
    name: "Aptech Computer Education",
    logo: "💻",
    cover: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
    rating: 4.6,
    reviewsCount: 980,
    city: "Karachi",
    area: "Shahrah-e-Faisal",
    address: "Plot 14-C, Shahrah-e-Faisal, Block 6, PECHS, Karachi",
    phone: "+92 21 3456 7890",
    email: "info@aptech.pk",
    website: "www.aptech.pk",
    description:
      "Aptech Computer Education is a global leader in IT training with presence in over 40 countries. Our Karachi campus offers comprehensive programs in software engineering, mobile app development, data science, and digital marketing. We follow a project-based learning approach where students build real-world applications throughout their course. Our placement cell has a 95% success rate with companies like Systems Limited, NetSol, and 10Pearls.",
    courses: ["Software Engineering", "Mobile App Development", "Data Science", "Digital Marketing", "Web Development", "UI/UX Design"],
    feeRange: "Rs 35,000 - Rs 200,000",
    minFee: 35000,
    maxFee: 200000,
    distance: 5.1,
    timings: "8:00 AM - 10:00 PM",
    facilities: ["Modern Labs", "AC Classrooms", "Placement Cell", "Library", "Cafeteria", "Free WiFi"],
    gallery: [],
    verified: true,
    category: "IT & Technology",
    totalStudents: 1200,
    totalTeachers: 45,
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "acad_navttc",
    name: "NAVTTC Training Center",
    logo: "🏛️",
    cover: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    rating: 4.4,
    reviewsCount: 720,
    city: "Islamabad",
    area: "G-9 Markaz",
    address: "National Vocational & Technical Training Commission, G-9 Markaz, Islamabad",
    phone: "+92 51 9100 234",
    email: "info@navttc.gov.pk",
    website: "www.navttc.gov.pk",
    description:
      "The National Vocational & Technical Training Commission (NAVTTC) is the government's flagship program for technical and vocational education. We offer free and subsidized courses in high-demand skills including AI, blockchain, IoT, and advanced manufacturing. Our programs are aligned with international standards and provide nationally recognized certifications. Students get hands-on training with industry partners and job placement assistance.",
    courses: ["Artificial Intelligence", "Blockchain Development", "IoT Systems", "CNC Programming", "Mobile Repair", "Tailoring & Fashion"],
    feeRange: "Rs 5,000 - Rs 50,000",
    minFee: 5000,
    maxFee: 50000,
    distance: 8.2,
    timings: "9:00 AM - 6:00 PM",
    facilities: ["Government Certified", "Free Courses", "Job Placement", "AC Classrooms", "Library"],
    gallery: [],
    verified: true,
    category: "Government",
    totalStudents: 650,
    totalTeachers: 28,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "acad_evs",
    name: "EVS Professional Training",
    logo: "📊",
    cover: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    rating: 4.5,
    reviewsCount: 850,
    city: "Lahore",
    area: "Johar Town",
    address: "Block H-2, Johar Town, Lahore",
    phone: "+92 42 3521 9876",
    email: "info@evs.edu.pk",
    website: "www.evs.edu.pk",
    description:
      "EVS Professional Training Institute specializes in accounting, finance, and business management courses. We are an ACCA-approved learning partner and offer globally recognized certifications including CMA, CIA, and QuickBooks. Our faculty comprises industry professionals with 15+ years of experience. We have a 92% pass rate for ACCA exams and our alumni are working in Big 4 firms including PwC, EY, Deloitte, and KPMG.",
    courses: ["ACCA", "CMA", "QuickBooks", "SAP FICO", "Taxation", "Audit & Assurance"],
    feeRange: "Rs 30,000 - Rs 250,000",
    minFee: 30000,
    maxFee: 250000,
    distance: 3.7,
    timings: "8:00 AM - 9:00 PM",
    facilities: ["AC Classrooms", "Computer Lab", "Library", "Career Counseling", "Parking"],
    gallery: [],
    verified: true,
    category: "Business & Finance",
    totalStudents: 540,
    totalTeachers: 22,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "acad_educators",
    name: "The Educators Academy",
    logo: "📚",
    cover: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
    rating: 4.7,
    reviewsCount: 1560,
    city: "Lahore",
    area: "Model Town",
    address: "Block B, Model Town Extension, Lahore",
    phone: "+92 42 3544 5566",
    email: "info@educatorsacademy.pk",
    website: "www.educatorsacademy.pk",
    description:
      "The Educators Academy is a leading coaching center for intermediate and entry test preparation. We specialize in MDCAT, ECAT, NUST, GIKI, and LUMS entry test preparation with a proven track record of producing top position holders. Our unique teaching methodology combines concept building with extensive practice. We have 18 years of excellence and have helped over 25,000 students secure admissions in top medical and engineering universities.",
    courses: ["MDCAT Preparation", "ECAT Preparation", "NUST Entry Test", "FSc Pre-Eng", "FSc Pre-Med", "A-Levels"],
    feeRange: "Rs 15,000 - Rs 80,000",
    minFee: 15000,
    maxFee: 80000,
    distance: 1.8,
    timings: "6:00 AM - 10:00 PM",
    facilities: ["AC Classrooms", "Digital Library", "Hostel", "Transport", "Cafeteria", "Sports Complex"],
    gallery: [],
    verified: true,
    category: "Test Preparation",
    totalStudents: 1450,
    totalTeachers: 58,
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "acad_nicon",
    name: "NICON Group of Colleges",
    logo: "🎯",
    cover: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    rating: 4.3,
    reviewsCount: 620,
    city: "Rawalpindi",
    area: "Saddar",
    address: "The Mall Road, Saddar, Rawalpindi Cantt",
    phone: "+92 51 555 1234",
    email: "info@nicon.edu.pk",
    website: "www.nicon.edu.pk",
    description:
      "NICON Group of Colleges is a multidisciplinary educational institute offering courses in IT, business, languages, and vocational training. We are affiliated with the Federal Board and offer HEC-recognized programs. Our international language programs include IELTS, TOEFL, German, and Chinese. We have state-of-the-art smart classrooms, modern computer labs, and experienced multinational faculty.",
    courses: ["IELTS Preparation", "German Language", "Chinese Language", "Web Development", "Office Management", "Graphic Design"],
    feeRange: "Rs 10,000 - Rs 120,000",
    minFee: 10000,
    maxFee: 120000,
    distance: 6.5,
    timings: "8:00 AM - 8:00 PM",
    facilities: ["Smart Classrooms", "Language Lab", "Computer Lab", "Library", "Cafeteria"],
    gallery: [],
    verified: true,
    category: "Languages & IT",
    totalStudents: 780,
    totalTeachers: 35,
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "acad_pny",
    name: "PNY Trainings",
    logo: "⚡",
    cover: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    rating: 4.5,
    reviewsCount: 1100,
    city: "Lahore",
    area: "Arfa Karim Tower",
    address: "Arfa Software Technology Park, Ferozepur Road, Lahore",
    phone: "+92 42 3588 9999",
    email: "info@pnytrainings.com",
    website: "www.pnytrainings.com",
    description:
      "PNY Trainings is Pakistan's largest IT training institute with campuses in all major cities. We offer 100+ courses in emerging technologies including Amazon FBA, digital marketing, SEO, graphic designing, and web development. Our instructors are industry experts and our curriculum is updated quarterly based on market demands. We have trained over 30,000 students with an 88% job placement rate within 3 months of course completion.",
    courses: ["Amazon FBA", "Digital Marketing", "SEO Training", "Graphic Designing", "Web Development", "Video Editing"],
    feeRange: "Rs 20,000 - Rs 100,000",
    minFee: 20000,
    maxFee: 100000,
    distance: 4.2,
    timings: "9:00 AM - 11:00 PM",
    facilities: ["Modern Labs", "AC Classrooms", "Online Classes", "Career Support", "Free WiFi", "Cafeteria"],
    gallery: [],
    verified: true,
    category: "IT & Technology",
    totalStudents: 1600,
    totalTeachers: 52,
    createdAt: "2024-01-30T10:00:00Z",
  },
  {
    id: "acad_beaconhouse",
    name: "Beaconhouse Tech Academy",
    logo: "🏫",
    cover: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    rating: 4.6,
    reviewsCount: 890,
    city: "Lahore",
    area: "Garden Town",
    address: "Beaconhouse National University, Garden Town, Lahore",
    phone: "+92 42 3590 7777",
    email: "admissions@btech.edu.pk",
    website: "www.btech.edu.pk",
    description:
      "Beaconhouse Tech Academy, part of the Beaconhouse group, offers world-class education in computer science, software engineering, and data analytics. We are affiliated with leading international universities and offer exchange programs. Our campus features cutting-edge research labs, innovation centers, and a startup incubator. Students work on real industry projects from day one and graduate with a portfolio of 5+ completed projects.",
    courses: ["BS Computer Science", "Software Engineering", "Data Analytics", "Game Development", "Cyber Security", "Cloud Computing"],
    feeRange: "Rs 50,000 - Rs 350,000",
    minFee: 50000,
    maxFee: 350000,
    distance: 7.3,
    timings: "8:00 AM - 6:00 PM",
    facilities: ["Research Labs", "Startup Incubator", "Library", "Sports Complex", "Hostel", "Transport"],
    gallery: [],
    verified: true,
    category: "Higher Education",
    totalStudents: 920,
    totalTeachers: 48,
    createdAt: "2024-02-05T10:00:00Z",
  },
];

export const SAMPLE_COURSES: Course[] = [
  { id: "c1", academyId: "acad_corvit", name: "CCNA Routing & Switching", duration: "6 months", fee: 75000, description: "Comprehensive Cisco networking certification covering routing, switching, and network fundamentals.", instructor: "Engr. Ahmed Raza", seats: 30, enrolled: 22, status: "active", category: "Networking", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c2", academyId: "acad_corvit", name: "Ethical Hacking & Cybersecurity", duration: "4 months", fee: 120000, description: "Learn penetration testing, vulnerability assessment, and security best practices.", instructor: "Usman Khalid", seats: 25, enrolled: 25, status: "full", category: "Cybersecurity", createdAt: "2024-03-05T10:00:00Z" },
  { id: "c3", academyId: "acad_corvit", name: "AWS Cloud Practitioner", duration: "3 months", fee: 50000, description: "Master Amazon Web Services cloud platform and earn industry-recognized certification.", instructor: "Sana Tariq", seats: 40, enrolled: 18, status: "active", category: "Cloud", createdAt: "2024-03-10T10:00:00Z" },
  { id: "c4", academyId: "acad_aptech", name: "Diploma in Software Engineering", duration: "2 years", fee: 200000, description: "Complete software engineering program covering full-stack development, databases, and DevOps.", instructor: "Bilal Khan", seats: 50, enrolled: 38, status: "active", category: "Software", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c5", academyId: "acad_aptech", name: "Mobile App Development", duration: "8 months", fee: 95000, description: "Build native and cross-platform mobile apps for Android and iOS using React Native.", instructor: "Farhan Ahmed", seats: 35, enrolled: 28, status: "active", category: "Mobile", createdAt: "2024-03-08T10:00:00Z" },
  { id: "c6", academyId: "acad_aptech", name: "Data Science Bootcamp", duration: "6 months", fee: 150000, description: "Learn Python, ML, deep learning, and data visualization with real datasets.", instructor: "Dr. Ayesha Malik", seats: 30, enrolled: 25, status: "active", category: "Data Science", createdAt: "2024-03-12T10:00:00Z" },
  { id: "c7", academyId: "acad_navttc", name: "AI & Machine Learning", duration: "6 months", fee: 25000, description: "Government-subsidized AI/ML course with hands-on project experience.", instructor: "Hamza Sheikh", seats: 40, enrolled: 35, status: "active", category: "AI", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c8", academyId: "acad_navttc", name: "Blockchain Development", duration: "4 months", fee: 50000, description: "Build decentralized applications on Ethereum and other blockchain platforms.", instructor: "Ali Raza", seats: 25, enrolled: 15, status: "active", category: "Blockchain", createdAt: "2024-03-05T10:00:00Z" },
  { id: "c9", academyId: "acad_evs", name: "ACCA Foundation", duration: "1 year", fee: 120000, description: "Start your ACCA journey with foundational accounting and business knowledge.", instructor: "CA Saima Noreen", seats: 60, enrolled: 45, status: "active", category: "Accounting", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c10", academyId: "acad_evs", name: "SAP FICO Consultant", duration: "3 months", fee: 250000, description: "Become a certified SAP FICO consultant with hands-on ERP training.", instructor: "FCMA Tahir Mehmood", seats: 20, enrolled: 12, status: "active", category: "ERP", createdAt: "2024-03-08T10:00:00Z" },
  { id: "c11", academyId: "acad_educators", name: "MDCAT Crash Course", duration: "3 months", fee: 45000, description: "Intensive medical college admission test preparation with daily tests.", instructor: "Dr. Imran Qureshi", seats: 100, enrolled: 85, status: "active", category: "Test Prep", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c12", academyId: "acad_educators", name: "ECAT Preparation", duration: "4 months", fee: 35000, description: "Engineering College Admission Test prep covering Physics, Math, Chemistry.", instructor: "Prof. Naveed Iqbal", seats: 80, enrolled: 60, status: "active", category: "Test Prep", createdAt: "2024-03-05T10:00:00Z" },
  { id: "c13", academyId: "acad_nicon", name: "IELTS Academic", duration: "2 months", fee: 18000, description: "Achieve band 7+ in IELTS with experienced British Council trainers.", instructor: "Sarah Williams", seats: 30, enrolled: 24, status: "active", category: "Languages", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c14", academyId: "acad_pny", name: "Amazon FBA Mastery", duration: "2 months", fee: 35000, description: "Build a profitable Amazon FBA business from Pakistan with complete training.", instructor: "Muhammad Yasin", seats: 50, enrolled: 42, status: "active", category: "E-commerce", createdAt: "2024-03-01T10:00:00Z" },
  { id: "c15", academyId: "acad_pny", name: "Digital Marketing Pro", duration: "3 months", fee: 40000, description: "Master SEO, PPC, social media, and content marketing.", instructor: "Hina Aslam", seats: 45, enrolled: 38, status: "active", category: "Marketing", createdAt: "2024-03-05T10:00:00Z" },
];

export const SAMPLE_TEACHERS: Teacher[] = [
  { id: "t1", academyId: "acad_corvit", name: "Engr. Ahmed Raza", qualification: "MS Network Engineering (NUST)", experience: "12 years", specialization: "Cisco Networking", phone: "+92 300 1234567", email: "ahmed.raza@corvit.edu.pk", assignedCourses: ["c1"], assignedStudents: ["s1", "s2", "s3"], createdAt: "2024-03-01T10:00:00Z" },
  { id: "t2", academyId: "acad_corvit", name: "Usman Khalid", qualification: "CEH, OSCP Certified", experience: "8 years", specialization: "Cybersecurity", phone: "+92 301 2345678", email: "usman.k@corvit.edu.pk", assignedCourses: ["c2"], assignedStudents: ["s4", "s5"], createdAt: "2024-03-05T10:00:00Z" },
  { id: "t3", academyId: "acad_corvit", name: "Sana Tariq", qualification: "AWS Solutions Architect", experience: "6 years", specialization: "Cloud Computing", phone: "+92 302 3456789", email: "sana.t@corvit.edu.pk", assignedCourses: ["c3"], assignedStudents: ["s6", "s7"], createdAt: "2024-03-10T10:00:00Z" },
  { id: "t4", academyId: "acad_aptech", name: "Bilal Khan", qualification: "MS Computer Science (LUMS)", experience: "10 years", specialization: "Full-Stack Development", phone: "+92 333 4567890", email: "bilal.k@aptech.pk", assignedCourses: ["c4"], assignedStudents: ["s8", "s9", "s10"], createdAt: "2024-03-01T10:00:00Z" },
  { id: "t5", academyId: "acad_educators", name: "Dr. Imran Qureshi", qualification: "MBBS, MD (King Edward)", experience: "15 years", specialization: "Biology & Chemistry", phone: "+92 321 5678901", email: "imran.q@educators.pk", assignedCourses: ["c11"], assignedStudents: ["s11", "s12", "s13", "s14"], createdAt: "2024-03-01T10:00:00Z" },
];

export const SAMPLE_STUDENTS: Student[] = [
  { id: "s1", academyId: "acad_corvit", name: "Ahsan Khan", rollNumber: "COR-2024-001", course: "CCNA Routing & Switching", teacher: "Engr. Ahmed Raza", phone: "+92 300 1111111", email: "ahsan.khan@gmail.com", gender: "male", address: "House 12, Block C, Model Town, Lahore", admissionDate: "2024-03-15", status: "active", createdAt: "2024-03-15T10:00:00Z" },
  { id: "s2", academyId: "acad_corvit", name: "Fatima Ali", rollNumber: "COR-2024-002", course: "CCNA Routing & Switching", teacher: "Engr. Ahmed Raza", phone: "+92 300 2222222", email: "fatima.ali@gmail.com", gender: "female", address: "Flat 5, Gulberg V, Lahore", admissionDate: "2024-03-15", status: "active", createdAt: "2024-03-15T10:00:00Z" },
  { id: "s3", academyId: "acad_corvit", name: "Bilal Ahmed", rollNumber: "COR-2024-003", course: "CCNA Routing & Switching", teacher: "Engr. Ahmed Raza", phone: "+92 300 3333333", email: "bilal.ahmed@gmail.com", gender: "male", address: "34-B, DHA Phase 5, Lahore", admissionDate: "2024-03-16", status: "active", createdAt: "2024-03-16T10:00:00Z" },
  { id: "s4", academyId: "acad_corvit", name: "Zainab Hassan", rollNumber: "COR-2024-004", course: "Ethical Hacking & Cybersecurity", teacher: "Usman Khalid", phone: "+92 300 4444444", email: "zainab.h@gmail.com", gender: "female", address: "78, Johar Town, Lahore", admissionDate: "2024-03-20", status: "active", createdAt: "2024-03-20T10:00:00Z" },
  { id: "s5", academyId: "acad_corvit", name: "Hamza Sheikh", rollNumber: "COR-2024-005", course: "Ethical Hacking & Cybersecurity", teacher: "Usman Khalid", phone: "+92 300 5555555", email: "hamza.s@gmail.com", gender: "male", address: "12-A, Faisal Town, Lahore", admissionDate: "2024-03-20", status: "active", createdAt: "2024-03-20T10:00:00Z" },
  { id: "s6", academyId: "acad_corvit", name: "Ayesha Siddiqui", rollNumber: "COR-2024-006", course: "AWS Cloud Practitioner", teacher: "Sana Tariq", phone: "+92 300 6666666", email: "ayesha.s@gmail.com", gender: "female", address: "45, Garden Town, Lahore", admissionDate: "2024-03-22", status: "active", createdAt: "2024-03-22T10:00:00Z" },
  { id: "s8", academyId: "acad_aptech", name: "Usman Tariq", rollNumber: "APT-2024-001", course: "Diploma in Software Engineering", teacher: "Bilal Khan", phone: "+92 301 7777777", email: "usman.t@gmail.com", gender: "male", address: "Block 6, PECHS, Karachi", admissionDate: "2024-03-10", status: "active", createdAt: "2024-03-10T10:00:00Z" },
  { id: "s11", academyId: "acad_educators", name: "Mariam Iqbal", rollNumber: "EDU-2024-001", course: "MDCAT Crash Course", teacher: "Dr. Imran Qureshi", phone: "+92 321 8888888", email: "mariam.i@gmail.com", gender: "female", address: "23-A, Model Town, Lahore", admissionDate: "2024-03-05", status: "active", createdAt: "2024-03-05T10:00:00Z" },
  { id: "s12", academyId: "acad_educators", name: "Abdullah Malik", rollNumber: "EDU-2024-002", course: "MDCAT Crash Course", teacher: "Dr. Imran Qureshi", phone: "+92 321 9999999", email: "abdullah.m@gmail.com", gender: "male", address: "78-B, Garden Town, Lahore", admissionDate: "2024-03-05", status: "active", createdAt: "2024-03-05T10:00:00Z" },
];

export const SAMPLE_REVIEWS: Review[] = [
  { id: "r1", academyId: "acad_corvit", studentName: "Ali Hassan", rating: 5, comment: "Excellent training institute. The CCNA course was comprehensive and the instructor was very knowledgeable. Got my certification on the first attempt!", date: "2024-09-15T10:00:00Z" },
  { id: "r2", academyId: "acad_corvit", studentName: "Sana Khan", rating: 5, comment: "Best IT institute in Lahore. Modern labs and great teaching methodology. Highly recommended for anyone serious about IT career.", date: "2024-09-10T10:00:00Z" },
  { id: "r3", academyId: "acad_corvit", studentName: "Bilal Ahmed", rating: 4, comment: "Good infrastructure and helpful teachers. Scheduling could be more flexible but overall great experience.", date: "2024-08-28T10:00:00Z" },
  { id: "r4", academyId: "acad_aptech", studentName: "Hina Aslam", rating: 5, comment: "The software engineering diploma completely transformed my career. Got a job at a top IT firm even before completing the course!", date: "2024-09-12T10:00:00Z" },
  { id: "r5", academyId: "acad_aptech", studentName: "Kamran Shah", rating: 4, comment: "Quality education with industry-relevant curriculum. Placement cell is very supportive.", date: "2024-08-30T10:00:00Z" },
  { id: "r6", academyId: "acad_educators", studentName: "Ayesha Noor", rating: 5, comment: "Cleared MDCAT with 195/200 thanks to The Educators Academy. The teachers are exceptional and the test series is gold!", date: "2024-09-18T10:00:00Z" },
  { id: "r7", academyId: "acad_educators", studentName: "Hamza Ali", rating: 5, comment: "Best decision of my life. Got admission in King Edward Medical University. Highly recommended for MDCAT prep.", date: "2024-09-05T10:00:00Z" },
  { id: "r8", academyId: "acad_pny", studentName: "Faisal Raza", rating: 5, comment: "Amazon FBA course is worth every rupee. Built a $5000/month business within 6 months of completing the course.", date: "2024-09-20T10:00:00Z" },
  { id: "r9", academyId: "acad_pny", studentName: "Nida Khan", rating: 4, comment: "Great digital marketing course. Practical projects helped me land a remote job immediately.", date: "2024-09-01T10:00:00Z" },
  { id: "r10", academyId: "acad_evs", studentName: "Imran Malik", rating: 5, comment: "ACCA preparation at EVS was outstanding. Passed all papers in first attempt. Faculty is highly experienced.", date: "2024-08-25T10:00:00Z" },
];

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", academyId: "acad_corvit", title: "New Batch for CCNA Starting Nov 1st", content: "We are excited to announce a new batch for CCNA Routing & Switching starting November 1st, 2024. Limited seats available. Early bird discount of 15% for first 20 registrations.", date: "2024-10-15T10:00:00Z", published: true },
  { id: "a2", academyId: "acad_corvit", title: "Free AWS Certification Workshop", content: "Join our free workshop on AWS Cloud Practitioner certification this Saturday at 3 PM. Open for all students and professionals.", date: "2024-10-10T10:00:00Z", published: true },
  { id: "a3", academyId: "acad_corvit", title: "Holiday Notice - Eid Milad un Nabi", content: "The institute will remain closed on September 17th in observance of Eid Milad un Nabi. Regular classes will resume from September 18th.", date: "2024-09-14T10:00:00Z", published: true },
  { id: "a4", academyId: "acad_educators", title: "MDCAT 2024 Result Celebration", content: "Alhamdulillah, our students achieved 12 positions in MDCAT 2024 top 100. Join us for the celebration ceremony on October 25th.", date: "2024-10-18T10:00:00Z", published: true },
];

export const SAMPLE_USERS: User[] = [
  { id: "u1", name: "Ahsan Khan", email: "student@eduhub.pk", password: "123456", role: "student", phone: "+92 300 1234567", createdAt: "2024-01-01T10:00:00Z" },
  { id: "u2", name: "Corvit Admin", email: "academy@eduhub.pk", password: "123456", role: "academy", phone: "+92 42 3575 1234", createdAt: "2024-01-01T10:00:00Z" },
  { id: "u3", name: "Engr. Ahmed Raza", email: "teacher@eduhub.pk", password: "123456", role: "teacher", phone: "+92 300 1234567", createdAt: "2024-01-01T10:00:00Z" },
  { id: "u4", name: "Admin", email: "admin@eduhub.pk", password: "123456", role: "admin", phone: "+92 300 0000000", createdAt: "2024-01-01T10:00:00Z" },
];

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u1", title: "New Course Available", message: "A new AWS Cloud Practitioner batch is starting at Corvit Systems", type: "info", read: false, date: "2024-10-18T08:00:00Z" },
  { id: "n2", userId: "u1", title: "Price Drop Alert", message: "PNY Trainings is offering 20% off on Digital Marketing course", type: "success", read: false, date: "2024-10-17T14:00:00Z" },
  { id: "n3", userId: "u1", title: "Admission Open", message: "The Educators Academy MDCAT 2025 batch admissions are now open", type: "info", read: true, date: "2024-10-15T10:00:00Z" },
];

export const SAMPLE_INQUIRIES: Inquiry[] = [
  { id: "i1", academyId: "acad_corvit", studentName: "Saad Anwar", email: "saad@gmail.com", phone: "+92 333 1234567", course: "CCNA Routing & Switching", message: "I want to know about the next batch schedule and fee structure.", status: "pending", date: "2024-10-18T10:00:00Z" },
  { id: "i2", academyId: "acad_corvit", studentName: "Hira Tariq", email: "hira@gmail.com", phone: "+92 333 7654321", course: "AWS Cloud Practitioner", message: "Is there any weekend batch available?", status: "responded", date: "2024-10-17T10:00:00Z" },
  { id: "i3", academyId: "acad_corvit", studentName: "Asad Mehmood", email: "asad@gmail.com", phone: "+92 333 9876543", course: "Ethical Hacking", message: "What are the prerequisites for this course?", status: "pending", date: "2024-10-16T10:00:00Z" },
];

export const SAMPLE_ADMISSIONS: Admission[] = [
  { id: "ad1", academyId: "acad_corvit", studentName: "Ahsan Khan", course: "CCNA Routing & Switching", fee: 75000, status: "confirmed", date: "2024-03-15T10:00:00Z" },
  { id: "ad2", academyId: "acad_corvit", studentName: "Fatima Ali", course: "CCNA Routing & Switching", fee: 75000, status: "confirmed", date: "2024-03-15T10:00:00Z" },
  { id: "ad3", academyId: "acad_corvit", studentName: "Zainab Hassan", course: "Ethical Hacking", fee: 120000, status: "confirmed", date: "2024-03-20T10:00:00Z" },
  { id: "ad4", academyId: "acad_corvit", studentName: "Ayesha Siddiqui", course: "AWS Cloud", fee: 50000, status: "pending", date: "2024-10-18T10:00:00Z" },
];

// Monthly revenue & enrollment data for charts
export const MONTHLY_DATA = [
  { month: "Jan", admissions: 45, revenue: 1850000, enrollments: 38, views: 4200 },
  { month: "Feb", admissions: 62, revenue: 2400000, enrollments: 52, views: 5800 },
  { month: "Mar", admissions: 89, revenue: 3650000, enrollments: 78, views: 8200 },
  { month: "Apr", admissions: 75, revenue: 2950000, enrollments: 65, views: 7100 },
  { month: "May", admissions: 110, revenue: 4280000, enrollments: 95, views: 9800 },
  { month: "Jun", admissions: 95, revenue: 3820000, enrollments: 82, views: 8900 },
  { month: "Jul", admissions: 130, revenue: 5120000, enrollments: 110, views: 11500 },
  { month: "Aug", admissions: 145, revenue: 5780000, enrollments: 125, views: 12800 },
  { month: "Sep", admissions: 168, revenue: 6450000, enrollments: 142, views: 14200 },
  { month: "Oct", admissions: 152, revenue: 5980000, enrollments: 130, views: 13500 },
];

export const CATEGORY_DISTRIBUTION = [
  { name: "IT & Technology", value: 35, color: "#2563EB" },
  { name: "Test Preparation", value: 22, color: "#10B981" },
  { name: "Business & Finance", value: 18, color: "#F59E0B" },
  { name: "Languages", value: 12, color: "#8B5CF6" },
  { name: "Government", value: 8, color: "#EC4899" },
  { name: "Others", value: 5, color: "#06B6D4" },
];

export const RATING_DISTRIBUTION = [
  { name: "5 Star", value: 620, color: "#10B981" },
  { name: "4 Star", value: 380, color: "#2563EB" },
  { name: "3 Star", value: 145, color: "#F59E0B" },
  { name: "2 Star", value: 68, color: "#FB923C" },
  { name: "1 Star", value: 32, color: "#EF4444" },
];

export function initializeSampleData() {
  if (typeof window === "undefined") return;
  const { getItem, setItem } = require("./storage");
  if (!getItem("academies")) setItem("academies", SAMPLE_ACADEMIES);
  if (!getItem("courses")) setItem("courses", SAMPLE_COURSES);
  if (!getItem("teachers")) setItem("teachers", SAMPLE_TEACHERS);
  if (!getItem("students")) setItem("students", SAMPLE_STUDENTS);
  if (!getItem("reviews")) setItem("reviews", SAMPLE_REVIEWS);
  if (!getItem("announcements")) setItem("announcements", SAMPLE_ANNOUNCEMENTS);
  if (!getItem("users")) setItem("users", SAMPLE_USERS);
  if (!getItem("notifications")) setItem("notifications", SAMPLE_NOTIFICATIONS);
  if (!getItem("inquiries")) setItem("inquiries", SAMPLE_INQUIRIES);
  if (!getItem("admissions")) setItem("admissions", SAMPLE_ADMISSIONS);
  if (!getItem("savedAcademies")) setItem("savedAcademies", []);
  if (!getItem("compareList")) setItem("compareList", []);
  if (!getItem("recentSearches")) setItem("recentSearches", []);
}
