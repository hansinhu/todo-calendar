import React from 'react';
import classNames from 'classnames';
import CalenderUtil, { TodoItem } from '@todo-calendar/core/src/index'
require('../assets/index.less')

export interface CalenderProps {
  prefixCls?: string;
  viewType?: 'month' | 'week',
  bottom?: React.ReactNode;
  maxColumnsPerRow?: number;
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
  data?: TodoItem[];
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
  const mainWidth = 614
  const layWidth = mainWidth / 7
  const layHeight = 26
  const localeWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const util = new CalenderUtil({ prefixCls, todoList: data })
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

              <div style={{ position: 'relative' }}>
                <div
                  className={`${prefixCls}-events`}
                  style={{top: '-' + (obj.bgMinHeight * layHeight + 2) + 'px'}}
                >
                  <div style={{width: 0,minHeight: (obj.bgMinHeight * layHeight) + 'px'}}></div>
                  {
                    obj.weekEventList.map((wek: any, j: number) => {
                      return <div className={`${prefixCls}-event`}
                        key={j}
                        style={{
                          width: (wek._eLen * layWidth) + 'px',
                          height: layHeight + 'px',
                          left: (wek._eX * layWidth) + 'px',
                          top: (wek._eY * layHeight) + 'px'
                        }}
                      >
                        ssss
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
          })
        }
      </div>


    </div>
  );
};

export default TodoCalenderReact;
