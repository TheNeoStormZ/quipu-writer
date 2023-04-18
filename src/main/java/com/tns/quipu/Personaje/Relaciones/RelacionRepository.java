package com.tns.quipu.Personaje.Relaciones;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Usuario.Usuario;

public interface RelacionRepository extends MongoRepository<Relacion, String>{

    public List<Relacion> findBypersonajesInvolucradosContains(Personaje personaje);
 
    public List<Relacion> findByCreador(Usuario user);
    
}
