'use client'
import { blue } from "@ant-design/colors";
import DataDisplay from '@/components/data-display'
import { EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Tooltip, Typography, message } from 'antd'
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
    const [requestId, setRequestId] = useState('')

    const fetcher = (url) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())

    const { data: requests, error, isLoading: requestLoads, mutate: getRequests } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, fetcher,
        {
            onSuccess: (requests) => {
                setFrequests(() => {
                    return requests.map((request, index) => {
                        return {
                            ...request,
                            key: index
                        }
                    }).filter((request) => request.facilitator === user)
                })

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
            title: "Student",
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
            dataIndex: "id",
            render: (id) => {
                console.log(id)
                return <Tooltip>
                    <Button
                        type='text'
                        shape='circle'
                        icon={<EditOutlined twoToneColor={blue.primary} />}
                        onClick={() => {
                            setOpenModal(true)
                            setRequestId(id)
                        }} />

                </Tooltip>
            }
        },
    ]
    const handleSubmit = async (requestId) => {
        const values = await form.validateFields();
        const payload = {
            ...values,
            request_id: requestId
        }
        console.log(payload)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (response.ok) {
            console.log(data)
            setOpenModal(false)
            form.resetFields()
            message.success('Feedback Sent')
            getRequests() // to update the data in the data display table
        }

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
                    handleSubmit(requestId)
                }}
                okText="Post Feedback"
                onCancel={() => {
                    form.resetFields()
                    setOpenModal(false)
                }}
            >
                <Form
                    form={form}
                    name='feedback-form'
                    layout='vertical'
                    onFinish={(values) => {
                        console.log(values)
                        form.resetFields()
                        setOpenModal(false)
                    }}
                >
                    <Form.Item label="Feedback" name="content" rules={[
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
                <DataDisplay columns={columns} dataSource={fRequests || []} rowKey={(record) => record.id}
                    expandable={{
                        expandedRowRender: (record) => {
                            return record?.feedbacks?.map(feedback => {
                                return <p key={feedback.id}>{feedback.content || "No feedback"}</p>
                            })
                        },
                        rowExpandable: (record) => true,
                    }} />
            </div>

        </>)
}

export default Facilitator;