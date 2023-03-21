package com.tns.quipu.Historia;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Usuario.Usuario;

@Service
public class HistoriaService {

    private HistoriaRepository hr;

    private TramaService ts;

    @Autowired
    public HistoriaService(HistoriaRepository hr,TramaService ts) {
        this.hr = hr;
        this.ts = ts;
    }

    
    @Transactional(readOnly = true)
    public List<Historia> findAllStories() {
        return hr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Historia> findAllUserStories(Usuario user) {
        return hr.findByCreador(user);
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
        return hr.findById(id).orElse(null);
    }


    
    @Transactional()
    public void saveHistoria(Historia historia) {
        hr.save(historia);
    }

    @Transactional()
    public void deleteHistoria(Historia historia) {
        historia.getTramas().stream().forEach(x -> ts.deleteTrama(x));
        historia.purgeDepedencies();
        hr.delete(historia);
    }

    @Transactional()
    public void updateHistoria(Historia historia) {
        Historia h = hr.findById(historia.getId()).orElse(null);
        h.setCreador(h.getCreador());
        h.setDescripcion(h.getDescripcion());

        hr.save(historia);
    }

    @Transactional()
    public Historia findByTrama(Trama trama) {
        return hr.findByTramasContains(trama);
    }




}
