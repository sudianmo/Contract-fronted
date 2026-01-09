"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getPaymentList,
  createPayment,
  updatePayment,
  deletePayment,
} from "@/services/paymentService";
import { getContractList } from "@/services/contractService";
import type { Payment, Contract } from "@/types";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

const PaymentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [form] = Form.useForm();

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const result: any = await getPaymentList({
        pageNum,
        pageSize,
      });
      setPayments(result.records || []);
      setTotal(result.total || 0);
    } catch (error) {
      message.error("加载支付列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize]);

  const loadContracts = useCallback(async () => {
    try {
      const result: any = await getContractList({ pageNum: 1, pageSize: 1000 });
      setContracts(result.records || []);
    } catch (error) {
      console.error("加载合同列表失败", error);
    }
  }, []);

  useEffect(() => {
    loadPayments();
    loadContracts();
  }, [loadPayments, loadContracts]);

  const statusMap: Record<string, string> = {
    Pending: "待支付",
    Completed: "已完成",
    Failed: "失败",
  };

  const columns: ColumnsType<Payment> = [
    {
      title: "合同名称",
      dataIndex: "contractName",
      key: "contractName",
      width: 200,
    },
    {
      title: "支付金额",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 120,
      render: (value) => `¥${value}`,
    },
    {
      title: "支付日期",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 120,
    },
    {
      title: "支付方式",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
    },
    {
      title: "支付状态",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      render: (value) => {
        let className = "status-tag";
        if (value === "Completed") className += " success";
        else if (value === "Pending") className += " warning";
        else if (value === "Failed") className += " danger"; // Assuming danger class exists or just use inline style

        if (value === "Failed") {
          return (
            <span
              className="status-tag"
              style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}
            >
              {statusMap[value] || value}
            </span>
          );
        }
        return <span className={className}>{statusMap[value] || value}</span>;
      },
    },
    {
      title: "备注",
      dataIndex: "remarks",
      key: "remarks",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <div
            onClick={() => handleEdit(record)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "6px",
              borderRadius: 6,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(108, 43, 217, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <EditOutlined style={{ fontSize: 20, color: "#6C2BD9" }} />
          </div>
          <div
            onClick={() => handleDelete(record)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "6px",
              borderRadius: 6,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 59, 48, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <DeleteOutlined style={{ fontSize: 20, color: "#FF3B30" }} />
          </div>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Payment) => {
    setEditingPayment(record);
    form.setFieldsValue({
      ...record,
      paymentDate: record.paymentDate ? dayjs(record.paymentDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (record: Payment) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除这条支付记录吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deletePayment(record.id!);
          message.success("删除成功");
          loadPayments();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // 调试输出
      
      const data = {
        ...values,
        paymentDate: values.paymentDate
          ? dayjs(values.paymentDate).format("YYYY-MM-DD")
          : null,
      };
      
      console.log("Submitting data:", data); // 调试输出

      if (editingPayment) {
        await updatePayment(editingPayment.id!, data);
        message.success("更新成功");
      } else {
        const result = await createPayment(data);
        console.log("Create result:", result); // 调试输出
        message.success("创建成功");
      }

      setModalVisible(false);
      loadPayments();
    } catch (error: any) {
      console.error("保存错误:", error); // 调试输出
      const errorMsg = error?.response?.data?.message || error?.message || "保存失败";
      message.error(errorMsg);
    }
  };

  return (
    <div className="contract-container">
      <h1
        style={{
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 500,
          color: "#1E293B",
        }}
      >
        支付管理
      </h1>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="btn-primary"
        >
          新增支付
        </Button>
      </Space>

      <Table
        className="contract-table"
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, size) => {
            setPageNum(page);
            setPageSize(size);
          },
        }}
      />

      <Modal
        title={editingPayment ? "编辑支付" : "新增支付"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="合同"
            name="contractId"
            rules={[{ required: true, message: "请选择合同" }]}
          >
            <Select placeholder="请选择合同">
              {contracts.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.contractName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="支付金额"
            name="paymentAmount"
            rules={[{ required: true, message: "请输入支付金额" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={2}
              placeholder="请输入支付金额"
            />
          </Form.Item>
          <Form.Item
            label="支付日期"
            name="paymentDate"
            rules={[{ required: true, message: "请选择支付日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="支付方式"
            name="paymentMethod"
            rules={[{ required: true, message: "请输入支付方式" }]}
          >
            <Select placeholder="请选择支付方式">
              <Option value="Bank Transfer">银行转账</Option>
              <Option value="Cash">现金</Option>
              <Option value="Check">支票</Option>
              <Option value="Other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="支付状态"
            name="paymentStatus"
            rules={[{ required: true, message: "请选择支付状态" }]}
          >
            <Select placeholder="请选择支付状态">
              <Option value="Pending">待支付</Option>
              <Option value="Completed">已完成</Option>
              <Option value="Failed">失败</Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remarks">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentList;
