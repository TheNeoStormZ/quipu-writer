package com.tns.quipu.Personaje;

import java.util.List;
import java.util.Objects;
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
    public List<Personaje> findAllUserCharacters(Usuario user) {
        return pr.findByCreador(user);
    }

    @Transactional(readOnly = true)
    public Set<String> findAllGenders(Usuario user) {
        Set<String> generos = findAllUserCharacters(user).stream().map(x -> x.getGenero()).filter(Objects::nonNull).filter( x -> !x.isBlank()).filter(x -> !x.isEmpty()).collect(Collectors.toSet());
        generos.addAll(List.of("Masculino","Femenino"));
        return generos;
    }

    @Transactional()
    public Personaje findById(String id) {
        return pr.findById(id).orElse(null);
    }


    
    @Transactional()
    public void savePersonaje(Personaje personaje) {
        pr.save(personaje);
    }

    @Transactional()
    public void deletePersonaje(Personaje personaje) {
        pr.delete(personaje);
    }

    @Transactional()
    public void updatePersonaje(Personaje personaje) {
        Personaje p = pr.findById(personaje.getId()).orElse(null);
        p.setAltura(p.getAltura());
        p.setCreador(p.getCreador());
        p.setDescripcion(p.getDescripcion());

        pr.save(personaje);
    }



}
