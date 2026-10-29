"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, qs } from "@/lib/api-client";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

// ============ Query Keys ============
export const qk = {
  academies: (filters?: any) => ["academies", filters] as const,
  academy: (id: string) => ["academy", id] as const,
  myAcademy: () => ["my-academy"] as const,
  courses: (academyId: string) => ["courses", academyId] as const,
  teachers: (academyId: string) => ["teachers", academyId] as const,
  students: (academyId: string, filters?: any) => ["students", academyId, filters] as const,
  reviews: (academyId: string) => ["reviews", academyId] as const,
  announcements: (academyId: string) => ["announcements", academyId] as const,
  admissions: (academyId: string) => ["admissions", academyId] as const,
  inquiries: (academyId: string) => ["inquiries", academyId] as const,
  notifications: () => ["notifications"] as const,
  favorites: () => ["favorites"] as const,
  adminStats: () => ["admin-stats"] as const,
  teacherStudents: () => ["teacher-students"] as const,
};

// ============ Auth ============
export function useLogin() {
  const qc = useQueryClient();
  const { login: ctxLogin } = useApp();
  return useMutation({
    mutationFn: async (creds: { email: string; password: string; role: string }) =>
      api.post<{ success: boolean; data: { user: any } }>("/auth/login", creds),
    onSuccess: (res) => {
      qc.setQueryData(["me"], res);
      ctxLogin(res.data.user);
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  const { signup: ctxSignup } = useApp();
  return useMutation({
    mutationFn: async (data: any) =>
      api.post<{ success: boolean; data: { user: any } }>("/auth/signup", data),
    onSuccess: (res) => {
      qc.setQueryData(["me"], res);
      ctxSignup(res.data.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const { logout: ctxLogout } = useApp();
  return useMutation({
    mutationFn: async () => api.post("/auth/logout"),
    onSuccess: () => {
      qc.clear();
      ctxLogout();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => api.get<{ success: boolean; data: { user: any | null } }>("/auth/me"),
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Academies ============
export function useAcademies(filters: any = {}) {
  return useQuery({
    queryKey: qk.academies(filters),
    queryFn: async () => api.get(`/academies${qs(filters)}`),
    staleTime: 30 * 1000,
  });
}

export function useAcademy(id: string | null) {
  return useQuery({
    queryKey: qk.academy(id || ""),
    queryFn: async () => api.get(`/academies/${id}`),
    enabled: !!id,
  });
}

export function useMyAcademy() {
  return useQuery({
    queryKey: qk.myAcademy(),
    queryFn: async () => api.get("/me/academy"),
  });
}

export function useUpdateAcademy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/academies/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: qk.academy(id) });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      qc.invalidateQueries({ queryKey: qk.academies() });
      toast.success("Academy updated");
    },
  });
}

// ============ Courses ============
export function useCourses(academyId: string | null) {
  return useQuery({
    queryKey: qk.courses(academyId || ""),
    queryFn: async () => api.get(`/courses${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/courses", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.courses(vars.academyId) });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Course added");
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/courses/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Course updated");
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Course deleted");
    },
  });
}

// ============ Teachers ============
export function useTeachers(academyId: string | null) {
  return useQuery({
    queryKey: qk.teachers(academyId || ""),
    queryFn: async () => api.get(`/teachers${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/teachers", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.teachers(vars.academyId) });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Teacher added");
    },
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/teachers/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Teacher updated");
    },
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/teachers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Teacher removed");
    },
  });
}

// ============ Students ============
export function useStudents(academyId: string | null, filters: any = {}) {
  return useQuery({
    queryKey: qk.students(academyId || "", filters),
    queryFn: async () => api.get(`/students${qs({ academyId, ...filters })}`),
    enabled: !!academyId,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/students", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.students(vars.academyId) });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Student added");
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/students/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Student updated");
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/students/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Student deleted");
    },
  });
}

// ============ Reviews ============
export function useReviews(academyId: string | null) {
  return useQuery({
    queryKey: qk.reviews(academyId || ""),
    queryFn: async () => api.get(`/reviews${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/reviews", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.reviews(vars.academyId) });
      qc.invalidateQueries({ queryKey: qk.academy(vars.academyId) });
      toast.success("Review added");
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/reviews/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["academy"] });
      toast.success("Review updated");
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["academy"] });
      toast.success("Review deleted");
    },
  });
}

// ============ Announcements ============
export function useAnnouncements(academyId: string | null, publishedOnly = false) {
  return useQuery({
    queryKey: qk.announcements(academyId || ""),
    queryFn: async () => api.get(`/announcements${qs({ academyId, published: publishedOnly ? "true" : undefined })}`),
    enabled: !!academyId,
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/announcements", data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.announcements(vars.academyId) });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Announcement published");
    },
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/announcements/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Announcement updated");
    },
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Announcement deleted");
    },
  });
}

// ============ Admissions & Inquiries ============
export function useAdmissions(academyId: string | null) {
  return useQuery({
    queryKey: qk.admissions(academyId || ""),
    queryFn: async () => api.get(`/admissions${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useUpdateAdmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      api.patch("/admissions", { id, status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admissions"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Admission updated");
    },
  });
}

export function useInquiries(academyId: string | null) {
  return useQuery({
    queryKey: qk.inquiries(academyId || ""),
    queryFn: async () => api.get(`/inquiries${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/inquiries", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry sent");
    },
  });
}

export function useUpdateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      api.patch("/inquiries", { id, status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
      qc.invalidateQueries({ queryKey: qk.myAcademy() });
      toast.success("Inquiry updated");
    },
  });
}

// ============ Notifications ============
export function useNotifications() {
  return useQuery({
    queryKey: qk.notifications(),
    queryFn: async () => api.get("/notifications"),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, markAll }: { id?: string; markAll?: boolean }) =>
      api.patch("/notifications", { id, markAll }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.notifications() });
    },
  });
}

// ============ Favorites ============
export function useFavorites() {
  return useQuery({
    queryKey: qk.favorites(),
    queryFn: async () => api.get("/favorites"),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (academyId: string) => api.post("/favorites", { academyId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.favorites() });
    },
  });
}

// ============ Admin ============
export function useAdminStats() {
  return useQuery({
    queryKey: qk.adminStats(),
    queryFn: async () => api.get("/admin/stats"),
  });
}

export function useResetDatabase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => api.post("/admin/reset"),
    onSuccess: () => {
      qc.clear();
      toast.success("Database reset to sample data");
      setTimeout(() => window.location.reload(), 1000);
    },
  });
}

// ============ Teacher-scoped ============
export function useTeacherStudents() {
  return useQuery({
    queryKey: qk.teacherStudents(),
    queryFn: async () => api.get("/teacher/students"),
  });
}

// ============ AI ============
export function useAIRecommend() {
  return useMutation({
    mutationFn: async (data: any) => api.post("/ai/recommend", data),
  });
}

export function useAICompare() {
  return useMutation({
    mutationFn: async (data: any) => api.post("/ai/compare", data),
  });
}

export function useAICareer() {
  return useMutation({
    mutationFn: async (data: any) => api.post("/ai/career", data),
  });
}

export function useAISummarizeReviews() {
  return useMutation({
    mutationFn: async (academyId: string) => api.post("/ai/summarize-reviews", { academyId }),
  });
}

// ============ Scholarships ============
export function useScholarships(academyId: string | null) {
  return useQuery({
    queryKey: ["scholarships", academyId || ""],
    queryFn: async () => api.get(`/scholarships${qs({ academyId })}`),
    enabled: !!academyId,
  });
}

export function useCreateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/scholarships", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scholarships"] });
      toast.success("Scholarship added");
    },
  });
}

export function useUpdateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/scholarships/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scholarships"] });
      toast.success("Scholarship updated");
    },
  });
}

export function useDeleteScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/scholarships/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scholarships"] });
      toast.success("Scholarship deleted");
    },
  });
}

// ============ Categories ============
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => api.get("/categories"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/categories", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added");
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      api.patch(`/categories/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
  });
}
