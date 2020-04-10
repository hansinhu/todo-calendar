import insertCss from 'insert-css';
import React from 'react';
import ReactDOM from 'react-dom'
import TodoCalender from '@todo-calendar/for-react'
import eventList from '../../mock-data/events'

insertCss(`
  .custom { background: #fff; }
`);


const BasicCom = () => {
  return <div
    onClick={() => { console.log(window.forReact) }}
    className='custom'
  ><TodoCalender data={eventList} /></div>
}

ReactDOM.render(
  <BasicCom />,
  document.getElementById('container'),
  (err) => {
    console.log(err)
  }
)

