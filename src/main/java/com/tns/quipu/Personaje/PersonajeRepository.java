package com.tns.quipu.Personaje;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tns.quipu.Usuario.Usuario;

//@RepositoryRestResource(collectionResourceRel = "personajes", path = "personajes")
public interface PersonajeRepository extends MongoRepository<Personaje, String>{

    public List<Personaje> findByPrimerApellido(String primerApellido);

    public List<Personaje> findByCreador(Usuario user);

 
    
}
