package com.tns.quipu.Personaje;

import java.math.BigInteger;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//@RepositoryRestResource(collectionResourceRel = "personajes", path = "personajes")
public interface PersonajeRepository extends MongoRepository<Personaje, BigInteger>{

    public List<Personaje> findByPrimerApellido(String primerApellido);
 
    
}
