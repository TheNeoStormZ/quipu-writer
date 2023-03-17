package com.tns.quipu.Historia;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Usuario.Usuario;


public interface HistoriaRepository extends MongoRepository<Historia, String>{

    public List<Historia> findByCreador(Usuario user);


    public Historia findByTramasContains (Trama trama);

 
    
}
