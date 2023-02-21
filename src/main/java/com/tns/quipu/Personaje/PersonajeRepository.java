package com.tns.quipu.Personaje;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.tns.quipu.Usuario.Usuario;

//@RepositoryRestResource(collectionResourceRel = "personajes", path = "personajes")
public interface PersonajeRepository extends MongoRepository<Personaje, String>{

    public List<Personaje> findByPrimerApellido(String primerApellido);

    public List<Personaje> findByCreador(String user);

 
    
}
