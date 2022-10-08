import { Button, Input, notification, Space } from 'antd'
import React, { useEffect, useReducer, useState } from 'react'
import { getError } from '../../utils'
import DataTable from '../DataTable'
import ProductActionModal from './ProductActionModal'
import { tableSettings } from './data'
import Styles from './ProductList.module.scss'
import { ModalStateTypes, ProductDataTypes, ProductFetchingAction, ProductFetchingActionKind, ProductReducerProps } from './ProductList.types'
import { useRouter } from 'next/router'
import { getToken } from '../../utils/UserManager'
const { Search } = Input;

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

    const fetchData = async () => {
        dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS })
        try {
            await fetch("/api/products")
                .then(res => res.json())
                .then(json => {
                    const manipulatedJSON = json.map((j: ProductDataTypes, i: number) => {
                        return {
                            serial: i + 1, ...j, durability: `${j?.durability}/${j?.max_durability}`
                        }
                    })
                    dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS_SUCCESS, payload: manipulatedJSON })
                })
        } catch (error: any) {
            dispatch({ type: ProductFetchingActionKind.FETCH_PRODUCTS_ERROR, payload: getError(error) || "Something went wrong" })
        }
    }

    const onSearch = (value: string) => {
        console.log({ value })
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
    }, [])

    const handleProductActionCallback = () => {
        fetchData().then(() => {
            setOpenActionModal({ open: false })
        }).finally(() => {
            notification.success({
                message: "Booking completed successfully!"
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

    return (
        <>
            <section className={Styles.products}>
                <div className="container">
                    <header className={'d-flex justify-content-between align-items-center ' + Styles.section_header}>
                        <h3 className='section-title'>Product List</h3>
                        <Space direction="horizontal">
                            <Button onClick={() => handleOpenActionModal({ open: true, type: 'book' })}>
                                Book
                            </Button>
                            <Button onClick={() => handleOpenActionModal({ open: true, type: 'return' })}>
                                Return
                            </Button>
                            <Search placeholder="Search products..." allowClear onSearch={onSearch} style={{ width: 200 }} />
                        </Space>
                    </header>
                    <div className={Styles.product_list}>
                        <DataTable settings={tableSettings} data={products} loading={loading} />
                    </div>
                </div>
            </section>

            {openActionModal?.open &&
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
