package com.tns.quipu.Historia.Trama.Escena;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

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
public class Escena {

    @DBRef
    public Usuario creador;

    @Id
    public String id;

    @NotBlank
    public String nombreEscena;

    public String descripcion;

    public String ubicacion;

    public Date fecha;

    public String musica;

    public List<Personaje> personajesInvolucrados;



    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Escena trama = (Escena) obj;
        return id.equals(trama.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
