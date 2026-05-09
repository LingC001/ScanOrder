import dayjs from 'dayjs'

export function useFilters() {
  function orderStatus(val) {
    if (val === true) {
      return '订单已完成'
    } else {
      return '订单未完成'
    }
  }
  function orderTime(val) {
    return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  }
  return { orderStatus, orderTime }
}
