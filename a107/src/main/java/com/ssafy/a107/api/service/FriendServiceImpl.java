package com.ssafy.a107.api.service;

import com.ssafy.a107.common.exception.NotFoundException;
import com.ssafy.a107.db.entity.Friend;
import com.ssafy.a107.db.entity.User;
import com.ssafy.a107.db.repository.FriendRepository;
import com.ssafy.a107.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService{

    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    /**
     * 친구 추가
     * @param userSeq: 추가하는 유저(나)의 userSeq
     * @param otherUserSeq: 친구로 추가할 유저(상대방)의 userSeq
     */
    @Override
    public Long addFriend(Long userSeq, Long otherUserSeq) throws NotFoundException {
        Friend friend = Friend.builder()
                .user(userRepository.findById(userSeq)
                        .orElseThrow(() -> new NotFoundException("Wrong User Seq!")))
                .friend(userRepository.findById(otherUserSeq)
                        .orElseThrow(() -> new NotFoundException("Wrong User Seq!")))
                .build();

        Friend savedFriend = friendRepository.save(friend);

        return savedFriend.getSeq();
    }

    @Override
    public void deleteFriend(Long userSeq, Long otherUserSeq) {
        friendRepository.deleteByUserSeqAndFriendSeq(userSeq, otherUserSeq);
    }
}
