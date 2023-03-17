package com.tns.quipu.Historia;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Historia.Trama.Trama;
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

    @DBRef
    public List<Trama> tramas = new ArrayList<>();

    public String descripcion;

    public void añadirTrama(Trama t){
        if (!(tramas.contains(t))){
        tramas.add(t);
    }else {
        System.out.println("Trama contenida");
    }
    }

    
    public void eliminarTrama(Trama t){
        if ((tramas.contains(t))){
        tramas.remove(t);
    }else {
        System.out.println("Trama no contenida");
    }
    }

}
