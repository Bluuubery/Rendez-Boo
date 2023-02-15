import { useRef, useState, useEffect } from 'react'
import * as StompJs from '@stomp/stompjs'
import { SiRocketdotchat } from 'react-icons/si'
import '../../Styles/SignalSelected.css'
import DockingChatSelectedItem from './DockingChatSelectedItem'

const Docking3Chat = ({
  multiMeetingRoomSeq: multiMeetingRoomSeq,
  userSeq,
}) => {
  const client = useRef({})

  const [chatList, setChatList] = useState([])
  const [message, setMessage] = useState('')

  const connect = () => {
    // stomp js client 객체 생성
    client.current = new StompJs.Client({
      brokerURL: 'wss://i8a107.p.ssafy.io/ws-stomp',

      // 연결 확인용 출력 문구
      debug: function (str) {
        console.log(str)
      },

      // 에러 발생 시 재연결 시도 딜레이
      reconnectDelay: 3000,
      heartbeatIncoming: 2000,
      heartbeatOutgoing: 2000,

      // 연결 시
      onConnect: () => {
        console.log('success')
        if (multiMeetingRoomSeq > 0) {
          subscribe() // 메세지(채팅)을 받을 주소를 구독합니다.
        }
      },

      // 에러 발생 시 로그 출력
      onStompError: (frame) => {
        console.log(frame)
      },
    })

    // client 객체 활성화
    client.current.activate()
  }

  // subscribe: 메세지 받을 주소 구독
  const subscribe = () => {
    // 구독한 주소로 메세지 받을 시 이벤트 발생
    // (/sub: 웹소켓 공통 구독 주소), (/chat: 기능별(1:1, 3:3, 친구 추가후) 구독 주소), (/chatRoomSeq: 하위 구독 주소(채팅방))
    client.current.subscribe('/sub/multi/' + multiMeetingRoomSeq, (body) => {
      // 받아온 제이슨 파싱
      const json_body = JSON.parse(body.body)
      const flag = json_body.flag

      if (json_body.flag === 'CHAT') {
        setChatList((_chat_list) => [
          {
            senderSeq: json_body.senderSeq,
            message: json_body.message,
            createdAt: json_body.createdAt,
          },
          ..._chat_list,
        ])
      // } else if (flag === 'SYSTEM') {
      //   console.log(json_body.message)
      //   handleSystem(json_body)
      // } else if (flag === 'EXIT') {
      //   console.log(json_body.message)
      //   handleExit(json_body)
      // } else if (flag === 'PHASE1') {
      //   console.log(json_body.message)
      //   handlePhase1(json_body)
      // } else if (flag === 'PHASE2') {
      //   console.log(json_body.message)
      //   handlePhase2(json_body)
      // } else if (flag === 'PHASE3') {
      //   console.log(json_body.message)
      //   handlePhase3(json_body)
      // } else if (flag === 'FINAL') {
      //   console.log(json_body.message)
      //   handleFinal()
      }
    })
  }

  // publish: 메세지 보내기
  const publish = (message) => {
    // 연결이 안되어있을 경우
    if (!client.current.connected) {
      alert('연결 상태를 확인해주세요.')
      return
    }

    let body = JSON.stringify({
      message: message,
      multiMeetingRoomSeq: multiMeetingRoomSeq,
      userSeq: userSeq,
    })
    console.log(body)

    // 메세지를 보내기
    client.current.publish({
      // destination: 보낼 주소
      destination: '/pub/send-multi',
      // body: 보낼 메세지
      body: body,
    })

    // 보내고 메세지 초기화
    setMessage('')
  }

  // disconnect: 웹소켓 연결 끊기
  const disconnect = () => {
    console.log('연결이 끊어졌습니다.')
    client.current.deactivate()
  }

  const inputChat = (e) => {
    setMessage(e.target.value)
  }

  const sendChat = (e, message) => {
    e.preventDefault()
    if (message.trim()) publish(message)
  }

  useEffect(() => {
    connect()

    return () => disconnect()
  }, [multiMeetingRoomSeq])

  return (
    <div className={'signal-container'} style={{ height: '300px' }}>
      <div className={'signal-selected'}>
        {chatList.map((chat, index) => 
          <DockingChatSelectedItem chat={chat} key={index}/>
        )}
      </div>
      <form className={'signal-form'} onSubmit={(e) => sendChat(e, message)}>
        <input
          type={'text'}
          name={'chatInput'}
          placeholder={'메시지를 입력하세요'}
          onChange={inputChat}
          value={message}
        />
        <button type="submit">
          <SiRocketdotchat />
        </button>
      </form>
    </div>
  )
}

export default Docking3Chat