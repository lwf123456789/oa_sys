export type ConditionOperator =
    | 'eq' | 'neq'  // 等于/不等于
    | 'gt' | 'lt'   // 大于/小于
    | 'gte' | 'lte' // 大于等于/小于等于
    | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' // 包含/不包含/以...开头/以...结尾
    | 'in' | 'not_in' // 在列表中/不在列表中
    | 'between';      // 区间

export type ConditionFieldType =
    | 'number'    // 数字
    | 'string'    // 字符串
    | 'date'      // 日期
    | 'datetime'  // 日期时间
    | 'boolean'   // 布尔值
    | 'enum';     // 枚举值

// 基础字段属性
export interface BaseConditionField {
    key: string;
    label: string;
    type: ConditionFieldType;
    name?: string; // 改为可选属性
}

// 数字类型字段
export interface NumberConditionField extends BaseConditionField {
    type: 'number';
    unit?: string;
    min?: number;
    max?: number;
    precision?: number;
}

// 枚举类型字段
export interface EnumConditionField extends BaseConditionField {
    type: 'enum';
    options: Array<{
        label: string;
        value: string | number;
    }>;
}   

// 日期类型字段
export interface DateConditionField extends BaseConditionField {
    type: 'date' | 'datetime';
    format?: string;
}

// 字符串类型字段
export interface StringConditionField extends BaseConditionField {
    type: 'string';
    maxLength?: number;
}

// 布尔类型字段
export interface BooleanConditionField extends BaseConditionField {
    type: 'boolean';
}

export type ConditionField =
    | NumberConditionField
    | EnumConditionField
    | DateConditionField
    | StringConditionField
    | BooleanConditionField;

export interface ConditionExpression {
    id: string;
    field: string;
    operator: ConditionOperator;
    value: any;
    valueEnd?: any; // 用于区间条件
}

export interface ConditionBranch {
    id: string;
    label: string;
    description?: string;
    relation: 'AND' | 'OR';
    conditions: ConditionExpression[];
    priority: number; // 优先级，用于分支排序
}

export interface ConditionNodeConfig {
    branches: ConditionBranch[];
    defaultBranch: {
        id: string;
        label: string;
        description?: string;
    };
}