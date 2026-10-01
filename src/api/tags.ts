import apiClient from "./client";

export interface Tag {
  id: number;
  title: string;
}

export const getTags = async () => {
  return apiClient.get<Tag[]>("/tags");
};

export const getTagById = async (id: number) => {
  return apiClient.get<Tag>(`/tags/${id}`);
};

export const createTag = async (title: string) => {
  return apiClient.post<Tag>("/tags", { title });
};

export const updateTag = async (id: number, title: string) => {
  return apiClient.patch<Tag>(`/tags/${id}`, { title });
};

export const deleteTag = async (id: number) => {
  return apiClient.delete(`/tags/${id}`);
};
