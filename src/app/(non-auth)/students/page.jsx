'use client'
import DataDisplay from '@/components/data-display'
import { Button, Form, Input, Select, Modal } from 'antd'
import React, { useState } from 'react'

function Student() {
    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm()
    const columns = [
        {
            title: "Request",
            dataIndex: "request",
            sorter: {
                compare: (a, b) => a.request.localeCompare(b.request),
                multiple: 2,
            },
            render: (text) => text || "-".repeat(15),
        },
        {
            title: "Facilitator",
            dataIndex: "facilitator",
            sorter: {
                compare: (a, b) => a.facilitator.localeCompare(b.facilitator),
                multiple: 2,
            },
            render: (text) => text || "-".repeat(15),
        }
    ]

    const dataSource = [
        {
            key: 1,
            request: "Request 1",
            facilitator: "Facilitator 1"
        },
        {
            key: 2,
            request: "Request 2",
            facilitator: "Facilitator 2"
        },
        {
            key: 3,
            request: "Request 3",
            facilitator: "Facilitator 3"
        },
        {
            key: 4,
            request: "Request 4",
            facilitator: "Facilitator 4"
        },


    ]

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        console.log(values);
        setOpenModal(false)
        form.resetFields()
    }

    return (
        <>
            <div className='py-4 flex items-center justify-end px-4'>
                <Button onClick={() => {
                    setOpenModal(true)
                }} type='primary '>Ask For Request</Button>
            </div>
            <Modal
                title="Ask For Request"
                open={openModal}
                onOk={() => {
                    handleSubmit()
                }}
                onCancel={() => {
                    form.resetFields()
                    setOpenModal(false)
                }}
            >
                <Form
                    form={form}
                    name='student-form'
                    layout='vertical'
                    onFinish={(values) => {
                        console.log(values)
                        form.resetFields()
                        setOpenModal(false)
                    }}
                >
                    <Form.Item label="Choose Facilitator" name="facilitator" rules={[
                        {
                            required: true,
                            message: 'Facilitator Required',
                        },
                    ]}>
                        <Select
                            placeholder="Select Facilitator"
                            style={{
                                width: '100%',
                            }}
                            onChange={(value) => { form.setFieldValue({ ...form.getFieldsValue(), facilitator: value }) }}
                            options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'Yiminghe',
                                    label: 'yiminghe',
                                },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                    disabled: true,
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Enter Request" name="request" rules={[
                        {
                            required: true,
                            message: 'Request Required',
                        },
                    ]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal >
            <DataDisplay columns={columns} dataSource={dataSource} expandable={{
                expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                rowExpandable: (record) => record.name !== 'Not Expandable',
            }} />
        </>)
}

export default Student