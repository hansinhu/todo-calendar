export interface EventItem {
  [key: string]: any;
  title: string;
  color?: string;
  start: number | string;
  end: number | string;
  className?: string;
}

export interface UtilsConfig {
  prefixCls: string
  eventList: EventItem[];
}

class CalenderUtil {
  prefixCls = 'td-calender'
  eventList = []
  currentDay = 0
  currentYear = 0
  currentMonth = 0
  currentWeek = 0
  constructor (config: UtilsConfig) {
    this.prefixCls = config.prefixCls
    this.eventList = config.eventList
  }

  formateDate = (year: number, month: number, day: number) => {
    var y = year
    var m = month < 10 ? `0${month}` : month
    var d = day < 10 ? `0${day}` : month
    return y + '-' + m + '-' + d
  }

  tfDays = (start, end) => {
    let sTime = new Date(start).getTime()
    let eTime = new Date(end).getTime()
    let day = (eTime - sTime) / (3600 * 1000 * 24) + 1
    // 如果精确到时分，还需要调整
    // let _day = ((start, end) => {
    //   if (start.slice(0, 11) !== end && start.slice(0, 11) && (eTime - sTime) % (3600 * 1000 * 24)) {
    //     day = day + 1
    //   }
    // })()
    return day
  }

  dealDateData = (d: Date) => {
    let item: { [key: string]: any } = {}
    item.date = d.getDate()
    item.year = d.getFullYear()
    item.month = d.getMonth() + 1
    item.dateStr = this.formateDate(item.year, item.month, item.date)
    item.eventList = []
    // 异步数据
    this.eventList.forEach((n) => {
      let col = Object.assign({ row: 0 }, n)
      if (n.start === item.dateStr) {
        col.tfDays = this.tfDays(n.start, n.end)
        col.row = col.row + col.tfDays
        item.eventList.push(col)
      }
    })
    return item
  }

  weekMiddleEvent = (weekDay, start, end) => {
    let isMiddle = false
    let sTime = new Date(start).getTime()
    let eTime = new Date(end).getTime()
    let mTime = new Date(weekDay).getTime()
    if (eTime >= mTime && mTime >= sTime) {
      isMiddle = true
    }
    return isMiddle
  }

  inMiddleDay = (start, end, middle) => {
    let isMiddle = false
    let sTime = new Date(start).getTime()
    let eTime = new Date(end).getTime()
    let mTime = new Date(middle).getTime()
    if (eTime > mTime && mTime > sTime) {
      isMiddle = true
    }
    return isMiddle
  }

  getEventPoint (eX, eY, eLen) {
    let arr = []
    for (let i = 0; i < eLen; i++) {
      // Y坐标不变，X递增
      arr.push(eX + i + ',' + eY)
    }
    return arr
  }
  // 求Y坐标
  getEventY (weekIndex, len, allPoint, yI = 0) {
    let arr = []
    for (let i = weekIndex; i < len + weekIndex; i++) {
      arr.push(i + ',' + yI)
    }
    let beenY = false
    arr.forEach((n) => {
      if (allPoint.indexOf(n) !== -1) {
        beenY = true
      }
    })
    if (beenY) {
      return this.getEventY(weekIndex, len, allPoint, yI + 1)
    } else {
      return {
        yI: yI,
        pointArr: arr
      }
    }
  }

