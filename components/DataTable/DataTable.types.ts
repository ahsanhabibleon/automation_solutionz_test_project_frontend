// import { JSXElement } from "@babel/types";

export interface TableSettingsPropTypes {
  title: string
  columns: TableColumnTypes[]
  hasRowActions?: boolean
  rowActions?: TableRowActionTypes[]
  hasAddNewBtn?: boolean
  disableAddNewBtn?: boolean
  addNewBtnTitle?: string
  addNewBtnUrl?: string
  addNewBtnEvent?: () => void
  rowActionEvent?: (action: string, record: any) => void
  isServersidePagination?: boolean
  hasBulkOperation?: boolean
  bulkActions?: TableBulkActionTypes[]
  bulkActionEvent?: (action: string, records: any) => void
}

export interface TablePropTypes {
  settings: TableSettingsPropTypes
  data: any[] | undefined | null
  loading?: boolean
  pagination?: TablePaginationTypes
  scrollX?: number
  className?: string
  topAligned?: boolean
}

export interface TableColumnTypes {
  dataIndex?: any
  title: string
  key: string
  type?:
  | 'boolean'
  | 'boolean-tag'
  | 'capitalize'
  | 'uppercase'
  | 'copyable'
  | 'date'
  | 'dateTime'
  | 'link'
  | 'tag'
  | 'color'
  | 'number'
  | 'decimal'
  | 'image'
  | 'currency'
  | 'expandable'
  | 'percentage'
  sorter?: any
  render?: (text: any, record: any) => any
  isVisible?: boolean
  fixed?: 'left' | 'right'
  alwaysVisible?: boolean
  width?: number
  ellipsis?: boolean
  editable?: boolean
  align?: 'left' | 'right' | 'center'
  // dataIndex?: number | string | null
}

export interface TableRowActionTypes {
  title: string
  // action: 'edit' | 'delete' | 'view' | 'others'
  action: string
  isDanger?: boolean
  btnType?: string
  btnIcon: JSX.Element
  btnClass?: string
  rowActionTitle?: string
}

export interface TablePaginationTypes {
  current: number
  pageSize: number
  onChange: (page: any, size: number) => void
  total: number
}

export interface TableBulkActionTypes {
  title: string
  isDanger?: boolean
  action: 'delete' | 'edit' | 'active' | 'inactive' | 'others'
  btnType: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined
  btnIcon: string
  btnName?: string
  btnClass?: string
}
