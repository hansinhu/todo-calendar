export interface TodoItem {
  [key: string]: any;
  title: string;
  color?: string;
  start: number | string;
  end: number | string;
  className?: string;
}

export interface UtilsConfig {
  prefixCls: string
  todoList: TodoItem[];
}

class CalenderUtil {
  prefixCls = 'td-calender'
  todoList = []
  cuDay = 0
  cuYear = 0
  cuMonth = 0
  cuWeek = 0
  // today
  tdDay = 0
  tdYear = 0
  tdMonth = 0
  tdDateStr = ''

  constructor (config: UtilsConfig) {
    this.prefixCls = config.prefixCls
    this.todoList = config.todoList
    // 今天
    const tDate = new Date()
    this.tdDay = tDate.getDate()
    this.tdYear = tDate.getFullYear()
    this.tdMonth = tDate.getMonth() + 1
    this.tdDateStr = this.formateDate(this.tdYear, this.tdMonth, this.tdDay)
  }

  formateDate = (year: number, month: number, day: number) => {
    var y = year
    var m = `${month}`.padStart(2, '00')
    var d = `${day}`.padStart(2, '00')
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
    item.todoList = []
    // 异步数据
    this.todoList.forEach((n) => {
      let col = Object.assign({ row: 0 }, n)
      if (n.start === item.dateStr) {
        col.tfDays = this.tfDays(n.start, n.end)
        col.row = col.row + col.tfDays
        item.todoList.push(col)
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
    console.log('weekArr:', weekArr, this.todoList)
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
    console.log(weekObj)
    this.todoList.forEach((data, i) => {
      let obj = Object.assign({
        _day: this.tfDays(data.start, data.end),
        _eLen: 0,
        _eX: 0,
        _eY: 0,
        className: '',
      }, data)
      let dayWeekIndex = 0
      let dayEventLen = 0
      let dayWeekYi = 0
      let className = data.className || ''
      // 事件的Start在本周，或者本周第一天（周日）在事件中
      if (weekObj[data.start] || this.inMiddleDay(data.start, data.end, week[0])) {
        if (weekObj[data.start]) {
          dayWeekIndex = week.indexOf(data.start)
          // weekLen[data.start] = weekLen[data.start] + 1
          if (dayWeekIndex + this.tfDays(data.start, data.end) <= week.length) {
            dayEventLen = this.tfDays(data.start, data.end)
            className = className + ` ${this.prefixCls}-is-start ${this.prefixCls}-is-end`
          } else {
            dayEventLen = week.length - dayWeekIndex
            className = className + ` ${this.prefixCls}-is-start`
          }
          // 如果是周的第一天，切在一个事件的中
        } else if (this.inMiddleDay(data.start, data.end, week[0])) {
          if (dayWeekIndex + this.tfDays(week[0], data.end) <= week.length) {
            dayEventLen = this.tfDays(week[0], data.end)
            className = className + ` ${this.prefixCls}-is-end`
          } else {
            dayEventLen = week.length - dayWeekIndex
            className = className + ''
          }
        }
        // 用于记录当天有多少日程在进行
        week.forEach((n) => {
          if (this.weekMiddleEvent(n, data.start, data.end)) {
            weekLen[n] = weekLen[n] + 1
          }
        })
        // data._eY用于与上上周位置对齐
        dayWeekYi = data._eY || this.getEventY(dayWeekIndex, dayEventLen, weekPoint).yI
        obj._eLen = dayEventLen // event 长度，不能超过一周（7）
        obj._eX = dayWeekIndex // 当天所在周的标（横坐标X）原点（0,0）
        obj._eY = dayWeekYi // 纵坐标Y
        obj.className = className // class名称： is-start is-end
        allLen = allLen + 1
        objList.push(obj)
        let eventPoint = this.getEventPoint(obj._eX, obj._eY, obj._eLen)
        // let eventPoint = this.getEventY(dayWeekIndex, dayEventLen, weekPoint).pointArr // 新点位放入weekPoint
        weekPoint = weekPoint.concat(eventPoint)
        // data._eY用于与上上周位置对齐
        this.todoList[i]._eY = obj._eY
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
    if (item.month === this.cuMonth && item.year === this.cuYear) {
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

  getEachCalendar = (weekRangIndex = 0, cur?: number | string) => {
    const date = cur ? new Date(cur) : new Date()
    this.cuDay = date.getDate()
    this.cuYear = date.getFullYear()
    this.cuMonth = date.getMonth() + 1
    this.cuWeek = date.getDay()
    const currentDateStr = this.formateDate(this.cuYear, this.cuMonth, this.cuDay)
  
    let traceDay = 35 - (this.cuWeek + 1)
  
    // 当前周
    let cuWeekIndex = 0
    
    let dayArr = []
    // 第一天以前的数据（上个月的数据）
    for (let i = this.cuWeek; i >= 0; i--) {
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
      weekArr.forEach((n, j) => {
        if (this.tdDateStr === n.dateStr) {
          cuWeekIndex = i
        }
      })
    }
    for (let i = 0; i < 5; i++) {
      let weekArr = copyDayArr.splice(0, 7)
      const { objList, weekLen } = this.initEventList(weekArr)
      // 筛选出周数据
      if (i === weekRangIndex) {
        dayArrObj.push({
          dayArr: weekArr,
          weekEventList: objList,
          bgMinHeight: this.getBgMinHeight(objList),
          weekLen: weekLen,
        })
      }
      // 月数据
      monthDayArr.push({
        dayArr: weekArr,
        weekEventList: objList,
        bgMinHeight: this.getBgMinHeight(objList),
        weekLen: weekLen,
      })
    }
  
    return {
      week: dayArrObj,
      month: monthDayArr,
    }
  }
}

export default CalenderUtil
