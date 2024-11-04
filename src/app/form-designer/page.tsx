'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { Layout } from 'antd';
import { StoreProvider } from './providers/StoreProvider';
import ToolBar from './components/ToolBar';
import ComponentPanel from './components/ComponentPanel';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';
import { useDispatch } from 'react-redux';
import { DropResult } from '@hello-pangea/dnd';
import { addWidget, moveWidget } from './store/formDesignerSlice';
import { widgetRegistry } from '@/components/form-widgets/registry';
import { nanoid } from 'nanoid';

const FormDesignerContent = () => {
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // 从组件面板拖到画布
    if (source.droppableId.startsWith('COMPONENTS_') && destination.droppableId === 'CANVAS') {
      const widgetType = result.draggableId;
      const widgetDef = widgetRegistry[widgetType];

      const newWidget = {
        id: nanoid(),
        type: widgetType,
        label: widgetDef.title,
        field: `field_${nanoid(6)}`,
        props: { ...widgetDef.defaultProps },
        rules: []
      };

      dispatch(addWidget(newWidget));
    }

    // 画布内部排序
    if (source.droppableId === 'CANVAS' && destination.droppableId === 'CANVAS') {
      dispatch(moveWidget({
        sourceIndex: source.index,
        destinationIndex: destination.index
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Layout className="min-h-screen bg-gray-100">
        <ToolBar />
        <Layout>
          <ComponentPanel />
          <Canvas />
          <ConfigPanel />
        </Layout>
      </Layout>
    </DragDropContext>
  );
};

const FormDesigner = () => {
  return (
    <StoreProvider>
      <FormDesignerContent />
    </StoreProvider>
  );
};

export default FormDesigner;