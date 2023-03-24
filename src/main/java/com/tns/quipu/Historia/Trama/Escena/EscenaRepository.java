package com.tns.quipu.Historia.Trama.Escena;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Usuario.Usuario;


public interface EscenaRepository extends MongoRepository<Escena, String>{

    public List<Escena> findByCreador(Usuario user);

    public List<Escena> findBypersonajesInvolucradosContains(Personaje personaje);

 
    
}
