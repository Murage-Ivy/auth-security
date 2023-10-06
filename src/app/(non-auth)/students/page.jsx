'use client'
import DataDisplay from '@/components/data-display'
import AuthContext from '@/utils/context/auth-context'
import UserContext from '@/utils/context/user-context'
import { Button, Form, Input, Select, Modal, message } from 'antd'
import React, { useContext, useState } from 'react'
import useSWR from 'swr'


function Student() {
    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm()
    const token = useContext(AuthContext)
    const [sRequests, setSResquests] = useState([])
    const user = useContext(UserContext)




    const fetcher = (url) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())

    const { data, error: facilitatorError, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/facilitator`, fetcher)
    const { data: requests, error, isLoading: requestLoads, mutate: getRequests } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, fetcher, {
        onSuccess: (requests) => {
            setSResquests(() => {
                return requests.map((request, index) => {
                    return {
                        ...request,
                        key: index
                    }
                }).filter((request) => request.user?.email === user)
            })
        },
    })

    console.log(requests)
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
            render: (facilitator) => {
                return facilitator || "-".repeat(15)
            },
        }
    ]



    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            })
            const data = await response.json()

            if (response.ok) {
                console.log(data)
                setOpenModal(false)
                form.resetFields()
                message.success('Request Sent')
                getRequests() // to update the data in the data display table
            }
            if (!response.ok) {
                data?.errors?.map(error => message.error(error))

            }
        }
        catch (error) {
            message.error(error.message)
        }



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
                    <Form.Item label="Choose Facilitator" name="facilitator_id" rules={[
                        {
                            required: true,
                            message: 'Facilitator Required',
                        },
                    ]}>
                        <Select
                            loading={isLoading}
                            placeholder="Select Facilitator"
                            style={{
                                width: '100%',
                            }}
                            onChange={(value) => { form.setFieldValue({ ...form.getFieldsValue(), facilitator_id: value }) }}
                            options={data?.map(facilitator => {
                                return {
                                    label: facilitator?.email,
                                    value: facilitator?.id
                                }
                            }) || []}
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
            <DataDisplay columns={columns} dataSource={sRequests || []} expandable={{
                expandedRowRender: (record) => {
                    return record?.feedbacks?.map(feedback => {
                        return <p key={feedback.id}><strong>Feedback:
                        </strong>{feedback.content || "No feedback"}</p>
                    })
                },
                rowExpandable: (record) => true,
            }} />
        </>)
}

export default Student