package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.DeleteAccountRequestDTO;
import com.szakdoga.numi.dto.PasswordChangeRequestDTO;
import com.szakdoga.numi.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    private final AccountService accountService;

    // PATCH http://localhost:8080/api/account/DANIKA/password
    // body: { "currentPassword": "régi", "newPassword": "új" }
    @PatchMapping("/{username}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable String username,
            @RequestBody PasswordChangeRequestDTO request
    ) {
        accountService.changePassword(username, request);
        return ResponseEntity.noContent().build();
    }

    // DELETE http://localhost:8080/api/account/DANIKA
    // body: { "password": "jelszó" }
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable String username,
            @RequestBody DeleteAccountRequestDTO request
    ) {
        accountService.deleteAccount(username, request);
        return ResponseEntity.noContent().build();
    }
}