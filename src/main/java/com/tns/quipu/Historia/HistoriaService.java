package com.tns.quipu.Historia;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Usuario.Usuario;

@Service
public class HistoriaService {

    private HistoriaRepository pr;

    @Autowired
    public HistoriaService(HistoriaRepository pr) {
        this.pr = pr;
    }

    
    @Transactional(readOnly = true)
    public List<Historia> findAllStories() {
        return pr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Historia> findAllUserStories(Usuario user) {
        return pr.findByCreador(user);
    }

    @Transactional(readOnly = true)
    public Set<String> findAllGenres(Usuario user) {
        Set<String> generos = findAllUserStories(user).stream().map(x -> x.getGeneros()).filter(Objects::nonNull).flatMap(List::stream).collect(Collectors.toSet());
        List<String> defaultGeneros = List.of("Aventura","Ciencia Ficción");
        generos.addAll(defaultGeneros);
        return generos;
    }

    @Transactional()
    public Historia findById(String id) {
        return pr.findById(id).orElse(null);
    }


    
    @Transactional()
    public void saveHistoria(Historia historia) {
        pr.save(historia);
    }

    @Transactional()
    public void deleteHistoria(Historia historia) {
        pr.delete(historia);
    }

    @Transactional()
    public void updateHistoria(Historia historia) {
        Historia p = pr.findById(historia.getId()).orElse(null);
        p.setCreador(p.getCreador());
        p.setDescripcion(p.getDescripcion());

        pr.save(historia);
    }



}
