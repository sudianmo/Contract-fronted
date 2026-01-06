"use client";

import React, { useState, useEffect } from "react";
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
  const statusOptions = ["草稿", "生效", "已完成", "已终止"];

  // 加载合同列表
  const loadContracts = async () => {
    setLoading(true);
    try {
      const result = await getContractList({
        pageNum,
        pageSize,
        keyword: keyword || undefined,
        status: status || undefined,
        clientId: clientId || undefined,
      });
      setContracts(result.list);
      setTotal(result.total);
    } catch (error) {
      message.error("加载合同列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 加载客户列表（用于下拉选择）
  const loadClients = async () => {
    try {
      const result = await getClientList({ pageNum: 1, pageSize: 1000 });
      setClients(result.list);
    } catch (error) {
      console.error("加载客户列表失败", error);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [pageNum, pageSize, keyword, status, clientId]);

  useEffect(() => {
    loadClients();
  }, []);

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
      title: "开始日期",
      dataIndex: "startDate",
      key: "startDate",
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
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
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
      startDate: record.startDate ? dayjs(record.startDate) : null,
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
        startDate: values.startDate
          ? dayjs(values.startDate).format("YYYY-MM-DD")
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
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>合同管理</h1>

      {/* 搜索和筛选区域 */}
      <Space style={{ marginBottom: 16 }} size="middle">
        <Search
          placeholder="搜索合同编号、名称"
          onSearch={handleSearch}
          style={{ width: 250 }}
          enterButton={<SearchOutlined />}
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
              {s}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="选择客户"
          style={{ width: 200 }}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.children as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={clientId}
          onChange={(value) => {
            setClientId(value);
            setPageNum(1);
          }}
        >
          {clients.map((client) => (
            <Option key={client.id} value={client.id!}>
              {client.clientName}
            </Option>
          ))}
        </Select>
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增合同
        </Button>
      </Space>

      {/* 表格 */}
      <Table
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
                (option?.children as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {clients.map((client) => (
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
              parser={(value) => value!.replace(/¥\s?|(,*)/g, "")}
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
            label="开始日期"
            name="startDate"
            rules={[{ required: true, message: "请选择开始日期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="请选择开始日期"
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
                  {s}
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
