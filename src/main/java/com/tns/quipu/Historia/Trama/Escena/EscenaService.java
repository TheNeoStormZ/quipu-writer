package com.tns.quipu.Historia.Trama.Escena;

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
import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaRepository;
import com.tns.quipu.Usuario.Usuario;

@Service
public class EscenaService {

    private EscenaRepository er;
    private TramaRepository tr;

    @Autowired
    public EscenaService(EscenaRepository er, TramaRepository tr) {
        this.er = er;
        this.tr = tr;
    }

    
    @Transactional(readOnly = true)
    public List<Escena> findAllScenes() {
        return er.findAll();
    }

    @Transactional(readOnly = true)
    public List<Escena> findAllUserScenes(Usuario user) {
        return er.findByCreador(user);
    }


    @Transactional()
    public Escena findById(String id) {
        return er.findById(id).orElse(null);
    }

    
    @Transactional()
    public void saveEscena(Escena escena) {
        er.save(escena);
    }

    @Transactional()
    public void deleteEscena(Escena escena) {
        Trama t = tr.findByEscenasContains(escena);
        t.eliminarEscena(escena);
        tr.save(t);
        er.delete(escena);
    }



}