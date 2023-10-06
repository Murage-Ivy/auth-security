'use client'
import { red, blue, purple, magenta, volcano } from "@ant-design/colors";
import DataDisplay from '@/components/data-display'
import { EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Modal, Tooltip, Typography } from 'antd'
import React, { useContext, useState } from 'react'
import useSWR from 'swr'
import UserContext from "@/utils/context/user-context";
import AuthContext from "@/utils/context/auth-context";

function Facilitator() {
    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm()
    const user = useContext(UserContext)
    const token = useContext(AuthContext)
    const [fRequests, setFrequests] = useState([])
    console.log(user)

    const fetcher = (url) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())

    const { data: requests, error, isLoading: requestLoads, mutate: getRequests } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, fetcher,
        {
            onSuccess: (data) => {
                console.log(data)
                setFrequests(data.filter((request) => request.facilitator === user))
            }
        })


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
            title: "Request",
            dataIndex: "user",
            sorter: {
                compare: (a, b) => a.request.localeCompare(b.request),
                multiple: 2,
            },
            render: (user) => {
                return user?.email || "-".repeat(15)

            }
        },

        {
            title: "",
            dataIndex: "request",
            render: (text) => {
                return <Tooltip>
                    <Button
                        type='text'
                        shape='circle'
                        icon={<EditOutlined twoToneColor={blue.primary} />}
                        onClick={() => setOpenModal(true)} />

                </Tooltip>
            }
        },
    ]

    const dataSource = [
        {
            key: 1,
            request: "Request 1",
            student: "Student 1"
        },
        {
            key: 2,
            request: "Request 2",
            student: "Student 2"
        },
        {
            key: 3,
            request: "Request 3",
            student: "Student 3"
        },
        {
            key: 4,
            request: "Request 4",
            student: "Student 4"
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
            <Typography.Title level={2} className="p-4 text-center">
                Facilitator    Dashboard
            </Typography.Title>
            <Modal
                title="Ask For Request"
                open={openModal}
                onOk={() => {
                    handleSubmit()
                }}
                okText="Post Feedback"
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
                    <Form.Item label="Feedback" name="request" rules={[
                        {
                            required: true,
                            message: 'Request Required',
                        },
                    ]}>
                        <Input.TextArea placeholder="Enter Feedback" />
                    </Form.Item>
                </Form>
            </Modal >
            <div className=" p-3 h-screen w-full border-2 max-w-[90%] m-auto py-4">
                <DataDisplay columns={columns} dataSource={fRequests || []} expandable={{
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }} />
            </div>

        </>)
}

export default Facilitator;