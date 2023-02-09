package com.tns.quipu.Personaje;

import java.math.BigInteger;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Document
public class Personaje {
    @Id
    public BigInteger id;

    public String nombre;

    public String primerApellido;

    public Personaje() {
    }

    public Personaje(String nombre, String primerApellido) {

        this.nombre = nombre;
        this.primerApellido = primerApellido;

    }

}
