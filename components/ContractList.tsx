"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getContractList,
  createContract,
  updateContract,
  deleteContract,
} from "@/services/contractService";
import { getClientList } from "@/services/clientService";
import type { Contract, Client } from "@/types";

const { Search } = Input;
const { Option } = Select;

const ContractList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();

  // 合同状态选项
  const statusOptions = ["Executing", "Signed", "Completed", "Terminated"];

  // 状态映射
  const statusMap: Record<string, string> = {
    Executing: "执行中",
    Signed: "已签订",
    Completed: "已完成",
    Terminated: "已终止",
  };

  // 加载合同列表
  const loadContracts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getContractList({
        pageNum,
        pageSize,
        keyword: keyword || undefined,
        status: status || undefined,
        clientId: clientId || undefined,
      });
      setContracts(result.records || []);
      setTotal(result.total);
    } catch (error) {
      message.error("加载合同列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, keyword, status, clientId]);

  // 加载客户列表（用于下拉选择）
  const loadClients = useCallback(async () => {
    try {
      const result = await getClientList({ pageNum: 1, pageSize: 1000 });
      setClients(result.records || []);
    } catch (error) {
      console.error("加载客户列表失败", error);
    }
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // 表格列定义
  const columns: ColumnsType<Contract> = [
    {
      title: "合同编号",
      dataIndex: "contractNo",
      key: "contractNo",
      width: 150,
    },
    {
      title: "合同名称",
      dataIndex: "contractName",
      key: "contractName",
      width: 200,
    },
    {
      title: "客户名称",
      dataIndex: "clientName",
      key: "clientName",
      width: 150,
    },
    {
      title: "合同金额",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: "签订日期",
      dataIndex: "signDate",
      key: "signDate",
      width: 120,
    },
    {
      title: "结束日期",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
         let className = "status-tag";
         if (status === "Signed") className += " success";
         else if (status === "Executing" || status === "Completed") className += " warning"; // Adjust logic if needed
         
         // Custom mapping based on user description:
         // Signed: success (green)
         // Executing: maybe blue or warning? User said "Executing" (Wait for audit?) -> warning
         // Actually user said: "Signed" -> success, "Pending Audit" -> warning.
         // Let's stick to the CSS classes provided.
         
         const statusStyle: React.CSSProperties = {};
         if (status === "Signed") {
             // success
             return <span className="status-tag success">{statusMap[status] || status}</span>;
         } else if (status === "Executing") {
             // Use default or maybe a primary light color? 
             // User didn't specify for Executing. I'll use a blue-ish custom one or warning.
             // Let's use a custom inline style for blue if not defined in CSS.
             return <span className="status-tag" style={{backgroundColor: '#EFF6FF', color: '#3B82F6'}}>{statusMap[status] || status}</span>;
         } else if (status === "Completed") {
             // Maybe gray or success?
             return <span className="status-tag" style={{backgroundColor: '#F1F5F9', color: '#64748B'}}>{statusMap[status] || status}</span>;
         } else if (status === "Terminated") {
              return <span className="status-tag" style={{backgroundColor: '#FEF2F2', color: '#EF4444'}}>{statusMap[status] || status}</span>;
         }

         return <span className={className}>{statusMap[status] || status}</span>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            className="btn-secondary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            className="btn-danger"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 新增合同
  const handleAdd = () => {
    setEditingContract(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑合同
  const handleEdit = (record: Contract) => {
    setEditingContract(record);
    form.setFieldsValue({
      ...record,
      signDate: record.signDate ? dayjs(record.signDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalVisible(true);
  };

  // 删除合同
  const handleDelete = (record: Contract) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除合同"${record.contractName}"吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteContract(record.id!);
          message.success("删除成功");
          loadContracts();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  // 保存合同
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const contractData = {
        ...values,
        signDate: values.signDate
          ? dayjs(values.signDate).format("YYYY-MM-DD")
          : null,
        endDate: values.endDate
          ? dayjs(values.endDate).format("YYYY-MM-DD")
          : null,
      };

      if (editingContract) {
        await updateContract(editingContract.id!, contractData);
        message.success("更新成功");
      } else {
        await createContract(contractData);
        message.success("创建成功");
      }

      setModalVisible(false);
      loadContracts();
    } catch (error) {
      message.error("保存失败");
    }
  };

  // 搜索
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword("");
    setStatus(undefined);
    setClientId(undefined);
    setPageNum(1);
  };

  return (
    <div className="contract-container">
        <h1
          style={{
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 600,
            color: "#1E293B",
          }}
        >
          合同管理系统
        </h1>

        {/* 搜索和筛选区域 */}
        <Space style={{ marginBottom: 16 }} size="middle">
          <Search
            placeholder="搜索合同编号、名称"
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="选择状态"
            style={{ width: 120 }}
            allowClear
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPageNum(1);
            }}
          >
            {statusOptions.map((s) => (
              <Option key={s} value={s}>
                {statusMap[s]}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="选择客户"
            style={{ width: 200 }}
            allowClear
            showSearch
            filterOption={(input, option) =>
              String(option?.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            value={clientId}
            onChange={(value) => {
              setClientId(value);
              setPageNum(1);
            }}
          >
            {clients?.map((client) => (
              <Option key={client.id} value={client.id!}>
                {client.clientName}
              </Option>
            ))}
          </Select>
          <Button onClick={handleReset} className="btn-secondary">重置</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="btn-primary"
          >
            新增合同
          </Button>
        </Space>

        {/* 表格 */}
        <Table
          className="contract-table"
          columns={columns}
          dataSource={contracts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
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

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingContract ? "编辑合同" : "新增合同"}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={800}
          okText="保存"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="合同编号"
              name="contractNo"
              rules={[{ required: true, message: "请输入合同编号" }]}
            >
              <Input placeholder="请输入合同编号" />
            </Form.Item>

            <Form.Item
              label="合同名称"
              name="contractName"
              rules={[{ required: true, message: "请输入合同名称" }]}
            >
              <Input placeholder="请输入合同名称" />
            </Form.Item>

            <Form.Item
              label="客户"
              name="clientId"
              rules={[{ required: true, message: "请选择客户" }]}
            >
              <Select
                placeholder="请选择客户"
                showSearch
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {clients?.map((client) => (
                  <Option key={client.id} value={client.id!}>
                    {client.clientName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="合同金额"
              name="amount"
              rules={[{ required: true, message: "请输入合同金额" }]}
            >
              <InputNumber
                placeholder="请输入合同金额"
                style={{ width: "100%" }}
                min={0}
                precision={2}
                formatter={(value) =>
                  `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/¥\s?|(,*)/g, "") as any}
              />
            </Form.Item>

            <Form.Item
              label="签订日期"
              name="signDate"
              rules={[{ required: true, message: "请选择签订日期" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="请选择签订日期"
              />
            </Form.Item>

            <Form.Item
              label="结束日期"
              name="endDate"
              rules={[{ required: true, message: "请选择结束日期" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="请选择结束日期"
              />
            </Form.Item>

            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: "请选择状态" }]}
            >
              <Select placeholder="请选择状态">
                {statusOptions.map((s) => (
                  <Option key={s} value={s}>
                    {statusMap[s]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default ContractList;
