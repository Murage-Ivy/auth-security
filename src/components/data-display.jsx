"use client";
import React from "react";
import { ConfigProvider, Table, theme } from "antd";

function DataDisplay({ pagination = {}, ...props }) {


    return (
        <ConfigProvider
            theme={{
                algorithm: theme.compactAlgorithm,
            }}
        >
            <Table
                size="small"
                pagination={{
                    ...{
                        defaultPageSize: 50,
                        showSizeChanger: true,
                        pageSizeOptions: ["20", "50", "100"],
                    },
                    ...pagination,
                }}
                {...props}
            />        </ConfigProvider>
    );
}

export default DataDisplay;