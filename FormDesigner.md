# 表单设计器组件与工作流组件说明文档

## 依赖
    "@dnd-kit/core": "^6.1.0",// 核心库
    "@dnd-kit/modifiers": "^7.0.0",// 修饰器
    "@dnd-kit/sortable": "^8.0.0",// 排序功能支持
    "@dnd-kit/utilities": "^3.2.2",// 工具函数
    "zustand": "^4.5.2",// 轻量级状态管理,用于表单配置
    "immer": "^10.0.4",// 不可变数据处理
    "@monaco-editor/react": "^4.6.0",// 代码编辑器
    "reactflow": "^11.11.4",// 工作流

## 目录结构
src/
  components/
    formDesigner/
      components/        # 所有组件的配置和封装
        ComponentRenderer.tsx  # 组件渲染器，负责根据类型渲染对应的表单组件
        FormGrid.tsx          # 栅格布局组件，支持多列布局和嵌套
        Toolbar.tsx           # 顶部工具栏，包含预览、导出、清空等功能
        FormPreview.tsx       # 表单预览组件
        JsonVisualizer.tsx     # JSON可视化组件
        PreviewModal.tsx       # 预览弹窗（放置JSON数据预览）
        SaveTemplateModal.tsx # 保存模板弹窗
        properties/           # 各类组件的属性配置面板
          BaseProperties.tsx    # 基础属性配置（如标签、布局等）
          InputProperties.tsx   # 输入框属性配置
          SelectProperties.tsx  # 下拉选择属性配置
          RadioProperties.tsx   # 单选框属性配置
          CheckboxProperties.tsx # 复选框属性配置
          TimePickerProperties.tsx # 时间选择器属性配置
          DatePickerProperties.tsx # 日期选择器属性配置
          GridProperties.tsx    # 栅格布局属性配置
          TitleProperties.tsx   # 标题属性配置
      config/           # 组件配置
        componentConfig.ts    # 组件基础配置，包含默认属性和图标等
      hooks/           # 自定义hooks
      store/           # 状态管理
        useDesignerStore.ts   # 设计器状态管理，基于 zustand
      ComponentList.tsx # 左侧组件列表，展示可拖拽的组件
      DesignCanvas.tsx # 中间画布，接收拖拽组件并展示
      PropertyPanel.tsx # 右侧属性面板，配置选中组件的属性
      FormDesigner.tsx # 入口主组件，整合所有功能
      FormManageMent.tsx # 表单数据管理
      types.ts         # 类型定义文件
    
    workFlow/

## 核心组件说明

### FormDesigner
主容器组件，负责：
- 集成 DndContext 提供拖拽功能
- 布局管理
- 组件间通信协调

### ComponentList
左侧组件列表，功能包括：
- 展示可用的表单组件
- 提供拖拽源
- 组件分类展示

### DesignCanvas
中间画布区域，负责：
- 接收拖拽的组件
- 管理组件布局
- 组件选中状态
- 支持栅格嵌套

### PropertyPanel
右侧属性面板，提供：
- 组件属性配置界面
- 实时属性更新
- 多种配置选项

### Toolbar
顶部工具栏，功能包括：
- 预览表单配置
- 导出配置文件
- 清空画布
- 其他工具按钮

## 状态管理
使用 zustand 进行状态管理，主要管理：
- 画布中的组件列表
- 当前选中的组件
- 组件属性更新
- 配置的导入导出

## 拖拽实现
基于 @dnd-kit 实现拖拽功能：
- 组件从列表到画布的拖拽
- 画布内组件位置调整
- 栅格布局的单元格拖拽

## 组件属性配置
每个组件都支持：
- 基础属性（标签、布局等）
- 组件特有属性
- 校验规则配置
- 样式配置
