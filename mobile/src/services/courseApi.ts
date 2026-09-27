import { api } from './api';
import type { Course, CoursePathResponse } from '../types/course';

export const courseApi = {
  async list() {
    const { data } = await api.get<{ courses: Course[] }>('/courses');
    return data.courses;
  },

  async activate(courseId: string) {
    const { data } = await api.post<{
      message: string;
      course: { id: string; title: string };
    }>(`/courses/${courseId}/activate`);
    return data;
  },

  async path(courseId: string) {
    const { data } = await api.get<CoursePathResponse>(
      `/courses/${courseId}/path`
    );
    return data;
  },
};
