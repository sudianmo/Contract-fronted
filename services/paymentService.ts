import request from "@/utils/request";

export const getPaymentList = (params: any) => {
  return request({
    url: "/api/payments",
    method: "get",
    params,
  });
};

export const createPayment = (data: any) => {
  return request({
    url: "/api/payments",
    method: "post",
    data,
  });
};

export const updatePayment = (id: number, data: any) => {
  return request({
    url: `/api/payments/${id}`,
    method: "put",
    data,
  });
};

export const deletePayment = (id: number) => {
  return request({
    url: `/api/payments/${id}`,
    method: "delete",
  });
};
