package com.tns.quipu.Usuario;

import java.math.BigInteger;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role, BigInteger> {
    Optional<Role> findByName(String name);
}
