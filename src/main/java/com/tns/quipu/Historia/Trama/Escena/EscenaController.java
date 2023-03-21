package com.tns.quipu.Historia.Trama.Escena;

import java.io.IOException;
import java.security.Principal;
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

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @GetMapping(value = "/api/historia/trama/{id}/escenas")
    public ResponseEntity<List<Escena>> getEscenas(@PathVariable String id, Principal principal) {
        System.out.println("ID HIST:" + id);
        Historia historia = hs.findById(id);
        if (!(historia.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        List<Escena> escenas = historia.getEscenas();
        return new ResponseEntity<>(escenas, HttpStatus.OK);
    }

    @GetMapping(value = "/api/historia/escena/{id}")
    public ResponseEntity<Escena> getEscena(@PathVariable String id, Principal principal) {

        Escena escena = es.findById(id);
        if (!(escena.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(es.findById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/api/historia/trama/{tid}/escena/new")
    public ResponseEntity<Historia> newEscena(@PathVariable String tid, @Valid @RequestBody Escena escena,
            Principal principal,
            BindingResult result) {

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        Trama t_og = ts.findById(tid);

        if (!(t_og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        escena.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        es.saveEscena(escena);

        t_og.añadirEscena(escena);

        ts.saveTrama(t_og);

        Historia og = hs.findByTrama(t_og);

        System.out.println(og);

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @PutMapping(value = "/api/historia/trama/escena/update")
    public ResponseEntity<Historia> updateEscena(@RequestBody Escena escena, Principal principal,
            BindingResult result) {

        Escena escena_og = es.findById(escena.getId());

        Trama tr_og = ts.findByEscena(escena_og);

        String hid = hs.findByTrama(tr_og).getId();

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        Historia og = hs.findById(hid);

        if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        if (!(escena_og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        escena.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        es.saveEscena(escena);

        og = hs.findById(hid);

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/historia/trama/escena/delete")
    public ResponseEntity<Historia> eliminarEscena(@RequestBody Map<String, String> mapId, Principal principal) {

        String id = mapId.get("id");

        Escena escena = es.findById(id);

        if (!(escena.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        String ogId = ts.findByEscena(escena).getId();

        es.deleteEscena(escena);

        Trama og = ts.findById(ogId);

        Historia hog = hs.findByTrama(og);

        return new ResponseEntity<>(hog, HttpStatus.ACCEPTED);

    }

}
