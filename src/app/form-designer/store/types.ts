import { FormWidgetConfig } from './formDesignerSlice';

export interface FormDesignerState {
  widgets: FormWidgetConfig[];
  selectedId: string | null;
  history: {
    past: FormWidgetConfig[][];
    future: FormWidgetConfig[][];
  };
}

export interface RootState {
  formDesigner: FormDesignerState;
}