import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 通用删除确认弹窗
 * @param {Object} options
 * @param {string} options.title - 要删除的内容名称
 * @param {Function} options.onOk - 确认回调
 */
export default function confirmDelete({ title, onOk }) {
  Modal.confirm({
    title: '确认删除',
    icon: <ExclamationCircleOutlined />,
    content: `确定要删除「${title}」吗？此操作不可撤销。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    centered: true,
    onOk,
  });
}
