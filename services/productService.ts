import request from "@/utils/request";

export const getProductList = (params: any) => {
  return request({
    url: "/api/products",
    method: "get",
    params,
  });
};

export const createProduct = (data: any) => {
  return request({
    url: "/api/products",
    method: "post",
    data,
  });
};

export const updateProduct = (id: number, data: any) => {
  return request({
    url: `/api/products/${id}`,
    method: "put",
    data,
  });
};

export const deleteProduct = (id: number) => {
  return request({
    url: `/api/products/${id}`,
    method: "delete",
  });
};
