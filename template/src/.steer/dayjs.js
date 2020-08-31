import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekday from 'dayjs/plugin/weekday'
import weekYear from 'dayjs/plugin/weekYear'
import isMoment from 'dayjs/plugin/isMoment'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(weekYear)
dayjs.extend(isMoment)
dayjs.extend(localeData)
dayjs.extend(localizedFormat)

const localeMap = {
  en_GB: 'en-gb',
  en_US: 'en',
  zh_CN: 'zh-cn',
  zh_TW: 'zh-tw',
}

function parseLocale(locale) {
  const mapLocale = localeMap[locale]
  return mapLocale || locale.split('_')[0]
}

dayjs.extend(function (option, dayjsClass, dayjsFactory) {
  const oldLocale = dayjsClass.prototype.locale
  dayjsClass.prototype.locale = function (arg) {
    if (typeof arg === 'string') {
      arg = parseLocale(arg)
    }
    return oldLocale.call(this, arg)
  }
})
