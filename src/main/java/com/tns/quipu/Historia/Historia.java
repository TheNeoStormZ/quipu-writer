package com.tns.quipu.Historia;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Personaje.Personaje;
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

    public void añadirTrama(Trama t) {
        if (!(tramas.contains(t))) {
            tramas.add(t);
        } else {
            System.out.println("Trama contenida");
        }
    }

    public void eliminarTrama(Trama t) {
        if ((tramas.contains(t))) {
            tramas.remove(t);
        } else {
            System.out.println("Trama no contenida");
        }
    }

    public void purgeDepedencies() {
        tramas =  new ArrayList<>();
    }

    public List<Escena> obtenerEscenas(){
        return tramas.stream().map(x -> x.getEscenas()).filter(Objects::nonNull).flatMap(List::stream).collect(Collectors.toList());
    }

    public Set<Personaje> obtenerPersonajes(){
        return this.obtenerEscenas().stream().map(x -> x.getPersonajesInvolucrados()).filter(Objects::nonNull).flatMap(List::stream).collect(Collectors.toSet());
    }

}