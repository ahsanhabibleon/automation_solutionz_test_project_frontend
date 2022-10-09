import { Button, Input, notification, Select, Space } from 'antd'
import React, { useEffect, useReducer, useState } from 'react'
import { getError } from '../../utils'
import DataTable from '../DataTable'
import ProductActionModal from './ProductActionModal'
import { priceList, tableSettings } from './data'
import Styles from './ProductList.module.scss'
import { ModalStateTypes, PageQueryTypes, ProductDataTypes, ProductFetchingAction, ProductFetchingActionKind, ProductReducerProps } from './ProductList.types'
import { useRouter } from 'next/router'
import { getToken } from '../../utils/UserManager'
import axios from 'axios'
import { TablePaginationTypes } from '../DataTable/DataTable.types'
const { Search } = Input;
const { Option } = Select;

const reducer = (state: ProductReducerProps, action: ProductFetchingAction) => {
    switch (action.type) {
        case ProductFetchingActionKind.FETCH_PRODUCTS:
            return {
                ...state,
                loading: true
            }
        case ProductFetchingActionKind.FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload

            }
        case ProductFetchingActionKind.FETCH_PRODUCTS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}

const ProductList = () => {
    const router = useRouter();
    const [{ loading, error, products }, dispatch] = useReducer<(state: ProductReducerProps, action: ProductFetchingAction) => ProductReducerProps>(reducer, {
        loading: false,
        error: null,
        products: []
    })

    const [openActionModal, setOpenActionModal] = useState<ModalStateTypes>({ open: false })
    const [pageQuery, setPageQuery] = useState<PageQueryTypes>({
        page: 1,
        pageSize: 10,
        query: '',
        category: '',
        price: ''
    })
    const [productCount, setProductCount] = useState<number | null>(null)

    const fetchData = async () => {
        dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS })

        try {
            const { data } = await axios.get(`/api/products?page=${pageQuery.page}&pageSize=${pageQuery.pageSize}&query=${pageQuery.query}&category=${pageQuery.category}&price=${pageQuery.price}`)
            const manipulatedJSON = data?.products.map((j: ProductDataTypes, i: number) => {
                return {
                    serial: i + 1, ...j, durability: `${j?.durability}/${j?.max_durability}`
                }
            })
            setProductCount(data?.countProducts)
            dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS_SUCCESS, payload: manipulatedJSON })
        } catch (error: any) {
            dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS_ERROR, payload: getError(error) || "Something went wrong" })
        }
    }

    const onSearch = ({ value, type }: { value: string, type: string }) => {
        const vars = { ...pageQuery }
        if (type === 'query') {
            vars.query = value || ''
        } else if (type === 'price') {
            vars.price = value || ''
        } else {
            vars.category = value || ''
        }
        setPageQuery((prev) => {
            return {
                ...prev, ...vars
            }
        })
    };

    useEffect(() => {
        fetchData();
        const actionType = router?.query?.action_type || null;
        if (actionType) {
            setOpenActionModal({
                open: true,
                type: actionType as string
            })
        }
    }, [pageQuery])

    const handleProductActionCallback = async ({ type }: { type: string }) => {
        await fetchData().then(() => {
            setOpenActionModal({ open: false })
        }).finally(() => {
            notification.success({
                message: type === 'book' ? "Booking completed successfully!" : "Returned product successfully!"
            })
        })
    }

    const handleOpenActionModal = (val: { open: boolean, type: string }) => {
        const token = getToken()
        if (token) {
            setOpenActionModal(val)
        } else {
            notification.warning({
                message: 'Please sign in to continue.'
            })
            router.push(`/sign-in?action_type=${val?.type}`)
        }
    }

    const pagination: TablePaginationTypes = {
        current: pageQuery?.page as number,
        pageSize: pageQuery?.pageSize as number,
        onChange: (page: number, pageSize: number) => {
            setPageQuery({ ...pageQuery, page, pageSize })
        },
        total: productCount as number,
    }

    return (
        <>
            <section className={Styles.products}>
                <div className="container">
                    <header className={'d-flex justify-content-between align-items-center ' + Styles.section_header}>
                        <h3 className='section-title d-flex align-items-center' style={{ gap: 16 }}>
                            Product List
                            <Select allowClear placeholder="Search by Category" style={{ minWidth: 150, fontWeight: 'normal' }} onChange={(value) => onSearch({ value, type: 'category' })}>
                                <Option value='plain'>Plain</Option>
                                <Option value='meter'>Meter</Option>
                            </Select>
                            <Select allowClear placeholder="Search by Price Range" style={{ minWidth: 150, fontWeight: 'normal' }} onChange={(value) => onSearch({ value, type: 'price' })}>
                                {priceList.map(price => (
                                    <Option value={price?.value}>{price?.label}</Option>
                                ))}
                            </Select>
                            <Search placeholder="Search by Keyword" allowClear onSearch={(value) => onSearch({ value, type: 'query' })} style={{ width: 200 }} />

                        </h3>
                        <Space direction="horizontal">
                            <Button type='primary' onClick={() => handleOpenActionModal({ open: true, type: 'book' })}>
                                Book
                            </Button>
                            <Button onClick={() => handleOpenActionModal({ open: true, type: 'return' })}>
                                Return
                            </Button>
                        </Space>
                    </header>
                    <div className={Styles.product_list}>
                        <DataTable settings={tableSettings} data={products} loading={loading} pagination={pagination} />
                    </div>
                </div>
            </section>

            {
                openActionModal?.open &&
                <ProductActionModal
                    products={products}
                    openActionModal={openActionModal}
                    closeActionModal={() => setOpenActionModal({ open: false })}
                    handleProductActionCallback={handleProductActionCallback}
                />
            }
        </>
    )
}

export default ProductList;
