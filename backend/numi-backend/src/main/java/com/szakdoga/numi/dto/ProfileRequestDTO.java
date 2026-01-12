package com.szakdoga.numi.dto;

import lombok.Data;

@Data
public class ProfileRequestDTO {
    private String firstName;
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String goal;
}
