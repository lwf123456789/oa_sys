import { Node, Edge } from 'reactflow';

export type WorkflowNodeType =
    | 'start' //开始类型
    | 'approval' //审批类型
    | 'condition' //条件类型
    | 'parallel' //并行类型
    | 'subprocess' //子流程类型
    | 'cc' //抄送类型
    | 'end'; //结束类型

export interface WorkflowNodeData {
    /** 节点类型：开始、审批、条件、并行、子流程、抄送、结束 */
    type: WorkflowNodeType;
    /** 节点显示名称 */
    label: string;
    /** 节点描述信息 */
    description?: string;
    /** 节点配置信息 */
    config?: {
        // 审批节点配置
        mergeRule?: 'any' | 'all'; // 添加汇聚规则
        // any: 任一分支到达即可触发审批
        // all: 所有分支到达才触发审批
        /** 是否为默认审批节点 */
        isDefault?: boolean;
        /** 审批方式：AND(会签)、OR(或签) */
        approvalMode?: 'AND' | 'OR';
        /** 审批人类型：specific(指定成员)、leader(上级领导)、role(指定角色)、department(指定部门) */
        approverType?: 'specific' | 'leader' | 'role' | 'department';
        /** 审批人列表 */
        approvers?: string[];
        /** 关联表单ID */
        formId?: string;
        /** 审批时限(小时) */
        timeLimit?: number;
        /** 超时自动通过 */
        autoPass?: boolean;
        /** 发起人类型：all(所有人)、self(指定人员) */
        initiatorType?: 'all' | 'self';
        /** 流程标题，支持${表单字段}变量 */
        processTitle?: string;
        /** 流程分类：审批、抄送 */
        category?: 'approval' | 'cc';
        /** 结束行为：通过、拒绝、通知 */
        endBehavior?: 'pass' | 'reject' | 'notify';
        /** 是否发送通知 */
        sendNotification?: boolean;
        /** 通知内容模板，支持${表单字段}变量 */
        notificationTemplate?: string;
        /** 超时配置 */
        timeout?: {
            /** 是否启用超时处理 */
            enabled: boolean;
            /** 超时时间(小时) */
            hours?: number;
            /** 超时动作：通过、拒绝、通知 */
            action?: 'pass' | 'reject' | 'notify';
        };
        /** 并行节点配置 */
        strategy?: 'ALL' | 'ANY';
        /** 分支配置 */
        branches?: Array<{
            id: string;
            label: string;
            description?: string;
        }>;
        defaultBranch?: {
            id: string;
            label: string;
            description?: string;
        };
        /** 条件节点配置 */
        condition?: ConditionNodeConfig;
    };
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description?: string;
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
    created_at: string;
    updated_at: string;
    status: number;
}

// 并行节点配置
export interface ParallelNodeConfig {
    /** 并行策略：ALL(所有分支都通过)、ANY(任一分支通过) */
    strategy: 'ALL' | 'ANY';
    /** 分支配置 */
    branches: {
        id: string;
        label: string;
        description?: string;
        nodeIds: string[]; // 记录该分支包含的节点ID
        entryNodeId?: string; // 分支入口节点
        exitNodeId?: string;  // 分支出口节点
    }[];
}

// 条件节点配置
export interface ConditionNodeConfig {
    /** 条件分支列表 */
    branches: Array<{
        id: string;
        label: string;
        description?: string;
        /** 条件表达式 */
        conditions: Array<{
            field: string;
            operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'not_contains';
            value: any;
        }>;
        /** 条件之间的关系 */
        relation: 'AND' | 'OR';
    }>;
    /** 默认分支 */
    defaultBranch: {
        id: string;
        label: string;
        description?: string;
    };
}