interface ApplyRecord {
    id: string;
    title: string;
    processName: string;
    status: 'draft' | 'running' | 'completed' | 'rejected';
    currentNode: string;
    createTime: string;
    updateTime: string;
    progress: number;
    approvalRecords: {
      node: string;
      operator: string;
      action: 'approve' | 'reject';
      comment: string;
      time: string;
    }[];
  }

export const mockData: ApplyRecord[] = [
    {
      id: 'AP202403200001',
      title: '请假申请-张三',
      processName: '员工请假流程',
      status: 'running',
      currentNode: '部门经理审批',
      createTime: '2024-03-20 10:00:00',
      updateTime: '2024-03-20 10:30:00',
      progress: 60,
      approvalRecords: [
        {
          node: '发起申请',
          operator: '张三',
          action: 'approve',
          comment: '因私事请假2天',
          time: '2024-03-20 10:00:00'
        },
        {
          node: '部门经理审批',
          operator: '李经理',
          action: 'approve',
          comment: '同意，请做好工作交接',
          time: '2024-03-20 10:30:00'
        }
      ]
    },
    {
      id: 'AP202403190001',
      title: '报销申请-差旅费',
      processName: '费用报销流程',
      status: 'completed',
      currentNode: '已完成',
      createTime: '2024-03-19 14:00:00',
      updateTime: '2024-03-19 16:00:00',
      progress: 100,
      approvalRecords: [
        {
          node: '发起申请',
          operator: '王五',
          action: 'approve',
          comment: '出差费用报销，共计3000元',
          time: '2024-03-19 14:00:00'
        },
        {
          node: '部门经理审批',
          operator: '李经理',
          action: 'approve',
          comment: '费用明细合理，同意报销',
          time: '2024-03-19 15:00:00'
        },
        {
          node: '财务审批',
          operator: '赵会计',
          action: 'approve',
          comment: '已核实单据，准予报销',
          time: '2024-03-19 16:00:00'
        }
      ]
    },
    {
      id: 'AP202403180001',
      title: '采购申请-办公设备',
      processName: '物品采购流程',
      status: 'rejected',
      currentNode: '已拒绝',
      createTime: '2024-03-18 09:00:00',
      updateTime: '2024-03-18 11:00:00',
      progress: 30,
      approvalRecords: [
        {
          node: '发起申请',
          operator: '李四',
          action: 'approve',
          comment: '申请采购打印机一台',
          time: '2024-03-18 09:00:00'
        },
        {
          node: '部门经理审批',
          operator: '李经理',
          action: 'reject',
          comment: '现有打印机尚可使用，暂不购置',
          time: '2024-03-18 11:00:00'
        }
      ]
    },
    {
      id: 'AP202403170001',
      title: '加班申请-项目紧急',
      processName: '加班审批流程',
      status: 'completed',
      currentNode: '已完成',
      createTime: '2024-03-17 16:00:00',
      updateTime: '2024-03-17 17:30:00',
      progress: 100,
      approvalRecords: [
        {
          node: '发起申请',
          operator: '张三',
          action: 'approve',
          comment: '项目上线，申请加班',
          time: '2024-03-17 16:00:00'
        },
        {
          node: '部门经理审批',
          operator: '李经理',
          action: 'approve',
          comment: '同意加班，注意休息',
          time: '2024-03-17 17:30:00'
        }
      ]
    }
  ];