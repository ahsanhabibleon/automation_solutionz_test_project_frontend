import { Button, DatePicker, Form, InputNumber, Modal, notification, Select } from 'antd'
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import React, { useRef, useState } from 'react'
import { ModalStateTypes, ProductDataTypes } from '../ProductList.types'
const { Option } = Select;
import Styles from './ProductActionModal.module.scss'


const ProductActionModal = ({ products, openActionModal, closeActionModal, handleProductActionCallback }:
    {
        products: ProductDataTypes[],
        openActionModal: ModalStateTypes,
        closeActionModal: () => void,
        handleProductActionCallback: () => void
    }
) => {

    const formRef = useRef<any>(null);

    const [confirmationStage, setConfirmationStage] = useState<boolean>(false)
    const [payload, setPayload] = useState<{
        id: string | null,
        data: ProductDataTypes | null
    }>({
        id: null,
        data: null
    })

    const [selectedProduct, setSelectedProduct] = useState<ProductDataTypes | null>(null)
    const [paymentAmount, setPaymentAmount] = useState<number | null>(null)

    const { open, type: modalType } = openActionModal;

    /* 
     case-1 (Book): list of products that has available status
     case-2 (Return): list of products that does not have available status
    */
    const listOfProducts = modalType === 'book' ? products?.filter(prod => prod.availability) : products?.filter(prod => !prod.availability)

    const resetForm = () => {
        formRef?.current?.resetFields();
    }

    const handleProductAction = async (values: any) => {
        const PRODUCT = listOfProducts?.find(prod => prod._id === values.product)

        if (!confirmationStage) {
            const payload: ProductDataTypes = {};
            if (modalType === 'book') {
                const startDate = moment(values?.booking_starts); //todays date
                const endDate = moment(values?.booking_ends); // another date
                const duration = moment.duration(endDate.diff(startDate));
                const days = Math.ceil(duration.asDays())

                const minimum_rent_period = PRODUCT?.minimum_rent_period || 0;
                const DURATION = (minimum_rent_period > days) ? minimum_rent_period : days;

                const booking_price = (PRODUCT?.price || 0) * DURATION
                const discount_rate = PRODUCT?.discount_rate || 0
                const booking_price_with_discount = booking_price - ((booking_price * discount_rate) / 100)

                if (days < minimum_rent_period) {
                    notification.error({
                        message: `Minimum rental period is ${minimum_rent_period} days!`
                    })
                } else {
                    setPaymentAmount(booking_price_with_discount)
                    payload.availability = false
                    payload.bookedOn = moment(new Date()).format('YYYY/MM/DD')
                    payload.bookedBy = {
                        name: 'Ahsan',
                        userId: ''
                    }
                    payload.bookingPeriod = {
                        start: moment(startDate).format('YYYY/MM/DD'),
                        end: moment(endDate).format('YYYY/MM/DD')
                    }

                    setConfirmationStage(true)
                }

            } else {
                const startDate = moment(PRODUCT?.bookingPeriod?.start); //todays date
                const endDate = moment(new Date()); // todays date
                const duration = moment.duration(endDate.diff(startDate));
                const days = Math.ceil(duration.asDays()) + 1

                const minimum_rent_period = PRODUCT?.minimum_rent_period || 0;
                const DURATION = (minimum_rent_period > days) ? minimum_rent_period : days;

                const booking_price = (PRODUCT?.price || 0) * DURATION
                const discount_rate = PRODUCT?.discount_rate || 0
                const booking_price_with_discount = booking_price - ((booking_price * discount_rate) / 100)
                setPaymentAmount(booking_price_with_discount)


                //payload calculations
                let durability_decrease_per_mileage = 0;
                let durability_decrease_per_day = 0;
                if (values?.mileage) {
                    durability_decrease_per_mileage = Math.ceil((values?.mileage * 2) / 10)
                }
                durability_decrease_per_day = PRODUCT?.type === 'plain' ? days : days * 2
                const DURABILITY = +`${PRODUCT?.durability}`.split('/')[0]
                const UPDATED_DURABILITY = DURABILITY - (durability_decrease_per_mileage > durability_decrease_per_day ? durability_decrease_per_mileage : durability_decrease_per_day)

                const should_repair = values?.needing_repair || (UPDATED_DURABILITY < 1000)

                payload.durability = (UPDATED_DURABILITY > -1) ? UPDATED_DURABILITY : 0
                payload.needing_repair = should_repair

                payload.availability = should_repair ? false : true
                payload.bookedOn = ''
                payload.bookedBy = {
                    name: '',
                    userId: ''
                }
                payload.bookingPeriod = {}


                setConfirmationStage(true)

            }

            setPayload({
                id: values?.product,
                data: payload
            })
        } else {
            sendPostRequest()
        }
    }

    const sendPostRequest = async () => {
        console.log({ payload })
        if (payload?.id && payload?.data) {
            try {
                await fetch(`/api/products/update/${payload?.id}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload?.data)
                })
                    .then(() => {
                        handleProductActionCallback()
                        resetForm()
                    })
                    .catch((error) => {
                        notification.error({
                            message: error?.message || 'Something went wrong!',
                        })
                    })
                    .finally(() => {
                        setConfirmationStage(false)
                    })

            } catch (error: any) {
                notification.error({
                    message: error?.message || 'Something went wrong!',
                })
            }
        }
    }

    const _closeActionModal = () => {
        closeActionModal()
        resetForm()
    }

    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today
        return current && current < moment().startOf('day');
    };

    const handleSelectedProduct = (id: string) => {
        console.log({ id })
        const selected_product = products?.find(prod => prod._id === id) || null
        setSelectedProduct(selected_product)
    }

    return (
        <Modal
            title={modalType === 'book' ? "Book a Product" : "Return a Product"}
            open={open || false}
            onCancel={_closeActionModal}
            footer={false}
        >
            <Form ref={formRef} name={modalType === 'book' ? "book-a-product" : "return-a-product"} onFinish={handleProductAction}>
                {confirmationStage ? <>
                    <div className={Styles.confirmation_msg}>
                        {modalType === 'book' ?
                            <div>Your estimated price is ${paymentAmount}.</div> :
                            <div>Your total price is ${paymentAmount}.</div>
                        }
                        <div>Do you want to proceed?</div>
                    </div>
                </> : <>
                    <Form.Item name="product" label="Product" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder="Choose Product"
                            allowClear
                            optionFilterProp="children"
                            onChange={handleSelectedProduct}
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {listOfProducts.map((prod, idx) => (
                                <Option
                                    value={prod?._id}
                                    key={prod?._id || `${prod?.name}_${idx}`}>
                                    {prod?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {modalType === 'book' ?
                        <>
                            <Form.Item name="booking_starts" label="From" rules={[{ required: true, message: 'Booking start date is required!' }]} style={{ display: 'inline-block', width: 'calc(50% - 16px)', marginRight: 16 }}>
                                <DatePicker disabledDate={disabledDate} />
                            </Form.Item>
                            <Form.Item name="booking_ends" label="To" rules={[{ required: true, message: 'Booking end date is required!' }]} style={{ display: 'inline-block', width: '50%' }}>
                                <DatePicker disabledDate={disabledDate} />
                            </Form.Item>
                        </> : <>
                            {selectedProduct?.mileage != null && <Form.Item name="used_mileage" label="Used Mileage(miles)" rules={[{ required: true, message: 'Used mileage is required!' }]} >
                                <InputNumber type='number' placeholder="Used Mileage" style={{ width: '100%' }} />
                            </Form.Item>}

                            <Form.Item name="needing_repair" label="Need To Repair?">
                                <Select
                                    placeholder="Need To Repair?"
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </Form.Item>
                        </>

                    }
                </>}

                <Form.Item className='btn-group'>
                    <Button htmlType="button" onClick={confirmationStage ? () => setConfirmationStage(false) : _closeActionModal}>
                        {confirmationStage ? 'No' : 'Cancel'}
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {confirmationStage ? 'Yes' : 'Proceed'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ProductActionModal
