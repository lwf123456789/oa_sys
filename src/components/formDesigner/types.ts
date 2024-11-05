export type FormComponentType = 'input' | 'select' | 'radio' | 'checkbox' | 'timePicker' | 'datePicker' | 'grid' | 'title';

export interface FormComponent {
    id: string;
    type: FormComponentType;
    label: string;
    icon?: string;
    props: Record<string, any>;
    children?: FormComponent[];
}

export interface DragItem {
    id: string;
    type: FormComponentType;
    index: number;
}