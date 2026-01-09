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
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getContractList,
  createContract,
  updateContract,
  deleteContract,
  getContractFullInfo,
} from "@/services/contractService";
import { getClientList } from "@/services/clientService";
import type { Contract, Client, ContractFullInfo } from "@/types";

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
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [contractDetail, setContractDetail] = useState<ContractFullInfo | null>(
    null
  );
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();

  // 合同状态选项
  const statusOptions = ["Executing", "Signed", "Completed", "Terminated", "Pending"];

  // 状态映射
  const statusMap: Record<string, string> = {
    Executing: "执行中",
    Signed: "已签订",
    Completed: "已完成",
    Terminated: "已终止",
    Pending: "待处理",  // 新增
  };

  // 项目状态映射
  const projectStatusMap: Record<string, string> = {
    Planning: "规划中",
    "In Progress": "进行中",
    Completed: "已完成",
    Suspended: "已暂停",
    Pending: "待处理",
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
        const statusStyles: Record<string, { bg: string; color: string }> = {
          Signed: { bg: "#E8F5E9", color: "#34C759" },
          Executing: { bg: "#E6F7FF", color: "#0071E3" },
          Completed: { bg: "#F0F2F5", color: "#757575" },
          Terminated: { bg: "#FEE2E2", color: "#FF3B30" },
          Pending: { bg: "#FFF4E6", color: "#FF9500" },  // 新增：橙色
        };

        const style = statusStyles[status] || {
          bg: "#F5F7F8",
          color: "#1D1D1F",
        };

        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              background: style.bg,
              color: style.color,
            }}
          >
            {statusMap[status] || status}
          </span>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <div
            onClick={() => handleViewDetail(record)}
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
              e.currentTarget.style.background = "rgba(52, 199, 89, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <EyeOutlined style={{ fontSize: 20, color: "#34C759" }} />
          </div>
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
              e.currentTarget.style.background = "rgba(0, 113, 227, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <EditOutlined style={{ fontSize: 20, color: "#0071E3" }} />
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

  // 新增合同
  const handleAdd = () => {
    setEditingContract(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = async (record: Contract) => {
    try {
      const detail = await getContractFullInfo(record.id!);
      setContractDetail(detail);
      setDetailModalVisible(true);
    } catch (error) {
      message.error("加载合同详情失败");
    }
  };

  // 编辑合同
  const handleEdit = (record: Contract) => {
    setEditingContract(record);
    form.setFieldsValue({
      contractNo: record.contractNo,
      contractName: record.contractName,
      clientId: record.clientId,
      amount: record.amount,
      signDate: record.signDate ? dayjs(record.signDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      status: record.status,
      remark: record.remark,
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
    let values: any;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    try {
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
      message.error((error as any)?.message || "保存失败");
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
    <div
      className="contract-container"
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        padding: 16,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      <h1
        style={{
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 600,
          color: "#1D1D1F",
        }}
      >
        合同管理系统
      </h1>

      {/* 搜索和筛选区域 - 毛玻璃效果 */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(229, 231, 235, 0.5)",
          borderRadius: 12,
        }}
      >
        <Space size="middle" wrap>
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
          <Button
            onClick={handleReset}
            style={{
              background: "#F5F7F8",
              border: "1px solid #E5E7EB",
              color: "#1D1D1F",
              borderRadius: 8,
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              background: "#0071E3",
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0066D6";
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0071E3";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            新增合同
          </Button>
        </Space>
      </div>

      {/* 表格 - 苹果风格 */}
      <Table
        columns={columns}
        dataSource={contracts}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        rowClassName={(record, index) => "apple-table-row"}
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
        style={{
          marginTop: 16,
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

      {/* 合同详情弹窗 */}
      <Modal
        title="合同详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {contractDetail && (
          <div style={{ padding: "16px 0" }}>
            {/* 合同基本信息 */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#1D1D1F",
                }}
              >
                合同基本信息
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px 24px",
                }}
              >
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    合同编号：
                  </span>
                  <span
                    style={{ color: "#1D1D1F", fontSize: 14, fontWeight: 500 }}
                  >
                    {contractDetail.contractNumber}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    合同名称：
                  </span>
                  <span
                    style={{ color: "#1D1D1F", fontSize: 14, fontWeight: 500 }}
                  >
                    {contractDetail.contractName}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    合同金额：
                  </span>
                  <span
                    style={{ color: "#3B82F6", fontSize: 14, fontWeight: 600 }}
                  >
                    ¥{contractDetail.contractAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    已付款金额：
                  </span>
                  <span
                    style={{ color: "#34C759", fontSize: 14, fontWeight: 600 }}
                  >
                    ¥{(contractDetail.totalPayment || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    待付款金额：
                  </span>
                  <span
                    style={{ color: "#FF9500", fontSize: 14, fontWeight: 600 }}
                  >
                    ¥{(contractDetail.contractAmount - (contractDetail.totalPayment || 0)).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    签订日期：
                  </span>
                  <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                    {contractDetail.signingDate}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    到期日期：
                  </span>
                  <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                    {contractDetail.expiryDate}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    合同状态：
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      background: "#E8F5E9",
                      color: "#34C759",
                    }}
                  >
                    {statusMap[contractDetail.contractStatus] ||
                      contractDetail.contractStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* 客户信息 */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#1D1D1F",
                }}
              >
                客户信息
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px 24px",
                }}
              >
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    客户名称：
                  </span>
                  <span
                    style={{ color: "#1D1D1F", fontSize: 14, fontWeight: 500 }}
                  >
                    {contractDetail.customerName}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    联系人：
                  </span>
                  <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                    {contractDetail.customerContact}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    联系电话：
                  </span>
                  <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                    {contractDetail.customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* 项目信息 */}
            {contractDetail.projectName && (
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#1D1D1F",
                  }}
                >
                  项目信息
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px 24px",
                  }}
                >
                  <div>
                    <span style={{ color: "#64748B", fontSize: 14 }}>
                      项目名称：
                    </span>
                    <span
                      style={{
                        color: "#1D1D1F",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {contractDetail.projectName}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: 14 }}>
                      项目状态：
                    </span>
                    <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                      {contractDetail.projectStatus ? (projectStatusMap[contractDetail.projectStatus] || contractDetail.projectStatus) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 负责人信息 */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#1D1D1F",
                }}
              >
                负责人信息
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px 24px",
                }}
              >
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    合同管理员：
                  </span>
                  <span
                    style={{ color: "#1D1D1F", fontSize: 14, fontWeight: 500 }}
                  >
                    {contractDetail.contractManager}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    所属部门：
                  </span>
                  <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                    {contractDetail.managerDepartment}
                  </span>
                </div>
              </div>
            </div>

            {/* 审批信息 */}
            {contractDetail.approvalStatus && (
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#1D1D1F",
                  }}
                >
                  审批信息
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px 24px",
                  }}
                >
                  <div>
                    <span style={{ color: "#64748B", fontSize: 14 }}>
                      审批状态：
                    </span>
                    <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                      {contractDetail.approvalStatus}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontSize: 14 }}>
                      审批日期：
                    </span>
                    <span style={{ color: "#1D1D1F", fontSize: 14 }}>
                      {contractDetail.approvalDate}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractList;
