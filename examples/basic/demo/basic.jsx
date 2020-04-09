import insertCss from 'insert-css';
import React from 'react';
import ReactDOM from 'react-dom'
import Footer from '@todo-calendar/for-react'
import Footer2 from '../../../packages/for-react/es/index'
console.log('----2', Footer, Footer2)

insertCss(`
  .custom { background: blue; }
`);


const BasicCom = () => {
  return <div
    onClick={() => { console.log(Footer) }}
    className='custom'
  >basicCom <Footer /></div>
}

ReactDOM.render(
  <BasicCom />,
  document.getElementById('container'),
  (err) => {
    console.log(err)
  }
)

