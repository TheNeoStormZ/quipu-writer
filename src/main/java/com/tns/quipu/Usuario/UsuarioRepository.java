package com.tns.quipu.Usuario;

import java.math.BigInteger;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;


//@RepositoryRestResource(collectionResourceRel = "usuarios", path = "usuarios")
public interface UsuarioRepository extends MongoRepository<Usuario, BigInteger>{

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByUsernameOrEmail(String username,String email);

    Optional<Usuario> findByEmail(String email);



    
}
