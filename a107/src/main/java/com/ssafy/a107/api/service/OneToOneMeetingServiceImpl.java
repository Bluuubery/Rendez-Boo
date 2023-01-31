package com.ssafy.a107.api.service;

import com.ssafy.a107.api.response.MeetingRoomRes;
import com.ssafy.a107.common.exception.NotFoundException;
import com.ssafy.a107.db.entity.OnetoOneMeetingRoom;
import com.ssafy.a107.db.entity.User;
import com.ssafy.a107.db.repository.OneToOneMeetingRoomRepository;
import com.ssafy.a107.db.repository.UserRepository;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OneToOneMeetingServiceImpl implements OneToOneMeetingService {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openVidu;

    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @Autowired
    OneToOneMeetingRoomRepository oneToOneMeetingRoomRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public MeetingRoomRes joinMatch(Long userSeq) throws NotFoundException, OpenViduJavaClientException, OpenViduHttpException {
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new NotFoundException("Wrong User Seq!"));
        OnetoOneMeetingRoom onetoOneMeetingRoom = null;
        List<OnetoOneMeetingRoom> list = null;
        Session session = null;
        // 남자가 1=true 여자가 0=false
        if (user.getGender()) {
            list = oneToOneMeetingRoomRepository.getOnetoOneMeetingRoomsByManSeqIsNullAndStatus((byte) 0);
        } else {
            list = oneToOneMeetingRoomRepository.getOnetoOneMeetingRoomsByWomanSeqIsNullAndStatus((byte) 0);
        }
        if (!list.isEmpty()) {
            // 리스트가 있으면 첫번째 세션 가져옴
            onetoOneMeetingRoom = list.get(0);
            session = openVidu.getActiveSession(onetoOneMeetingRoom.getSessionId());
            onetoOneMeetingRoom.changeStatus((byte) 1);

        } else {
            // 리스트 없으면 세션 생성
            Map<String, Object> params = Map.of("customSessionId", Long.toString(System.currentTimeMillis()));
            SessionProperties properties = SessionProperties.fromJson(params).build();
            session = openVidu.createSession(properties);
            onetoOneMeetingRoom = new OnetoOneMeetingRoom();
            onetoOneMeetingRoom.createSession(session.getSessionId());
        }
        // 세션에 성별 기준으로 유저 추가
        if (user.getGender()) {
            onetoOneMeetingRoom.addMan(userSeq);
        } else {
            onetoOneMeetingRoom.addWoman(userSeq);
        }
        log.debug(onetoOneMeetingRoom.toString());
        oneToOneMeetingRoomRepository.save(onetoOneMeetingRoom);
        // 검사
        if (session == null) {
            throw new NotFoundException("Wrong Session");
        }
        // 커넥션용 토큰 생성
        ConnectionProperties connectionProperties = ConnectionProperties.fromJson(Map.of()).build();
        Connection connection = session.createConnection(connectionProperties);
        String token = connection.getToken();
        return new MeetingRoomRes(session.getSessionId(), token);
    }
}