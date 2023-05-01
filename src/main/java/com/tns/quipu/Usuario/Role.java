package com.tns.quipu.Usuario;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;


@Setter
@Getter

public class Role {
    
    @JsonCreator
    public Role(@JsonProperty("rol") String authority) {
        this.name=authority;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;

    private String name;
}