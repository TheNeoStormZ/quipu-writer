package com.tns.quipu.Historia.Trama;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

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
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class TramaController {

    private final TramaService ts;
    private final HistoriaService hs;

    @Autowired
    private UsuarioService us;

    @Autowired
    public TramaController(TramaService ts, HistoriaService hs) {
        this.ts = ts;
        this.hs = hs;
    }

    @GetMapping(value = "/api/historia/{id}/tramas")
    public ResponseEntity<List<Trama>> getTramas(@PathVariable String id, Principal principal) {
        Historia historia = hs.findById(id);

        if (historia == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }

        else if (historia.getCreador() == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }

        else if (!(historia.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
        }

        List<Trama> tramas = historia.getTramas();
        return new ResponseEntity<>(tramas, HttpStatus.OK);
    }

    @GetMapping(value = "/api/historia/trama/{id}")
    public ResponseEntity<Trama> getTrama(@PathVariable String id, Principal principal) {

        Trama trama = ts.findById(id);

        if (trama == null) {
            return new ResponseEntity<>(new Trama(), HttpStatus.FORBIDDEN);
        }

        else if (trama.getCreador() == null) {
            return new ResponseEntity<>(new Trama(), HttpStatus.FORBIDDEN);
        }

        if (!(trama.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Trama(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(ts.findById(id), HttpStatus.OK);
    }

    @PostMapping(value = "/api/historia/{hid}/trama/new")
    public ResponseEntity<Historia> newTrama(@PathVariable String hid, @Valid @RequestBody Trama trama,
            Principal principal,
            BindingResult result) {
                
        if (result.hasErrors()) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        Historia og = hs.findById(hid);

        if (og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        trama.setCreador(loggedUser);

        ts.saveTrama(trama);

        og.añadirTrama(trama);

        hs.saveHistoria(og);

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @PutMapping(value = "/api/historia/trama/update")
    public ResponseEntity<Historia> updateTrama(@RequestBody Trama trama, Principal principal,
            BindingResult result) {

        Trama trama_og = ts.findById(trama.getId());

        Historia og = hs.findByTrama(trama_og);


        if (og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        if (trama_og == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (trama_og.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        if (!(trama_og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        
        String hid = og.getId();

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        trama.setCreador(loggedUser);

        if (result.hasErrors()) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        ts.saveTrama(trama);

        og = hs.findById(hid);

        return new ResponseEntity<>(og, HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/historia/trama/delete")
    public ResponseEntity<Historia> eliminarTrama(@RequestBody Map<String, String> mapId, Principal principal) {
        String id = mapId.get("id");

        Trama trama = ts.findById(id);

        if (trama == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (trama.getCreador() == null) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        else if (!(trama.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>(new Historia(), HttpStatus.FORBIDDEN);
        }

        String ogId = hs.findByTrama(trama).getId();

        ts.deleteTrama(trama);

        Historia og = hs.findById(ogId);

        return new ResponseEntity<>(og, HttpStatus.ACCEPTED);

    }

}
