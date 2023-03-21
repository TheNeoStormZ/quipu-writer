package com.tns.quipu.Historia.Trama;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Usuario.Usuario;


public interface TramaRepository extends MongoRepository<Trama, String>{

    public List<Trama> findByCreador(Usuario user);

    public Trama findByEscenasContains (Escena escena);

 
    
}
