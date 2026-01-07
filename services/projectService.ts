import request from "@/utils/request";

export const getProjectList = (params: any) => {
  return request({
    url: "/api/projects",
    method: "get",
    params,
  });
};

export const createProject = (data: any) => {
  return request({
    url: "/api/projects",
    method: "post",
    data,
  });
};

export const updateProject = (id: number, data: any) => {
  return request({
    url: `/api/projects/${id}`,
    method: "put",
    data,
  });
};

export const deleteProject = (id: number) => {
  return request({
    url: `/api/projects/${id}`,
    method: "delete",
  });
};
