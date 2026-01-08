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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/projectService";
import { getClientList } from "@/services/clientService";
import type { Project, Client } from "@/types";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

const ProjectList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result: any = await getProjectList({
        pageNum,
        pageSize,
        keyword: keyword || undefined,
      });
      setProjects(result.records || []);
      setTotal(result.total || 0);
    } catch (error) {
      message.error("加载项目列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, keyword]);

  const loadClients = useCallback(async () => {
    try {
      const result: any = await getClientList({ pageNum: 1, pageSize: 1000 });
      setClients(result.records || []);
    } catch (error) {
      console.error("加载客户列表失败", error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadClients();
  }, [loadProjects, loadClients]);

  const statusMap: Record<string, string> = {
    Planning: "规划中",
    "In Progress": "进行中",  // 注意：数据库中是有空格的
    Completed: "已完成",
    Suspended: "已暂停",
    Pending: "待处理",  // 兼容处理
  };

  const columns: ColumnsType<Project> = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
      width: 200,
    },
    {
      title: "客户名称",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
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
      title: "预算",
      dataIndex: "budget",
      key: "budget",
      width: 120,
      render: (value) => `¥${value}`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value) => {
        let className = "status-tag";
        if (value === "Completed") className += " success";
        else if (value === "In Progress" || value === "InProgress") className += " warning";  // 兼容两种格式
        else if (value === "Suspended") className += " danger"; // or inline

        if (value === "Suspended") {
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
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Project) => {
    setEditingProject(record);
    form.setFieldsValue({
      projectName: record.projectName,
      customerId: record.customerId,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      budget: record.budget,
      status: record.status,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleDelete = (record: Project) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除项目"${record.projectName}"吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteProject(record.id!);
          message.success("删除成功");
          loadProjects();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate
          ? dayjs(values.startDate).format("YYYY-MM-DD")
          : null,
        endDate: values.endDate
          ? dayjs(values.endDate).format("YYYY-MM-DD")
          : null,
      };

      if (editingProject) {
        await updateProject(editingProject.id!, data);
        message.success("更新成功");
      } else {
        await createProject(data);
        message.success("创建成功");
      }

      setModalVisible(false);
      loadProjects();
    } catch (error) {
      message.error("保存失败");
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
  };

  const handleReset = () => {
    setKeyword("");
    setPageNum(1);
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
        项目管理
      </h1>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索项目名称"
          onSearch={handleSearch}
          style={{ width: 250 }}
          enterButton={<SearchOutlined />}
          allowClear
        />
        <Button onClick={handleReset} className="btn-secondary">
          重置
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="btn-primary"
        >
          新增项目
        </Button>
      </Space>

      <Table
        className="contract-table"
        columns={columns}
        dataSource={projects}
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
        title={editingProject ? "编辑项目" : "新增项目"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="项目名称"
            name="projectName"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            label="客户"
            name="customerId"
            rules={[{ required: true, message: "请选择客户" }]}
          >
            <Select placeholder="请选择客户">
              {clients.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.clientName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="开始日期"
            name="startDate"
            rules={[{ required: true, message: "请选择开始日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="结束日期"
            name="endDate"
            rules={[{ required: true, message: "请选择结束日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="预算"
            name="budget"
            rules={[{ required: true, message: "请输入预算" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={2}
              placeholder="请输入预算"
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select placeholder="请选择状态">
              <Option value="Planning">规划中</Option>
              <Option value="In Progress">进行中</Option>
              <Option value="Completed">已完成</Option>
              <Option value="Suspended">已暂停</Option>
              <Option value="Pending">待处理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;
