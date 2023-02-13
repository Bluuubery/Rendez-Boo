import { useNavigate } from 'react-router-dom'
import '../../Styles/RocketItemButtonStyle.css'
const RocketBtn_Same = (props) => {
  const navigate = useNavigate()
  const { Inquire } = props
  function edit() {
    console.log('정보 수정')
    navigate('/userinfo/' + Inquire)
  }
  function itemBox() {
    console.log('아이템 상자')
    navigate('/inventory/' + Inquire)
  }
  return (
    <div>
      <button className="RocketItemButton" onClick={edit}>
        정보 수정
      </button>
      <button className="RocketItemButton" onClick={itemBox}>
        아이템 상자
      </button>
    </div>
  )
}

export default RocketBtn_Same