package com.tns.quipu.Personaje.Relaciones;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class RelacionController {

    private final PersonajeService ps;

    private final HistoriaService hs;

    @Autowired
    private RelacionService rs;

    @Autowired
    private UsuarioService us;

    @Autowired
    public RelacionController(PersonajeService ps, HistoriaService hs) {
        this.ps = ps;
        this.hs=hs;
    }

    @GetMapping(value = "/api/personajes/relaciones/{pid}")
    public ResponseEntity<Set<Personaje>> listRelaciones(@PathVariable String pid, Principal principal) {
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        else if ((personaje.getCreador() == null)) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());
        Set<Personaje> personajes = rs.findAllPersonajeRelacionados(personaje, loggedUser);

        return new ResponseEntity<>(personajes, HttpStatus.OK);

    }

    @GetMapping(value = "/api/personajes/relaciones/{pid}/detailed")
    public ResponseEntity<List<Relacion>> listRelacionesDetailed(@PathVariable String pid, Principal principal) {
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }

        else if ((personaje.getCreador() == null)) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        List<Relacion> personajes = rs.findAllPersonajeRelaciones(personaje, loggedUser);

        return new ResponseEntity<>(personajes, HttpStatus.OK);

    }

    @GetMapping(value = "/api/historia/relaciones/{hid}/detailed")
    public ResponseEntity<Set<Relacion>> listRelacionesHistoriaDetailed(@PathVariable String hid, Principal principal) {

        Historia historia = hs.findById(hid);

        
        if (historia == null) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        else if ((historia.getCreador() == null)) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        else if (!(historia.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new HashSet<>(), HttpStatus.FORBIDDEN);
        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());
        Set<Personaje> personajes = historia.obtenerPersonajes();

        Set<Relacion> relaciones = new HashSet<>();

        for (Personaje personaje: personajes) {
            relaciones.addAll(rs.findAllPersonajeRelacionesHistoria(personaje, historia,loggedUser));
        }

        return new ResponseEntity<>(relaciones, HttpStatus.OK);

    }

    @PostMapping(value = "/api/personajes/relaciones/add/{pid}")
    public ResponseEntity<String> addRelaciones(@PathVariable String pid, @RequestBody Relacion r,
            Principal principal) {

        Personaje personaje = ps.findById(pid);

        r.addPersonaje(personaje);

        if (personaje == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        r.setCreador(loggedUser);

        rs.saveRelacion(r);

        return new ResponseEntity<>("OK", HttpStatus.OK);

    }

    @PutMapping(value = "/api/personajes/relaciones/update")
    public ResponseEntity<String> actualizarRelaciones(@RequestBody Relacion r,
            Principal principal) {

        if (r.getId() == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        Relacion relacionOg = rs.findById(r.getId());

        if (relacionOg == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (!(relacionOg.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        r.setCreador(loggedUser);

        rs.saveRelacion(r);

        return new ResponseEntity<>("OK", HttpStatus.OK);

    }

    @DeleteMapping(value = "/api/personajes/relaciones/remove/{rid}/personaje/{pid}")
    public ResponseEntity<String> addRelaciones(@PathVariable String pid, @PathVariable String rid,
            Principal principal) {

        Relacion relacion = rs.findById(rid);
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (personaje.getCreador() == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        if (relacion == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (relacion.getCreador() == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (!(relacion.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        relacion = rs.takeOutById(rid, personaje);

        if (relacion == null) {

            return new ResponseEntity<>("OK", HttpStatus.OK);

        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        relacion.setCreador(loggedUser);

        rs.saveRelacion(relacion);

        return new ResponseEntity<>("OK", HttpStatus.OK);

    }
}
