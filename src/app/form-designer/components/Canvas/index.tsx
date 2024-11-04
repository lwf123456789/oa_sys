import { useCallback } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import {
    DragOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    FormWidgetConfig,
    setSelectedId,
    removeWidget
} from '../../store/formDesignerSlice';
import WidgetRenderer from '@/app/form-designer/components/WidgetRenderer';
import { RootState } from '@/app/form-designer/store';
import { Icon } from '@iconify/react';

const { Content } = Layout;


// 删除按钮组件
interface DeleteButtonProps {
    onDelete: () => void;
}

const DragHandle = () => (
    <Tooltip title="拖动排序">
        <Button
            type="text"
            size="small"
            className="text-blue-600"
            icon={<DragOutlined />}
        />
    </Tooltip>
);

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => (
    <Tooltip title="删除">
        <Button
            type="text"
            size="small"
            className="text-red"
            icon={<DeleteOutlined />}
            onClick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
        />
    </Tooltip>
);

const Canvas = () => {
    const dispatch = useDispatch();
    const widgets = useSelector((state: RootState) => state.formDesigner.widgets);
    const selectedId = useSelector((state: RootState) => state.formDesigner.selectedId);

    const handleWidgetClick = useCallback((id: string) => {
        dispatch(setSelectedId(id));
    }, [dispatch]);

    const handleDeleteWidget = useCallback((id: string) => {
        dispatch(removeWidget(id));
        if (selectedId === id) {
            dispatch(setSelectedId(null));
        }
    }, [dispatch, selectedId]);

    return (
        <Content className="bg-gray-100 p-6 overflow-auto">
            <div className="bg-white min-h-[calc(100vh-120px)] rounded-lg shadow-md">
                <Droppable droppableId="CANVAS">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="p-6 min-h-[400px]"
                        >
                            {widgets.map((widget: FormWidgetConfig, index: number) => (
                                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`relative mb-3 rounded-md
                                         ${selectedId === widget.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                                         ${snapshot.isDragging ? 'bg-white shadow-lg' : ''}
                                         hover:ring-2 hover:ring-blue-400 group`}
                                            onClick={() => handleWidgetClick(widget.id)}
                                        >
                                            <div className="absolute right-2 -top-6 hidden group-hover:flex gap-2 bg-white shadow-sm rounded-md px-2 py-1 z-10">
                                                <DragHandle />
                                                <DeleteButton onDelete={() => handleDeleteWidget(widget.id)} />
                                            </div>

                                            {/* 组件内容 */}
                                            <div className="p-3">
                                                <WidgetRenderer widget={widget} />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {widgets.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-gray-400 py-20 border-2 border-dashed border-gray-200 rounded-lg">
                                    <Icon icon="mdi:drag-variant" className="text-4xl mb-2" />
                                    <span>从左侧拖拽组件到这里</span>
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </div>
        </Content>
    );
};

export default Canvas;