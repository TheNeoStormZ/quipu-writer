package com.tns.quipu.Historia.Trama;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

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
public class Trama {

    @DBRef
    public Usuario creador;

    @Id
    public String id;

    @NotBlank
    public String nombreTrama;

    public String descripcion;

    @DBRef
    public List<Escena> escenas = new ArrayList<>();



    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Trama trama = (Trama) obj;
        return id.equals(trama.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public void añadirEscena(Escena e) {
        if (!(escenas.contains(e))) {
            escenas.add(e);
        } else {
            System.out.println("Escena contenida");
        }
    }

    public void eliminarEscena(Escena e) {
        if ((escenas.contains(e))) {
            escenas.remove(e);
        } else {
            System.out.println("Escena no contenida");
        }
    }

    public void purgeDependencies() {
        escenas = new ArrayList<>();
    }

    public Date getFechaGlobal() {
        return escenas.stream().map(x -> x.getFecha()).filter(Objects::nonNull).min(Date::compareTo).orElse(null);
    }
    
    public Set<Personaje> obtenerPersonajes() {
        return escenas.stream().map(x -> x.getPersonajesInvolucrados()).flatMap(List::stream).filter(Objects::nonNull).collect(Collectors.toSet());
    }

    public Integer getNumPersonajes() {
        return this.obtenerPersonajes().size();
    }

}
