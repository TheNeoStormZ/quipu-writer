package com.tns.quipu.Historia;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
public class Historia {

    @DBRef
	public Usuario creador;

    @Id
    public String id;

    @NotBlank
    public String nombreHistoria;

    public List<String> generos;

    public String descripcion;


}
