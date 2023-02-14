package com.tns.quipu.Personaje;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Usuario.Usuario;

@Service
public class PersonajeService {

    private PersonajeRepository pr;

    @Autowired
    public PersonajeService(PersonajeRepository pr) {
        this.pr = pr;
    }

    
    @Transactional(readOnly = true)
    public List<Personaje> findAllCharacters() {
        return pr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Personaje> findAllUserCharacters(String user) {
        return pr.findByCreador(user);
    }

    @Transactional(readOnly = true)
    public Set<String> findAllGenders(String user) {
        Set<String> generos = findAllUserCharacters(user).stream().map(x -> x.getGenero()).collect(Collectors.toSet());
        generos.addAll(List.of("Masculino","Femenino"));
        return generos;
    }

    
    @Transactional()
    public void savePersonaje(Personaje personaje) {
        pr.save(personaje);
    }



}
