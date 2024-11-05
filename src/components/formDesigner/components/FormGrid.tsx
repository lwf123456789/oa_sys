import React from 'react';
import { Row, Col } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import { FormComponent } from '../types';
import ComponentRenderer from './ComponentRenderer';

interface FormGridProps {
  component: FormComponent;
}

const FormGrid: React.FC<FormGridProps> = ({ component }) => {
  const { props, children = [], id } = component;
  const { cols = 2, gutter = 16 } = props;
  const colSpan = 24 / cols;

  // 创建空的栅格单元格
  const gridCells = Array(cols).fill(0).map((_, index) => {
    const child = children[index];
    const cellId = `${id}-cell-${index}`;

    return (
      <Col key={cellId} span={colSpan}>
        <DroppableCell id={cellId}>
          {child && <ComponentRenderer component={child} />}
        </DroppableCell>
      </Col>
    );
  });

  return (
    <div className="mb-4 p-2 border border-dashed border-gray-200 rounded">
      <Row gutter={gutter}>{gridCells}</Row>
    </div>
  );
};

// 可接收拖拽的单元格组件
interface DroppableCellProps {
  id: string;
  children?: React.ReactNode;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] p-2 rounded
        ${!children ? 'border-2 border-dashed border-gray-200' : ''}
      `}
    >
      {children || <div className="h-full flex items-center justify-center text-gray-400">拖拽组件到这里</div>}
    </div>
  );
};

export default FormGrid;