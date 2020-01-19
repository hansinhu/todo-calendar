import React from 'react'

interface ReactTodoCalendarProps {
  name: string;
}

export const ReactTodoCalendar: React.FC<ReactTodoCalendarProps> = ({
  name,
}) => {
  return <div>ReactTodoCalendar {name}</div>
}
