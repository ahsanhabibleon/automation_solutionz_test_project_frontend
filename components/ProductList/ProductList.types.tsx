export interface ProductDataTypes {
    _id?: number | string;
    code?: string
    name?: string
    type?: string
    availability?: boolean
    needing_repair?: boolean
    durability?: number
    max_durability?: number
    price?: number
    discount_rate?: number
    mileage?: number
    minimum_rent_period?: number
    bookingPeriod?: {
        start?: string
        end?: string
    }
    bookedBy?: {
        name: string
        userId: string
    }
    bookedOn?: string
}

export interface ProductReducerProps {
    loading: boolean
    error: any
    products: ProductDataTypes[]
}

export interface ProductSingleReducerProps {
    loading: boolean
    error: any
    product: ProductDataTypes | null
}

export enum ProductFetchingActionKind {
    FETCH_PRODUCTS = 'FETCH_PRODUCTS',
    FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS',
    FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR',
}

// An interface for our actions
export interface ProductFetchingAction {
    type: ProductFetchingActionKind;
    payload?: any;
}

export interface ModalStateTypes {
    open: boolean,
    type?: string | null
}
