import { TableSettingsPropTypes } from "../DataTable/DataTable.types"

export const tableSettings: TableSettingsPropTypes = {
    title: 'Product Table',
    isServersidePagination: true,
    columns: [
        {
            title: 'Serial',
            key: 'serial',
            isVisible: true,
            alwaysVisible: false,
            sorter: (a: any, b: any) => a.serial - b.serial,
            width: 80,
        },
        {
            title: 'Name',
            key: 'name',
            isVisible: true,
            alwaysVisible: false,
            sorter: (a: any, b: any) => a.name - b.name,
            width: 150,
        },
        {
            title: 'Code',
            key: 'code',
            isVisible: true,
            alwaysVisible: false,
            width: 80,
        },
        {
            title: 'Price (per day)',
            key: 'price',
            isVisible: true,
            alwaysVisible: false,
            width: 120,
            sorter: (a: any, b: any) => a.price - b.price,
        },
        {
            title: 'Minimum Rent Period(days)',
            key: 'minimum_rent_period',
            isVisible: true,
            alwaysVisible: false,
            width: 150,
            sorter: (a: any, b: any) => a.minimum_rent_period - b.minimum_rent_period,
        },
        {
            title: 'Availability',
            key: 'availability',
            type: 'boolean-tag',
            isVisible: true,
            alwaysVisible: false,
            width: 80,
        },
        {
            title: 'Need to Repair',
            key: 'needing_repair',
            type: 'boolean',
            isVisible: true,
            alwaysVisible: false,
            width: 120,
        },
        {
            title: 'Durability',
            key: 'durability',
            type: 'number',
            isVisible: true,
            alwaysVisible: false,
            sorter: (a: any, b: any) => a.durability - b.durability,
            width: 120,
        },
        {
            title: 'Mileage',
            key: 'mileage',
            type: 'number',
            isVisible: true,
            alwaysVisible: false,
            sorter: (a: any, b: any) => a.mileage - b.mileage,
            width: 140,
        },
    ]
}

export const priceList = [
    {
        label: '$1 to $1000',
        value: '1-1000'
    },
    {
        label: '$1001 to $5000',
        value: '1001-5000'
    },
    {
        label: '$5001 to $10,000',
        value: '5001-10000'
    },
    {
        label: '$10,001 to $20,000',
        value: '10001-20000'
    },
]