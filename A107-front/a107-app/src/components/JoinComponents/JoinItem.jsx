import { useState } from 'react'
import JoinItem2nd from './JoinItem2nd'
import JoinItem3rd from './JoinItem3rd'
import JoinItem4rd from './JoinItem4rd'

const JoinItem = () => {
  const setNext = () => {
    if (order === 4) {
      window.location.href = '/'
    } else {
      setOrder(order + 1)
    }
  }
  const ItemList = [
    '',
    '',
    <JoinItem2nd setNext={setNext} />,
    <JoinItem3rd setNext={setNext} />,
    <JoinItem4rd setNext={setNext} />,
  ]
  const [order, setOrder] = useState(2, '')
  return (
    <div>
      <div>
        <div>{ItemList[order]}</div>
      </div>
    </div>
  )
}

export default JoinItem