package com.ssafy.a107.api.controller;

import com.ssafy.a107.api.response.SMSRes;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@Api("SMS API")
@RestController
@RequestMapping("/api/sms")
@Slf4j
public class SMSController {

    final DefaultMessageService messageService;

    public SMSController() {
        this.messageService = NurigoApp.INSTANCE.initialize("NCSYTD4MDN2J1VU4", "P3QHU2CCZAKFXA4SK2L6IQQSHXRFTS8F", "https://api.coolsms.co.kr");
    }

    @ApiOperation(value = "사용자에게 인증번호 전송", notes = "번호는 01012345678 형태로 입력")
    @PostMapping("/send/{phoneNumber}")
    public ResponseEntity<?> sendOne(@PathVariable String phoneNumber) {

        Random rand = new Random();
        StringBuilder code = new StringBuilder();

        for(int i = 0; i < 6; i++) {
            code.append(rand.nextInt(10));
        }

        Message message = new Message();
        message.setFrom("01099065910");
        message.setTo(phoneNumber);
        message.setText("[RendezBoo] 인증번호는 " + code + "입니다.");

        SingleMessageSentResponse res = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        log.debug("response: {}", res);

        return ResponseEntity.status(HttpStatus.OK).body(new SMSRes(phoneNumber, code.toString()));
    }
}