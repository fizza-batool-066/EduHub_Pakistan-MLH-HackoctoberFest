// Core domain types for EduHub Pakistan

export type Role = "student" | "academy" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  academyId: string;
  name: string;
  duration: string;
  fee: number;
  description: string;
  instructor: string;
  seats: number;
  enrolled: number;
  status: "active" | "inactive" | "full";
  category: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  academyId: string;
  name: string;
  qualification: string;
  experience: string;
  specialization: string;
  phone: string;
  email: string;
  assignedCourses: string[];
  assignedStudents: string[];
  avatar?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  academyId?: string;
  name: string;
  rollNumber: string;
  course: string;
  teacher: string;
  phone: string;
  email: string;
  gender: "male" | "female" | "other";
  address: string;
  admissionDate: string;
  status: "active" | "inactive" | "graduated";
  createdAt: string;
}

export interface Academy {
  id: string;
  name: string;
  logo: string;
  cover: string;
  rating: number;
  reviewsCount: number;
  city: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  courses: string[];
  feeRange: string;
  minFee: number;
  maxFee: number;
  distance: number;
  timings: string;
  facilities: string[];
  gallery: string[];
  verified: boolean;
  category: string;
  totalStudents: number;
  totalTeachers: number;
  ownerId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  academyId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface Announcement {
  id: string;
  academyId: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
}

export interface SavedAcademy {
  id: string;
  studentId: string;
  academyId: string;
  date: string;
}

export interface CompareItem {
  id: string;
  studentId: string;
  academyId: string;
  date: string;
}

export interface RecentSearch {
  id: string;
  studentId: string;
  query: string;
  filters: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  date: string;
}

export interface Inquiry {
  id: string;
  academyId: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: "pending" | "responded" | "closed";
  date: string;
}

export interface Admission {
  id: string;
  academyId: string;
  studentName: string;
  course: string;
  fee: number;
  status: "pending" | "confirmed" | "rejected";
  date: string;
}

export type Route =
  | { name: "landing" }
  | { name: "auth"; tab: "student-login" | "student-signup" | "academy-login" | "academy-signup" | "teacher-login" | "admin-login" }
  | { name: "student"; page: string; params?: Record<string, string> }
  | { name: "academy"; page: string; params?: Record<string, string> }
  | { name: "teacher"; page: string; params?: Record<string, string> }
  | { name: "admin"; page: string; params?: Record<string, string> }
  | { name: "academy-details"; academyId: string }
  | { name: "search"; query?: string };
