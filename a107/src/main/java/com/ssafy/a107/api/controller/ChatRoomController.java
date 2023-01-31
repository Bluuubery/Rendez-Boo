package com.ssafy.a107.api.controller;

import com.ssafy.a107.api.service.ChatRoomServiceImpl;
import com.ssafy.a107.common.exception.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Api(value = "채팅방(친구 추가 이후) API", tags = {"ChatRoom"})
@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomServiceImpl chatRoomService;

    @GetMapping("/{userSeq}")
    @ApiOperation(value = "유저의 채팅방 정보 조회", notes = "유저의 채팅방 정보 조회")
    public ResponseEntity<?> getAllRoomByUserSeq(@PathVariable Long userSeq) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomService.getAllRoomByUserSeq(userSeq));
    }


}
