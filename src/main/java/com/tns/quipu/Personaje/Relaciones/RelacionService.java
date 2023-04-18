package com.tns.quipu.Personaje.Relaciones;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Usuario.Usuario;

@Service
public class RelacionService {

    private RelacionRepository rs;

    public RelacionService(RelacionRepository rs) {
        this.rs = rs;
    }

    @Transactional(readOnly = true)
    public List<Relacion> findAllUserCharacters(Usuario user) {
        return rs.findByCreador(user);
    }

    @Transactional()
    public Set<Personaje> findAllPersonajeRelacionados(Personaje p) {
       List<Relacion> relaciones = rs.findBypersonajesInvolucradosContains(p);

       Set<Personaje> result = relaciones.stream().map(x -> x.getPersonajesInvolucrados()).filter(Objects::nonNull).flatMap(List::stream).collect(Collectors.toSet());
       result.remove(p);
       return result;
       
    }

    @Transactional()
    public Relacion findById(String id) {
       return rs.findById(id).orElse(new Relacion());
       
    }

    @Transactional()
    public Relacion takeOutById(String id, Personaje p) {
        Relacion r = this.findById(id);
        r.removePersonaje(p);
        if (r.getPersonajesInvolucrados().size()<2) {
            this.deleteRelacion(r);
            return null;
        }
    return r;
    }

    @Transactional()
    public List<Relacion> findAllPersonajeRelaciones(Personaje p) {
       List<Relacion> relaciones = rs.findBypersonajesInvolucradosContains(p);
       return relaciones;
       
    }

    @Transactional()
    public void saveRelacion(Relacion relacion) {
        rs.save(relacion);
    }

    @Transactional()
    public void deleteRelacion(Relacion relacion) {
        rs.delete(relacion);
    }

    @Transactional()
    public void updateRelacion(Relacion relacion) {
        Relacion r = rs.findById(relacion.getId()).orElse(null);
        relacion.setCreador(r.getCreador());
        rs.save(relacion);
    }

}
