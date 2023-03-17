package com.tns.quipu.Historia.Trama;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaRepository;
import com.tns.quipu.Usuario.Usuario;

@Service
public class TramaService {

    private TramaRepository tr;
    private HistoriaRepository hr;

    @Autowired
    public TramaService(TramaRepository tr, HistoriaRepository hr) {
        this.tr = tr;
        this.hr = hr;
    }

    
    @Transactional(readOnly = true)
    public List<Trama> findAllArcs() {
        return tr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Trama> findAllUserArcs(Usuario user) {
        return tr.findByCreador(user);
    }


    @Transactional()
    public Trama findById(String id) {
        return tr.findById(id).orElse(null);
    }

    
    @Transactional()
    public void saveTrama(Trama trama) {
        tr.save(trama);
    }

    @Transactional()
    public void deleteTrama(Trama trama) {
        Historia h = hr.findByTramasContains(trama);
        h.eliminarTrama(trama);
        hr.save(h);
        tr.delete(trama);
    }


    @Transactional()
    public void updateTrama(Trama trama) {
        Trama t = tr.findById(trama.getId()).orElse(null);
        t.setCreador(t.getCreador());
        t.setDescripcion(t.getDescripcion());

        tr.save(trama);
    }



}
