'use client'
import { blue, } from "@ant-design/colors";
import DataDisplay from '@/components/data-display'
import { EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Tooltip, Typography, Space, List, Empty, message } from 'antd'
import React, { useContext, useState } from 'react'
import AuthContext from "@/utils/context/auth-context";
import useSWR from 'swr'

function Admin() {
    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm()
    const [vFacilitators, setVfacilitators] = useState(false)
    const [vStudents, setVstudents] = useState(false)
    const [sRequests, setSrequests] = useState([])
    const [requestId, setRequestId] = useState('')
    const token = useContext(AuthContext)



    const fetcher = (url) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())

    const { data: facilitators, error: facilitatorError, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/facilitator`, fetcher)
    const { data: students, error: studentError, isLoading: studentsLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students`, fetcher)

    const { data: requests, error, isLoading: requestLoads, mutate: getRequests } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, fetcher, {
        onSuccess: (requests) => {
            setSrequests(() => {
                return requests.map((request, index) => {
                    return {
                        ...request,
                        key: index
                    }
                })
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
            title: "",
            dataIndex: "id",
            render: (id) => {
                return <Tooltip>
                    <Button
                        type='text'
                        shape='circle'
                        icon={<EditOutlined twoToneColor={blue.primary} />}
                        onClick={() => {
                            setOpenModal(true)
                            setRequestId(id)
                        }

                        } />

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments`, {
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
            message.success('comment Sent')
            getRequests() // to update the data in the data display table
        }

        setOpenModal(false)
        form.resetFields()
    }


    return (
        <>
            <Typography.Title level={2} className="p-4 text-center">
                Admin Dashboard
            </Typography.Title>

            <Space>
                <Button onClick={() => { setVfacilitators(true) }}>
                    View Facilitators
                </Button>

                <Button onClick={() => setVstudents(true)}>
                    View Students
                </Button>
            </Space>
            <Modal
                title="Post a comment"
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
                    name='comment-form'
                    layout='vertical'
                    onFinish={(values) => {
                        console.log(values)
                        form.resetFields()
                        setOpenModal(false)
                    }}
                >
                    <Form.Item label="Comment" name="content" rules={[
                        {
                            required: true,
                            message: 'Comment Required',
                        },
                    ]}>
                        <Input.TextArea placeholder="Enter Comment" />
                    </Form.Item>
                </Form>
            </Modal >

            <Modal
                title="View Facilitators"
                open={vFacilitators}
                onCancel={() => {
                    setVfacilitators(false)
                }}
                onOk={() => {
                    setVstudents(false)
                }}
            >
                <div className=" p-3 h-screen w-full border-2 max-w-[90%] m-auto py-4">
                    <List
                        itemLayout="horizontal"
                        dataSource={facilitators}
                        loading={isLoading}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.email}
                                />
                            </List.Item>
                        )}
                    />


                </div>

            </Modal>

            <Modal
                title="View Students"
                open={vStudents}
                onCancel={() => {
                    setVstudents(false)
                }}
                onOk={() => {
                    setVstudents(false)
                }}            >
                <div className=" p-3 h-screen w-full border-2 max-w-[90%] m-auto py-4">
                    <List
                        itemLayout="vertical"
                        dataSource={students}
                        loading={studentsLoading}
                        renderItem={item => {
                            return <List.Item>
                                <List.Item.Meta
                                    title={item.email}
                                />
                            </List.Item>
                        }}
                    />
                </div>

            </Modal>
            <div className=" p-3 h-screen w-full border-2 max-w-[90%] m-auto py-4">
                <DataDisplay loading={requestLoads} columns={columns} dataSource={sRequests} expandable={{
                    expandedRowRender: (record) => {
                        return [
                            record?.feedbacks?.map(feedback => {
                                return <div key={feedback.id}>
                                    <Typography.Title level={4}>Feedback</Typography.Title>
                                    <p >{feedback.content || "No feedback"}</p>
                                </div>
                            }),
                            record?.comments?.map(comment => {
                                return <div key={comment.id}>
                                    <Typography.Title level={4}>Comment</Typography.Title>
                                    <p >{comment.content || "No comment"}</p>
                                </div>
                            })
                        ]
                    },
                    rowExpandable: (record) => true,
                }} />
            </div>

        </>)
}

export default Admin;