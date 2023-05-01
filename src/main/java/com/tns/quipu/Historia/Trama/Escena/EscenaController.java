package com.tns.quipu.Historia.Trama.Escena;

import java.security.Principal;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class EscenaController {

    private final EscenaService es;
    private final HistoriaService hs;
    private final TramaService ts;

    @Autowired
    private UsuarioService us;

    @Autowired
    public EscenaController(EscenaService es, HistoriaService hs, TramaService ts) {
        this.es = es;
        this.hs = hs;
        this.ts = ts;
    }

    @GetMapping(value = "/api/historia/trama/escena/{id}")
    public ResponseEntity<Escena> getEscena(@PathVariable String id, Principal principal) {

        Escena escena = es.findById(id);

        if (escena == null) {
            return new ResponseEntity<>(new Escena(), HttpStatus.FORBIDDEN);
        }

        else if (escena.getCreador() == null) {
            return new ResponseEntity<>(new Escena(), HttpStatus.FORBIDDEN);
        }

        else if (!(escena.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Escena(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(es.findById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/api/historia/trama/{tid}/escena/new")
    public ResponseEntity<Historia> newEscena(@PathVariable String tid, @Valid @RequestBody Escena escena,
            Principal principal,
            BindingResult result) {

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        Trama t_og = ts.findById(tid);

        if (t_og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (t_og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (!(t_og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        escena.setCreador(loggedUser);

        if (result.hasErrors()) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        es.saveEscena(escena);

        t_og.añadirEscena(escena);

        ts.saveTrama(t_og);

        Historia og = hs.findByTrama(t_og);

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @PutMapping(value = "/api/historia/trama/escena/update")
    public ResponseEntity<Historia> updateEscena(@RequestBody Escena escena, Principal principal,
            BindingResult result) {

        Escena escena_og = es.findById(escena.getId());

        Trama tr_og = ts.findByEscena(escena_og);

        Historia og = hs.findByTrama(tr_og);

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        if (og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (escena_og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (escena_og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        if (!(escena_og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        escena.setCreador(loggedUser);

        if (result.hasErrors()) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        es.saveEscena(escena);

        og = hs.findById(og.getId());

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/historia/trama/escena/delete")
    public ResponseEntity<Historia> eliminarEscena(@RequestBody Map<String, String> mapId, Principal principal) {

        String id = mapId.get("id");

        Escena escena = es.findById(id);

        if (escena == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (escena.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (!(escena.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        Trama og = ts.findByEscena(escena);

        es.deleteEscena(escena);

        Historia hog = hs.findByTrama(og);

        return new ResponseEntity<>(hog, HttpStatus.ACCEPTED);

    }

}
