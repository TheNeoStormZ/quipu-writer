package com.tns.quipu.Historia;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Usuario.Usuario;

import jakarta.validation.constraints.NotNull;
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
public class Historia {

    @DBRef
    private Usuario creador;

    @Id
    private String id;

    @NotBlank
    @NotNull
    private String nombreHistoria;

    private List<String> generos;

    @DBRef
    private List<Trama> tramas = new ArrayList<>();

    private String descripcion;

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
        return this.getTramas().stream().map(x -> x.obtenerPersonajes()).filter(Objects::nonNull).flatMap(Set::stream).collect(Collectors.toSet());
    }

    public Integer getNumPersonajes(){
        return this.obtenerPersonajes().size();
    }

}
