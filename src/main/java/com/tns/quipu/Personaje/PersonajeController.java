package com.tns.quipu.Personaje;

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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class PersonajeController {

    private final PersonajeService ps;

    @Autowired
    private UsuarioService us;

    @Autowired
    public PersonajeController(PersonajeService ps) {
        this.ps = ps;
    }

    @GetMapping(value = "/api/personajes")
    public List<Personaje> listPersonajes(Principal principal) {
        List<Personaje> personajes = ps.findAllUserCharacters(principal.getName());
        return personajes;

    }

    @GetMapping(value = "/api/personajes/generos")
    public Set<String> listGeneros(Principal principal) {
        Set<String> generos = ps.findAllGenders(principal.getName());
        return generos;

    }

    @PostMapping(value = "/api/personajes/new")
    public ResponseEntity<String> newPersonaje(@Valid @RequestBody Personaje personaje, Principal principal,
            BindingResult result) {

        personaje.setCreador(principal.getName());

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        ps.savePersonaje(personaje);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @PutMapping(value = "/api/personajes/update")
    public ResponseEntity<String> updatePersonaje(@RequestBody Personaje personaje, Principal principal,
            BindingResult result) {

        System.out.println("Personaje: " + personaje.toString());
        System.out.println("Personaje id: " + personaje.getId());

        Personaje og = ps.findById(personaje.getId());

        if (!(og.getCreador().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        personaje.setCreador(principal.getName());

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        ps.savePersonaje(personaje);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/personajes/delete")
    public ResponseEntity<String> eliminarPersonaje(@RequestBody Map<String, String> mapId, Principal principal) {
        String id = mapId.get("id");
        System.out.println("ID: " + id);
        Personaje personaje = ps.findById(id);
        if (!(personaje.getCreador().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }
        ps.deletePersonaje(personaje);
        return new ResponseEntity<>("OK", HttpStatus.ACCEPTED);

    }

    @PostMapping(value = "/api/personajes/import")
    public ResponseEntity<String> importarPersonaje(@RequestBody @Valid Personaje personaje, Principal principal) {

        Personaje personajeFound= null;

        try {
            personajeFound = ps.findById(personaje.getId());

        }  catch (Exception e) {
            
        }

        String message = "Empty message";

        if (personajeFound == null) {
            message = "Personaje exportado correctamente";
        } 
        else {
            message = "Personaje actualizado correctamente";
        }

        personaje.setCreador(principal.getName());
        
        ps.savePersonaje(personaje);
        return new ResponseEntity<>(message, HttpStatus.CREATED);

    }
 
    @GetMapping(value = "/api/personajes/{id}/export",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> exportarPersonaje(@PathVariable String id, Principal principal) {
        Personaje personaje = ps.findById(id);

        if (personaje == null) {
            return ResponseEntity.notFound().build();
        }

        else if (!(personaje.getCreador().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        try {
            // Convierte el objeto a formato JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String elementoJson = objectMapper.writeValueAsString(personaje);

            

            // Se devuelve una respuesta con el elemento exportado
            return ResponseEntity.ok(elementoJson);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

}
