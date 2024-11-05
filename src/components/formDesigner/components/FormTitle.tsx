import React from 'react';
import { Typography } from 'antd';
import { FormComponent } from '../types';

const { Title } = Typography;

interface FormTitleProps {
    component: FormComponent;
}

const FormTitle: React.FC<FormTitleProps> = ({ component }) => {
    const { props } = component;
    const { content, level, align, style } = props;

    return (
        <Title 
            level={level} 
            style={{
                textAlign: align,
                ...style
            }}
        >
            {content}
        </Title>
    );
};

export default FormTitle;