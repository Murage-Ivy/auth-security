'use client'
import React, { useState } from 'react';
import { Form, Input, Button, Space, Select, message } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const PasswordForm = () => {
    const [form] = Form.useForm();
    const [validationStatus, setValidationStatus] = useState({
        length: null,
        characters: null,
        specialCharacters: null,
        digits: null,
    });
    const [interacted, setInteracted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    // Custom password validation rules
    const validatePassword = (rule, value, callback) => {
        const validationStatusCopy = { ...validationStatus };

        if (!value) {
            validationStatusCopy.length = interacted ? 'error' : null;
            callback(interacted ? 'Please enter a password' : '');
        } else {
            validationStatusCopy.length = 'success';
            if (value.length < 6) {
                validationStatusCopy.length = interacted ? 'error' : null;
                callback(interacted ? 'Password must be at least 6 characters' : '');
            }

            if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
                validationStatusCopy.characters = interacted ? 'error' : null;
                callback(interacted ? 'Password must contain both letters and numbers' : '');
            } else {
                validationStatusCopy.characters = 'success';
            }

            if (!/^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;,.?~_-]+$/.test(value)) {
                validationStatusCopy.specialCharacters = interacted ? 'error' : null;
                callback(
                    interacted
                        ? 'Password can only contain special characters: !@#$%^&*()_+{}[]:;,.?~_-'
                        : ''
                );
            } else {
                validationStatusCopy.specialCharacters = 'success';
            }

            if (!/\d/.test(value)) {
                validationStatusCopy.digits = interacted ? 'error' : null;
                callback(interacted ? 'Password must contain at least one digit' : '');
            } else {
                validationStatusCopy.digits = 'success';
            }
        }

        setValidationStatus(validationStatusCopy);
        callback();
    };


    // Form submit handler
    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const payload = await form.validateFields(values)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            if (!response.ok) {
                data.errors.forEach(error => {
                    return message.error(error)
                })
            }

            if (response.ok) {
                console.log(data)
                message.success("Successfully Sign up");
                router.push('/sign-in')
                form.resetFields()
            }
        }
        catch (error) {
            message.warning("Network Error")
        }
        finally {
            setLoading(false)
        }

    };

    const handleInputBlur = () => {
        // Set the interacted flag to true when the input field loses focus
        setInteracted(true);
    };

    return (
        <div className='px-4 py-4 shadow-xl shadow-around flex flex-col w-full max-w-[600px] rounded'>
            <Form
                form={form}
                name="passwordForm"
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    hasFeedback
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please enter your email',
                        },
                    ]}
                >
                    <Input
                        placeholder='Email'
                        className='w-full p-2 border-solid border-[1px] border-[#BFA89E] rounded'
                        onBlur={handleInputBlur}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    hasFeedback
                    validateStatus={
                        (interacted && validationStatus.length === 'error') ||
                            (interacted && validationStatus.characters === 'error') ||
                            (interacted && validationStatus.specialCharacters === 'error') ||
                            (interacted && validationStatus.digits === 'error')
                            ? 'error'
                            : 'success'
                    }
                    help={
                        interacted && (
                            <div>
                                <div>
                                    {validationStatus.length === 'success' ? (
                                        <Space>
                                            <CheckCircleOutlined style={{ color: 'green' }} />
                                            Password length is valid
                                        </Space>
                                    ) : (
                                        <Space>
                                            <CloseCircleOutlined style={{ color: 'red' }} />
                                            Password must be at least 6 characters
                                        </Space>
                                    )}
                                </div>
                                <div>
                                    {validationStatus.characters === 'success' ? (
                                        <Space>
                                            <CheckCircleOutlined style={{ color: 'green' }} />
                                            Password contains letters and numbers
                                        </Space>
                                    ) : (
                                        <Space>
                                            <CloseCircleOutlined style={{ color: 'red' }} />
                                            Password must contain both letters and numbers
                                        </Space>
                                    )}
                                </div>
                                <div>
                                    {validationStatus.specialCharacters === 'success' ? (
                                        <Space>
                                            <CheckCircleOutlined style={{ color: 'green' }} />
                                            Password contains valid special characters
                                        </Space>
                                    ) : (
                                        <Space>
                                            <CloseCircleOutlined style={{ color: 'red' }} />
                                            Password can only contain special characters: !@#$%^&*()_+{ }[]:;,.?~_-
                                        </Space>
                                    )}
                                </div>
                                <div>
                                    {validationStatus.digits === 'success' ? (
                                        <Space>
                                            <CheckCircleOutlined style={{ color: 'green' }} />
                                            Password contains at least one digit
                                        </Space>
                                    ) : (
                                        <Space>
                                            <CloseCircleOutlined style={{ color: 'red' }} />
                                            Password must contain at least one digit
                                        </Space>
                                    )}
                                </div>
                            </div>
                        )
                    }
                    rules={[
                        {
                            validator: validatePassword,
                        },
                    ]}
                >
                    <Input.Password
                        autoComplete='off'
                        placeholder='Password'
                        className='w-full p-2 border-solid border-[1px] border-[#BFA89E] rounded'
                        onBlur={handleInputBlur}
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password"
                    name="password_confirmation"
                    required
                    rules={[
                        { required: true, message: "Confirm Password is required" },
                        ({ getFieldValue }) => {
                            return {
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "The two passwords that you entered do not match!"
                                        )
                                    );
                                },
                            };
                        },
                    ]}
                    dependencies={["confirm"]}
                >
                    <Input.Password
                        size="large"
                        style={{ borderRadius: "5px" }}
                        placeholder="Confirm New Password"
                    />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a Category',
                        },
                    ]}
                >
                    <Select onChange={(value) => { form.setFieldsValue({ ...form.getFieldsValue(), role: value }) }} options={[
                        {
                            value: 'student',
                            Label: 'Student'
                        },
                        {
                            value: 'facilitator',
                            Label: 'Facilitator'
                        }
                    ]} />
                </Form.Item>
                <Form.Item>
                    <Button
                        className='bg-blue-900 font-bold text-center flex items-center border-[1px] justify-center w-full py-4'
                        size='large'
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        SIGN UP
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PasswordForm;
