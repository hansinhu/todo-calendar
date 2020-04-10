import React from 'react';
import classNames from 'classnames';
import CalenderUtil from '@todo-calendar/core'
require('../assets/index.less')

export interface CalenderProps {
  prefixCls?: string;
  viewType?: 'month' | 'week',
  bottom?: React.ReactNode;
  maxColumnsPerRow?: number;
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
  data?: any[];
}

const TodoCalenderReact: React.FC<CalenderProps> = ({
  prefixCls = 'td-calender',
  viewType = 'month',
  className,
  style,
  bottom,
  maxColumnsPerRow,
  theme = 'light',
  data = [],
  ...restProps
}) => {
  const mainWidth = 1160
  const layWidth = mainWidth / 7
  const layHeight = 26
  const localeWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const util = new CalenderUtil({ prefixCls, eventList: data })
  const days = util.getEachCalendar(0)[viewType]
  console.log('----result----', days)
  const addNewEvent = (day: any) => {
    console.log('TODO:addNewEvent')
  }
  const overTips = (e: any, day: any) => {
    console.log('TODO:overTips')
  }
  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-weeks`}>
        {
          localeWeeks.map(week => <span
            className={`${prefixCls}-week`}
            key={week}
          >{week}</span>)
        }
      </div>
      <div className={`${prefixCls}-container`}>
        {
          days.map((obj: any, i: number) => {
            return <div key={i}>
              <ul className={`${prefixCls}-events-bg`}>
                {
                  obj.dayArr.map((day: any, n: number) => {
                    return <li
                      key={n}
                      className={
                        classNames(
                          `${prefixCls}-bg-cell`,
                          {
                            [`${prefixCls}-bg-cell`]: util.isOtherMonth(day),
                          }
                        )
                      }
                      onMouseMove={(e: any) => { overTips(e, obj) }}
                      onClick={() => { addNewEvent(day) }}
                      style={{
                        minHeight: (obj.bgMinHeight * layHeight + 45 + 2) + 'px'
                      }}
                      >
                      <div
                        className={
                          classNames(
                            `${prefixCls}-cell-day`,
                            {
                              [`${prefixCls}-other-m`]: util.isOtherMonth(day),
                            }
                          )
                        }
                      >
                        <span
                          className={
                            classNames(
                              `${prefixCls}-cell-day-d`,
                              {
                                [`${prefixCls}-today`]: util.isOtherMonth(day),
                              }
                            )
                          }
                        >{ day.date }</span>
                      </div>
                    </li>

                  })
                }
              </ul>
            </div>
          })
        }

      </div>

    </div>
  );
};

export default TodoCalenderReact;