  initEventList = (weekArr) => {
    let week = []
    weekArr.forEach((n) => { // 初始化周表
      week.push(n.dateStr)
    })
    let objList = []
    let weekObj = {}
    let weekLen = {} // 用于记录当天有多少日程在进行
    let weekPoint = [] // 坐标点记录，用于计算事件坐标位置
    week.forEach((w) => {
      weekObj[w] = []
      weekLen[w] = 0
    })
    let allLen = 0
    this.eventList.forEach((ev, i) => {
      let obj = {
        _day: this.tfDays(ev.start, ev.end),
        start: ev.start,
        end: ev.end,
        data: ev,
        _eLen: 0,
        _eX: 0,
        _eY: 0,
        className: '',
      }
      let dayWeekIndex = 0
      let dayEventLen = 0
      let dayWeekYi = 0
      let className = ev.className || ''
      // 事件的Start在本周，或者本周第一天（周日）在事件中
      if (weekObj[ev.start] || this.inMiddleDay(ev.start, ev.end, week[0])) {
        if (weekObj[ev.start]) {
          dayWeekIndex = week.indexOf(ev.start)
          // weekLen[ev.start] = weekLen[ev.start] + 1
          if (dayWeekIndex + this.tfDays(ev.start, ev.end) <= week.length) {
            dayEventLen = this.tfDays(ev.start, ev.end)
            className = className + ` ${this.prefixCls}-is-start ${this.prefixCls}-is-end`
          } else {
            dayEventLen = week.length - dayWeekIndex
            className = className + ` ${this.prefixCls}-is-start`
          }
          // 如果是周的第一天，切在一个事件的中
        } else if (this.inMiddleDay(ev.start, ev.end, week[0])) {
          if (dayWeekIndex + this.tfDays(week[0], ev.end) <= week.length) {
            dayEventLen = this.tfDays(week[0], ev.end)
            className = className + ` ${this.prefixCls}-is-end`
          } else {
            dayEventLen = week.length - dayWeekIndex
            className = className + ''
          }
        }
        // 用于记录当天有多少日程在进行
        week.forEach((n) => {
          if (this.weekMiddleEvent(n, ev.start, ev.end)) {
            weekLen[n] = weekLen[n] + 1
          }
        })
        // ev._eY用于与上上周位置对齐
        dayWeekYi = ev._eY || this.getEventY(dayWeekIndex, dayEventLen, weekPoint).yI
        obj._eLen = dayEventLen // event 长度，不能超过一周（7）
        obj._eX = dayWeekIndex // 当天所在周的标（横坐标X）原点（0,0）
        obj._eY = dayWeekYi // 纵坐标Y
        obj.className = className // class名称： is-start is-end
        allLen = allLen + 1
        objList.push(obj)
        let eventPoint = this.getEventPoint(obj._eX, obj._eY, obj._eLen)
        // let eventPoint = this.getEventY(dayWeekIndex, dayEventLen, weekPoint).pointArr // 新点位放入weekPoint
        weekPoint = weekPoint.concat(eventPoint)
        this.eventList[i]._eY = obj._eY
      }
    })
    return {
      objList: objList,
      weekLen: weekLen
    }
  }

  getBgMinHeight (list: any) {
    let h = 3
    list.forEach((n) => {
      h = n._eY + 1 > h ? n._eY + 1 : h
    })
    return h
  }

  isOtherMonth (item) {
    // let d = new Date()
    if (item.month === this.currentMonth && item.year === this.currentYear) {
      return false
    } else {
      return true
    }
  }

  isToday (item) {
    let d = new Date()
    if (item.month === (d.getMonth() + 1) && item.date === d.getDate() && item.year === d.getFullYear()) {
      return true
    } else {
      return false
    }
  }

  getEachCalendar = (weekRangIndex = 0, cur?: number | string, tdate?: number | string, ) => {
    const date = cur ? new Date(cur) : new Date()
    this.currentDay = date.getDate()
    this.currentYear = date.getFullYear()
    this.currentMonth = date.getMonth() + 1
    this.currentWeek = date.getDay()
    const currentDateStr = this.formateDate(this.currentYear, this.currentMonth, this.currentDay)
  
    const tDate = tdate ? new Date(tdate) : new Date('1970-01-01')
    const tDay = tDate.getDate()
    const tYear = tDate.getFullYear()
    const tMonth = tDate.getMonth() + 1
  
    let traceDay = 35 - (this.currentWeek + 1)
  
    // 当前周
    let currentWeekIndex = 0
    
    let dayArr = []
    // 第一天以前的数据（上个月的数据）
    for (let i = this.currentWeek; i >= 0; i--) {
      let d = new Date(currentDateStr)
      d.setDate(d.getDate() - i)
      dayArr.push(this.dealDateData(d))
    }
    // 第一天及以后的日期（包括下个月）
    for (let i = 1; i <= traceDay; i++) {
      let d = new Date(currentDateStr)
      d.setDate(d.getDate() + i)
      dayArr.push(this.dealDateData(d))
    }
    // 把dayArr处理成5组
    let dayArrObj = []
    let monthDayArr = []
    let copyDayArr = dayArr.slice(0)
    let copyWeekArr = dayArr.slice(0)
    // 计算本周索引
    for (let i = 0; i < 5; i++) {
      let weekArr = copyWeekArr.splice(0, 7)
      let todyStr = this.formateDate(tYear, tMonth, tDay)
      weekArr.forEach((n, j) => {
        if (todyStr === n.dateStr) {
          currentWeekIndex = i
        }
      })
    }
    for (let i = 0; i < 5; i++) {
      let weekArr = copyDayArr.splice(0, 7)
      // 筛选出周数据
      if (i === weekRangIndex) {
        dayArrObj.push({
          dayArr: weekArr,
          weekEventList: this.initEventList(weekArr).objList,
          bgMinHeight: this.getBgMinHeight(this.initEventList(weekArr).objList),
          weekLen: this.initEventList(weekArr).weekLen
        })
      }
      // 月数据
      monthDayArr.push({
        dayArr: weekArr,
        weekEventList: this.initEventList(weekArr).objList,
        bgMinHeight: this.getBgMinHeight(this.initEventList(weekArr).objList),
        weekLen: this.initEventList(weekArr).weekLen
      })
    }
  
    return {
      week: dayArrObj,
      month: monthDayArr,
    }
  }
}

export default CalenderUtil
