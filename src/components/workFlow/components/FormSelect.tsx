import { SelectProps } from "antd";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { $clientReq } from "@/utils/clientRequest";

const FormSelect: React.FC<SelectProps> = (props) => {
    const [forms, setForms] = useState<Array<{ id: string; name: string }>>([]);

    const fetchForms = async () => {
        const res = await $clientReq.get(`/form-templates/enabled?page=1&pageSize=10`);
        setForms(res.data.list);
    }

    useEffect(() => {
        fetchForms();
        // 模拟获取表单列表
        // setForms([
        //     { id: 'leave-form', name: '请假申请表' },
        //     { id: 'expense-form', name: '报销申请表' },
        //     { id: 'purchase-form', name: '采购申请表' },
        //     { id: 'business-trip-form', name: '出差申请表' },
        // ]);
    }, []);

    return (
        <Select
            {...props}
            options={forms.map(form => ({
                label: form.name,
                value: form.id
            }))}
        />
    );
};

export default FormSelect;