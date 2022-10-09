import React, { useEffect, useState } from 'react'
import { TableColumnTypes, TablePropTypes } from './DataTable.types'
import {
    Card,
    Pagination,
    Table,
    Tag,
} from 'antd'

const DataTable = ({
    settings,
    data,
    loading,
    pagination,
    scrollX,
    className,
    topAligned,
}: TablePropTypes) => {
    const [colSettings, setColSettings] = useState<TableColumnTypes[]>([])
    const colorPreset = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
    ]

    useEffect(() => {
        let columns = [...settings.columns]
        let pickedColumns: string[] = []
        let columnsDup: any[] = []
        columns.forEach((column) => {
            if (column.isVisible) {
                pickedColumns.push(column.key)
            }
        })

        columnsDup = [...columns]
        columns = columns.filter((col) => col.isVisible)
        setColSettings(columns)
    }, [])

    return (
        <Card>
            <Table
                size="small"
                loading={loading || false}
                dataSource={data || []}
                scroll={{ x: scrollX || 1500 }}
                className={topAligned ? className + ' top-aligned-column' : className}
                rowKey={(record) => record?.id}
                pagination={false}
            >
                {colSettings &&
                    colSettings.map((col, idx) => (
                        <>
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key + '_' + idx}
                                width={col?.width || undefined}
                                sorter={col?.sorter || undefined}
                                fixed={col?.fixed || undefined}
                                ellipsis={col?.ellipsis || undefined}
                                align={col?.align}
                                render={(value, record, index) => (
                                    <>
                                        {(() => {
                                            switch (col?.type) {
                                                case 'boolean':
                                                    return value ? 'Yes' : 'No'
                                                case 'boolean-tag':
                                                    return value ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>
                                                case 'capitalize':
                                                    return <span style={{ textTransform: 'capitalize' }}>{value}</span>
                                                case 'uppercase':
                                                    return <span style={{ textTransform: 'uppercase' }}>{value}</span>
                                                case 'number':
                                                    return value ? value : 0
                                                case 'tag':
                                                    return (
                                                        <>
                                                            {value &&
                                                                Array.isArray(value) &&
                                                                value.map((val: string, i) => {
                                                                    return (
                                                                        <Tag key={i} color={colorPreset[i]}>
                                                                            {val}
                                                                        </Tag>
                                                                    )
                                                                })}
                                                        </>
                                                    )
                                                default:
                                                    return value ? value : '--'
                                            }
                                        })()}
                                    </>
                                )}
                            />
                        </>
                    ))
                }
            </Table>
            {settings.isServersidePagination && (
                <div className='d-flex justify-content-end' style={{ marginTop: 10 }}>
                    <Pagination
                        className="text-right"
                        size="small"
                        onChange={(page: number, size: number) => pagination?.onChange(page, size)}
                        current={pagination?.current || 1}
                        style={{ marginTop: 10 }}
                        total={pagination?.total || 0}
                        showTotal={(total) => `Total ${total} items`}
                    />
                </div>
            )}
        </Card>
    )
}
export default DataTable
