package com.szakdoga.numi.controller;

import com.szakdoga.numi.service.ProfileDetailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileDetailController {
    private final ProfileDetailService service;

    public ProfileDetailController(ProfileDetailService service) {
        this.service = service;
    }
    @GetMapping("/{id}/firstname")
        public String getFirstName(@PathVariable Long id){
        return service.getFirstName(id);
    }

}
