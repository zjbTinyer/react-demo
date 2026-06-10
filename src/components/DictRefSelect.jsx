import { Select } from 'antd';
import useDictStore from '../stores/dictStore';

/**
 * Dict 引用选择器
 * 根据字段定义中的 dictId 和 dictColumn，从字典数据中加载选项
 *
 * @param {Object} props
 * @param {string} props.dictId - 要引用的字典 ID
 * @param {string} props.dictColumn - 要引用的列名
 * @param {string} [props.value] - 当前选中值
 * @param {Function} props.onChange - 值变更回调
 * @param {string} [props.placeholder]
 * @param {boolean} [props.multiple] - 是否多选（用于 list 类型引用 dict）
 */
export default function DictRefSelect({ dictId, dictColumn, value, onChange, placeholder, multiple = false }) {
  const getColumnValues = useDictStore((s) => s.getColumnValues);
  const getById = useDictStore((s) => s.getById);

  const dict = getById(dictId);
  const options = dictId && dictColumn ? getColumnValues(dictId, dictColumn) : [];

  const placeholderText = placeholder || (dict
    ? `从「${dict.name}」的「${dictColumn}」列中选择`
    : '请先选择字典');

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholderText}
      mode={multiple ? 'multiple' : undefined}
      allowClear
      showSearch
      optionFilterProp="label"
      options={options.map((val) => ({ label: String(val), value: String(val) }))}
      style={{ width: '100%' }}
      notFoundContent={!dictId ? '未指定字典' : !dictColumn ? '未指定列' : '无数据'}
    />
  );
}
