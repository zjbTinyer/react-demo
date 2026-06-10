import { generateId, now } from '../utils/id';

/**
 * 预置字典数据
 * 「结构化数据表」— 有列定义和数据行
 */

/** @type {import('../types').Dict[]} */
const presetDicts = [
  {
    id: 'dict-users',
    name: '用户表',
    description: '系统用户信息表，包含姓名、邮箱和所属部门',
    columns: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'name', label: '姓名', type: 'string' },
      { name: 'email', label: '邮箱', type: 'string' },
      { name: 'department', label: '部门', type: 'string' },
    ],
    rows: [
      { id: 1, name: '张三', email: 'zhangsan@example.com', department: '技术部' },
      { id: 2, name: '李四', email: 'lisi@example.com', department: '产品部' },
      { id: 3, name: '王五', email: 'wangwu@example.com', department: '技术部' },
      { id: 4, name: '赵六', email: 'zhaoliu@example.com', department: '运维部' },
      { id: 5, name: '陈七', email: 'chenqi@example.com', department: '产品部' },
      { id: 6, name: '刘八', email: 'liuba@example.com', department: '技术部' },
    ],
  },
  {
    id: 'dict-environments',
    name: '环境表',
    description: '部署环境列表',
    columns: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'name', label: '环境名称', type: 'string' },
      { name: 'host', label: '主机地址', type: 'string' },
      { name: 'region', label: '区域', type: 'string' },
    ],
    rows: [
      { id: 1, name: '开发环境', host: 'dev.internal.com', region: '华东' },
      { id: 2, name: '测试环境', host: 'test.internal.com', region: '华东' },
      { id: 3, name: '预发环境', host: 'staging.internal.com', region: '华北' },
      { id: 4, name: '生产环境', host: 'prod.internal.com', region: '华北' },
      { id: 5, name: '灾备环境', host: 'dr.internal.com', region: '华南' },
    ],
  },
  {
    id: 'dict-departments',
    name: '部门表',
    description: '公司组织架构部门列表',
    columns: [
      { name: 'id', label: 'ID', type: 'number' },
      { name: 'name', label: '部门名称', type: 'string' },
      { name: 'manager', label: '负责人', type: 'string' },
    ],
    rows: [
      { id: 1, name: '技术部', manager: '张三' },
      { id: 2, name: '产品部', manager: '李四' },
      { id: 3, name: '运维部', manager: '赵六' },
      { id: 4, name: '设计部', manager: '王五' },
    ],
  },
];

export default presetDicts;
