package com.tns.quipu.Personaje;

import java.math.BigInteger;
import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Usuario.Usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Document
@AllArgsConstructor
@NoArgsConstructor
public class Personaje {

	public String creador;

    @Id
    public BigInteger id;

    public String nombre;

    public String primerApellido;

    public String segundoApellido;

    public String lugarNacimiento;

    public Date fechaNacimiento;

    public String genero;

    public String altura;

    public String residencia;

    public String descripcion;

    public String urlIcon;

}
