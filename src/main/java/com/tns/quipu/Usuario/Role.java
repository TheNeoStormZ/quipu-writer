package com.tns.quipu.Usuario;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;


@Setter
@Getter

public class Role {

    public Role(String authority) {
        this.name=authority;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;

    private String name;
}