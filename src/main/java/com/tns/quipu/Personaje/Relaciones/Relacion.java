package com.tns.quipu.Personaje.Relaciones;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotEmpty;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Usuario.Usuario;

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
public class Relacion {

    @DBRef
    private Usuario creador;

    @Id
    private String id;

    @DBRef
    @NotEmpty
    private List<Personaje> personajesInvolucrados = new ArrayList<>();

    private Date fecha;

    private String descripcion;

    public void addPersonaje(Personaje p) {
        this.personajesInvolucrados.add(p);
    }

    public void removePersonaje(Personaje p) {
        this.personajesInvolucrados.remove(p);
    }


}
