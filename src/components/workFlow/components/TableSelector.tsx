// 表格选择器组件
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Table, Input } from 'antd';
import type { TableProps } from 'antd';

interface TableSelectorProps<T> {
    loading: boolean;
    visible: boolean;
    title: string;
    onCancel: () => void;
    onOk: (selectedRows: T[]) => void;
    tableProps: Omit<TableProps<T>, 'rowSelection'>;
    multiple?: boolean;
    onSearch?: (searchText: string) => void;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    defaultSelectedRows?: T[]; // 默认选中的数据
}

const TableSelector = <T extends object>({
    loading = true,
    visible,
    title,
    onCancel,
    onOk,
    tableProps,
    multiple = false,
    onSearch,
    pagination,
    defaultSelectedRows = []
}: TableSelectorProps<T>) => {
    // 使用 useRef 存储上一次的选择状态
    const prevSelectedRowsRef = useRef<T[]>([]);
    const [selectedRows, setSelectedRows] = useState<T[]>(defaultSelectedRows);

    // 使用 useMemo 缓存当前页面的 ID 映射
    const currentPageIdsMap = useMemo(() => {
        const map = new Map();
        (tableProps.dataSource as T[]).forEach((item: any) => {
            map.set(item.id, item);
        });
        return map;
    }, [tableProps.dataSource]);

    // 优化选择处理函数
    const handleSelect = useCallback((selectedKeys: React.Key[], currentSelectedRows: T[]) => {
        if (multiple) {
            setSelectedRows(prev => {
                // 创建一个 Map 来存储当前页面的选中项
                const currentPageSelectedMap = new Map(
                    currentSelectedRows.map(row => [(row as any).id, row])
                );

                // 保留不在当前页面的已选择项
                const otherPagesSelectedRows = prev.filter(
                    row => !currentPageIdsMap.has((row as any).id) || currentPageSelectedMap.has((row as any).id)
                );

                // 添加当前页面新选中的项
                const newSelectedRows = [...otherPagesSelectedRows];
                currentSelectedRows.forEach(row => {
                    if (!newSelectedRows.find(r => (r as any).id === (row as any).id)) {
                        newSelectedRows.push(row);
                    }
                });

                return newSelectedRows;
            });
        } else {
            setSelectedRows(currentSelectedRows);
        }
    }, [multiple, currentPageIdsMap]);

    // 记忆化表格配置
    const tableConfig = useMemo(() => ({
        ...tableProps,
        loading,
        rowKey: "id" as const,
        rowSelection: {
            type: multiple ? ('checkbox' as const) : ('radio' as const),
            onChange: handleSelect,
            selectedRowKeys: selectedRows.map((row: any) => row.id),
            preserveSelectedRowKeys: true
        },
        pagination,
        scroll: { y: 400 }
    }), [tableProps, loading, multiple, handleSelect, selectedRows, pagination]);

    useEffect(() => {
        if (visible) {
            prevSelectedRowsRef.current = defaultSelectedRows;
            setSelectedRows(defaultSelectedRows);
        }
    }, [visible, defaultSelectedRows]);

    const handleSearch = useCallback((value: string) => {
        onSearch?.(value);
    }, [onSearch]);

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            width={800}
            onOk={() => onOk(selectedRows)}
            okButtonProps={{ disabled: selectedRows.length === 0 }}
        >
            <div className="mb-4">
                <Input.Search
                    placeholder="搜索..."
                    onSearch={handleSearch}
                    allowClear
                />
            </div>
            <Table {...tableConfig} />
        </Modal>
    );
};

export default React.memo(TableSelector);