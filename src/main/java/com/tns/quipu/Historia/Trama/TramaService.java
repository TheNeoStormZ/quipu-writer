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
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Usuario.Usuario;

@Service
public class TramaService {

    private TramaRepository tr;
    private HistoriaRepository hr;
    private EscenaService es;

    @Autowired
    public TramaService(TramaRepository tr, HistoriaRepository hr,EscenaService es) {
        this.tr = tr;
        this.hr = hr;
        this.es = es;
    }

    
    @Transactional(readOnly = true)
    public List<Trama> findAllScenes() {
        return tr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Trama> findAllUserScenes(Usuario user) {
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

        trama.getEscenas().stream().forEach(x -> es.deleteEscena(x));

        tr.delete(trama);
    }


    @Transactional()
    public void updateTrama(Trama trama) {
        Trama t = tr.findById(trama.getId()).orElse(null);
        t.setCreador(t.getCreador());
        t.setDescripcion(t.getDescripcion());

        tr.save(trama);
    }

    @Transactional()
    public Trama findByEscena(Escena escena) {
        return tr.findByEscenasContains(escena);
    }



}
