import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../../../Styles/BR31Style.css'
import { IoIosIceCream } from 'react-icons/io'
const GameBr31 = (props) => {
  const {
    client,
    multiMeetingRoomSeq,
    br31MyTurnFlag,
    setBr31MyTurnFlag,
    br31Point,
  } = props
  const userSeq = useSelector((state) => state.userInfoReducer.userSeq)
  const pubBr31Point = (num) => {
    if (!client || !client.current.connected) {
      alert('연결 상태를 확인해주세요.')
      return
    }
    client.current.publish({
      destination: '/pub/br31',
      body: JSON.stringify({
        multiMeetingRoomSeq: multiMeetingRoomSeq,
        userSeq: userSeq,
        point: num,
      }),
    })
    setBr31MyTurnFlag(false)
  }

  return (
    <div>
      <div className="BR31_whole-container">
        <div className="BR31_button-discribe">
          <span
            className={
              br31MyTurnFlag
                ? 'BR31_button-discribe-text-my'
                : 'BR31_button-discribe-text-opp'
            }
          >
            `$
            {br31MyTurnFlag
              ? 'TotalPoint : ' + br31Point + '/31'
              : 'Waiting...'}
            `
          </span>
        </div>
        {br31MyTurnFlag ? (
          <div className="BR31_button-container">
            <button
              className="BR31_choose-button"
              value={1}
              onClick={(e) => pubBr31Point(e.target.value)}
            >
              <div className="multi-icecreams1">
                <IoIosIceCream className="icecream d1-1" />
              </div>
            </button>
            <button
              className="BR31_choose-button"
              value={2}
              onClick={(e) => pubBr31Point(e.target.value)}
            >
              <div className="multi-icecreams2">
                <IoIosIceCream className="icecream d2-1" />
                <IoIosIceCream className="icecream d2-2" />
              </div>
            </button>
            <button
              className="BR31_choose-button"
              value={3}
              onClick={(e) => pubBr31Point(e.target.value)}
            >
              <div className="multi-icecreams3">
                <IoIosIceCream className="icecream d3-1" />
                <IoIosIceCream className="icecream d-2" />
                <IoIosIceCream className="icecream d3-3" />
              </div>
            </button>
          </div>
        ) : (
          <div className="BR31_loader-container">
            <div className="BR31_loader-3">
              <div className="BR31_circle"></div>
              <div className="BR31_circle"></div>
              <div className="BR31_circle"></div>
              <div className="BR31_circle"></div>
              <div className="BR31_circle"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default GameBr31
