package com.tns.quipu.Personaje;

import java.util.Date;
import java.util.Set;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Usuario.Usuario;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
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
@EqualsAndHashCode
public class Personaje {

    @DBRef
    public Usuario creador;

    @Id
    public String id;

    @NotEmpty
	@NotBlank
    @Valid
    public String nombre;

    public String primerApellido;

    public String segundoApellido;

    public String lugarNacimiento;

    public Date fechaNacimiento;

    public String genero;
    
    @PositiveOrZero
    @Valid
    public Double altura;

    public String residencia;

    public String descripcion;

    public String urlIcon;

    //Propiedades derivdas calculadas durante el uso de PersonajeController

    private Integer numEscenas;

    private Set<Historia> historiasApariciones;


}
