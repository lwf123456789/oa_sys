import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Layout, Collapse } from 'antd';
import { Icon } from '@iconify/react';
import { widgetRegistry } from '@/components/form-widgets/registry';

const { Sider } = Layout;
const { Panel } = Collapse;

// 组件分类
const categories = {
  basic: {
    title: '基础组件',
    icon: 'mdi:puzzle'
  },
  layout: {
    title: '布局组件',
    icon: 'mdi:view-grid-plus'
  },
  advanced: {
    title: '高级组件',
    icon: 'mdi:star'
  }
};

// 按类别分组组件
const groupedWidgets = Object.entries(widgetRegistry).reduce((acc, [type, widget]:any) => {
  const category = widget.category || 'basic';
  if (!acc[category]) acc[category] = [];
  acc[category].push({ type, ...widget });
  return acc;
}, {} as Record<string, any[]>);

const ComponentPanel = () => {
  return (
    <Sider width={280} className="bg-white border-r border-gray-100">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Icon icon="mdi:tools" className="text-xl text-gray-600" />
            组件库
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Collapse defaultActiveKey={['basic']} ghost className="space-y-2">
            {Object.entries(categories).map(([key, category]) => (
              <Panel 
                header={
                  <div className="flex items-center gap-2">
                    <Icon icon={category.icon} className="text-lg text-gray-600" />
                    <span className="font-medium">{category.title}</span>
                  </div>
                }
                key={key}
                className="bg-gray-50/50 rounded-lg"
              >
                <Droppable droppableId={`COMPONENTS_${key}`} isDropDisabled={true}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="grid grid-cols-2 gap-2 p-2"
                    >
                      {(groupedWidgets[key] || []).map((widget, index) => (
                        <Draggable key={widget.type} draggableId={widget.type} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                flex flex-col items-center justify-center p-3
                                bg-white rounded-lg cursor-move
                                border border-gray-100
                                transition-all duration-200
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 ring-opacity-50' : ''}
                                hover:border-blue-400 hover:shadow-md
                                group
                              `}
                            >
                              <div className="text-2xl text-gray-500 group-hover:text-blue-500 transition-colors">
                                {widget.icon}
                              </div>
                              <span className="mt-2 text-sm text-gray-600 group-hover:text-blue-600">
                                {widget.title}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </Sider>
  );
};

export default ComponentPanel;