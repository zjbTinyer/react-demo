import { Input, InputNumber, Select, Form } from 'antd';
import DictRefSelect from './DictRefSelect';

/**
 * 动态配置表单 — 核心组件
 * 根据 StepDefinition 的 configSchema 动态渲染 Ant Design 表单控件
 *
 * @param {Object} props
 * @param {import('../types').ConfigField[]} props.configSchema - 配置字段定义列表
 * @param {Object.<string, any>} props.values - 当前配置值
 * @param {Function} props.onChange - 配置变更回调 (fieldName, newValue) => void
 * @param {boolean} [props.readOnly] - 是否只读
 */
export default function DynamicConfigForm({ configSchema, values = {}, onChange, readOnly = false }) {
  if (!configSchema || configSchema.length === 0) {
    return <div style={{ color: '#999', padding: 16 }}>该步骤没有可配置的字段</div>;
  }

  const handleChange = (fieldName, newValue) => {
    onChange?.(fieldName, newValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {configSchema.map((field) => {
        const currentValue = values[field.name] ?? '';

        let control;

        if (field.valueType === 'fixed') {
          // 固定值 — 根据 dataType 和是否有限定选项来渲染
          if (field.options && field.options.length > 0) {
            control = (
              <Select
                value={currentValue}
                onChange={(v) => handleChange(field.name, v)}
                placeholder={field.placeholder || `选择${field.label}`}
                options={field.options.map((opt) => ({ label: String(opt), value: String(opt) }))}
                allowClear={!field.required}
                disabled={readOnly}
                style={{ width: '100%' }}
              />
            );
          } else if (field.dataType === 'number') {
            control = (
              <InputNumber
                value={currentValue}
                onChange={(v) => handleChange(field.name, v)}
                placeholder={field.placeholder}
                disabled={readOnly}
                style={{ width: '100%' }}
              />
            );
          } else if (field.dataType === 'boolean') {
            control = (
              <Select
                value={currentValue}
                onChange={(v) => handleChange(field.name, v)}
                disabled={readOnly}
                options={[
                  { label: '是', value: true },
                  { label: '否', value: false },
                ]}
                style={{ width: '100%' }}
              />
            );
          } else {
            control = (
              <Input
                value={currentValue}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || `输入${field.label}`}
                disabled={readOnly}
              />
            );
          }
        } else if (field.valueType === 'list') {
          // 固定列表
          control = (
            <Select
              mode="tags"
              value={Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : []}
              onChange={(v) => handleChange(field.name, v)}
              placeholder={field.placeholder || `输入多个${field.label}`}
              disabled={readOnly}
              tokenSeparators={[',', ';']}
              style={{ width: '100%' }}
            />
          );
        } else if (field.valueType === 'dict') {
          // 字典引用
          control = (
            <DictRefSelect
              dictId={field.dictId}
              dictColumn={field.dictColumn}
              value={currentValue}
              onChange={(v) => handleChange(field.name, v)}
              placeholder={field.placeholder}
              multiple={false}
            />
          );
        }

        return (
          <div key={field.name}>
            <label style={{
              display: 'block',
              marginBottom: 4,
              fontSize: 13,
              fontWeight: 500,
              color: '#333',
            }}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
            </label>
            {control}
            {field.valueType === 'dict' && field.dictId && (
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                引用字典数据
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
