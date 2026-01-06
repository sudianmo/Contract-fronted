"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Modal, Form, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getClientList,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/clientService";
import type { Client } from "@/types";

const { Search } = Input;

const ClientList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form] = Form.useForm();

  // 加载客户列表
  const loadClients = async () => {
    setLoading(true);
    try {
      const result = await getClientList({
        pageNum,
        pageSize,
        keyword: keyword || undefined,
      });
      setClients(result.records || []);
      setTotal(result.total);
    } catch (error) {
      message.error("加载客户列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [pageNum, pageSize, keyword]);

  // 表格列定义
  const columns: ColumnsType<Client> = [
    {
      title: "客户名称",
      dataIndex: "clientName",
      key: "clientName",
      width: 200,
    },
    {
      title: "联系人",
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: 120,
    },
    {
      title: "联系电话",
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: 150,
    },
    {
      title: "联系邮箱",
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: 200,
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      width: 250,
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

  // 新增客户
  const handleAdd = () => {
    setEditingClient(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑客户
  const handleEdit = (record: Client) => {
    setEditingClient(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除客户
  const handleDelete = (record: Client) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除客户"${record.clientName}"吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteClient(record.id!);
          message.success("删除成功");
          loadClients();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  // 保存客户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingClient) {
        await updateClient(editingClient.id!, values);
        message.success("更新成功");
      } else {
        await createClient(values);
        message.success("创建成功");
      }

      setModalVisible(false);
      loadClients();
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
    setPageNum(1);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <h1
          style={{
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 500,
            color: "#52c41a",
          }}
        >
          客户管理
        </h1>

        {/* 搜索区域 */}
        <Space style={{ marginBottom: 16 }} size="middle">
          <Search
            placeholder="搜索客户名称、联系人"
            onSearch={handleSearch}
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增客户
          </Button>
        </Space>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={clients}
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

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingClient ? "编辑客户" : "新增客户"}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          width={700}
          okText="保存"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="客户名称"
              name="clientName"
              rules={[{ required: true, message: "请输入客户名称" }]}
            >
              <Input placeholder="请输入客户名称" />
            </Form.Item>

            <Form.Item
              label="联系人"
              name="contactPerson"
              rules={[{ required: true, message: "请输入联系人" }]}
            >
              <Input placeholder="请输入联系人" />
            </Form.Item>

            <Form.Item
              label="联系电话"
              name="contactPhone"
              rules={[
                { required: true, message: "请输入联系电话" },
                { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码" },
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              label="联系邮箱"
              name="contactEmail"
              rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>

            <Form.Item label="地址" name="address">
              <Input placeholder="请输入地址" />
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ClientList;
