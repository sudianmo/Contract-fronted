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
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import type { Product } from "@/types";

const { Search } = Input;

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result: any = await getProductList({
        pageNum,
        pageSize,
        keyword: keyword || undefined,
      });
      console.log("产品数据:", result);
      setProducts(result.records || []);
      setTotal(result.total || 0);
    } catch (error) {
      message.error("加载产品列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, keyword]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const columns: ColumnsType<Product> = [
    {
      title: "产品名称",
      dataIndex: "productName",
      key: "productName",
      width: 200,
    },
    {
      title: "规格",
      dataIndex: "specification",
      key: "specification",
      width: 150,
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      render: (value) => `¥${value}`,
    },
    {
      title: "库存数量",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 120,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 150,
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

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Product) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除产品"${record.productName}"吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteProduct(record.id!);
          message.success("删除成功");
          loadProducts();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        await updateProduct(editingProduct.id!, values);
        message.success("更新成功");
      } else {
        await createProduct(values);
        message.success("创建成功");
      }

      setModalVisible(false);
      loadProducts();
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
          产品管理
        </h1>

        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索产品名称或分类"
            onSearch={handleSearch}
            style={{ width: 250 }}
            enterButton={<SearchOutlined />}
            allowClear
          />
          <Button onClick={handleReset} className="btn-secondary">重置</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="btn-primary"
          >
            新增产品
          </Button>
        </Space>

        <Table
          className="contract-table"
          columns={columns}
          dataSource={products}
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
          title={editingProduct ? "编辑产品" : "新增产品"}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          okText="保存"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="产品名称"
              name="productName"
              rules={[{ required: true, message: "请输入产品名称" }]}
            >
              <Input placeholder="请输入产品名称" />
            </Form.Item>
            <Form.Item
              label="规格"
              name="specification"
              rules={[{ required: true, message: "请输入规格" }]}
            >
              <Input placeholder="请输入规格" />
            </Form.Item>
            <Form.Item
              label="单价"
              name="unitPrice"
              rules={[{ required: true, message: "请输入单价" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                precision={2}
                placeholder="请输入单价"
              />
            </Form.Item>
            <Form.Item
              label="库存数量"
              name="stockQuantity"
              rules={[{ required: true, message: "请输入库存数量" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                precision={0}
                placeholder="请输入库存数量"
              />
            </Form.Item>
            <Form.Item
              label="分类"
              name="category"
              rules={[{ required: true, message: "请输入分类" }]}
            >
              <Input placeholder="请输入分类" />
            </Form.Item>
            <Form.Item label="描述" name="description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default ProductList;
