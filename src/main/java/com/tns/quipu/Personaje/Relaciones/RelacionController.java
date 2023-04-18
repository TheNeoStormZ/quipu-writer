package com.tns.quipu.Personaje.Relaciones;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class RelacionController {

    private final PersonajeService ps;

    @Autowired
    private RelacionService rs;

    @Autowired
    private UsuarioService us;

    @Autowired
    public RelacionController(PersonajeService ps) {
        this.ps = ps;
    }

    @GetMapping(value = "/api/personajes/relaciones/{pid}")
    public ResponseEntity<Set<Personaje>> listRelaciones(@PathVariable String pid, Principal principal) {
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>(new HashSet<>(null), HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new HashSet<>(null), HttpStatus.FORBIDDEN);
        }

        Set<Personaje> personajes = rs.findAllPersonajeRelacionados(personaje);

        return new ResponseEntity<>(personajes, HttpStatus.OK);

    }

    @GetMapping(value = "/api/personajes/relaciones/{pid}/detailed")
    public ResponseEntity<List<Relacion>> listRelacionesDetailed(@PathVariable String pid, Principal principal) {
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>(new ArrayList<>(null), HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new ArrayList<>(null), HttpStatus.FORBIDDEN);
        }

        List<Relacion> personajes = rs.findAllPersonajeRelaciones(personaje);

        return new ResponseEntity<>(personajes, HttpStatus.OK);

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

    @DeleteMapping(value = "/api/personajes/relaciones/remove/{rid}/personaje/{pid}")
    public ResponseEntity<String> addRelaciones(@PathVariable String pid, @PathVariable String rid,
            Principal principal) {

        Relacion relacion = rs.findById(rid);
        Personaje personaje = ps.findById(pid);

        if (personaje == null) {
            return new ResponseEntity<>("FORBIDDEN", HttpStatus.FORBIDDEN);
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
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
