package com.tns.quipu.Historia;

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
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

import net.minidev.json.JSONObject;

@RestController
public class HistoriaController {

    private final HistoriaService hs;

    @Autowired
    private UsuarioService us;

    @Autowired
    public HistoriaController(HistoriaService hs) {
        this.hs = hs;
    }

    @GetMapping(value = "/api/historias")
    public List<Historia> listHistorias(Principal principal) {
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        List<Historia> personajes = hs.findAllUserStories(loggedUser);
        return personajes;

    }

    @GetMapping(value = "/api/historias/generos")
    public Set<String> listGeneros(Principal principal) {
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        Set<String> generos = hs.findAllGenres(loggedUser);
        return generos;

    }

    @PostMapping(value = "/api/historias/new")
    public ResponseEntity<String> newPersonaje(@Valid @RequestBody Historia personaje, Principal principal,
            BindingResult result) {

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        personaje.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        hs.saveHistoria(personaje);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @PutMapping(value = "/api/historias/update")
    public ResponseEntity<String> updatePersonaje(@RequestBody Historia personaje, Principal principal,
            BindingResult result) {

        System.out.println("Historia: " + personaje.toString());
        System.out.println("Historia id: " + personaje.getId());

        Historia og = hs.findById(personaje.getId());

        if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        
        Usuario loggedUser = us.findUserByUsername(principal.getName());

        personaje.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        hs.saveHistoria(personaje);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/historias/delete")
    public ResponseEntity<String> eliminarPersonaje(@RequestBody Map<String, String> mapId, Principal principal) {
        String id = mapId.get("id");
        Historia personaje = hs.findById(id);
        if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }
        hs.deleteHistoria(personaje);
        return new ResponseEntity<>("OK", HttpStatus.ACCEPTED);

    }

    @PostMapping(value = "/api/historias/import")
    public ResponseEntity<String> importarPersonaje(@RequestBody @Valid Historia personaje, Principal principal) {

        Historia personajeFound= null;

        try {
            personajeFound = hs.findById(personaje.getId());

        }  catch (Exception e) {
            
        }

        String message = "Empty message";

        if (personajeFound == null) {
            message = "Personaje exportado correctamente";
        } 
        else {
            message = "Personaje actualizado correctamente";
        }



        
        Usuario loggedUser = us.findUserByUsername(principal.getName());

        personaje.setCreador(loggedUser);
        
        hs.saveHistoria(personaje);
        return new ResponseEntity<>(message, HttpStatus.CREATED);

    }
 
    @GetMapping(value = "/api/historias/{id}/export",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> exportarPersonaje(@PathVariable String id, Principal principal) {
        Historia personaje = hs.findById(id);

        if (personaje == null) {
            return ResponseEntity.notFound().build();
        }

        else if (!(personaje.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        try {
            // Convierte el objeto a formato JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String elementoJson = objectMapper.writeValueAsString(personaje);
            Gson gson = new Gson();

            JsonElement jsonElement = gson.fromJson(elementoJson, JsonElement.class);

            JsonObject jsonObject = jsonElement.getAsJsonObject();

            jsonObject.remove("creador");

            elementoJson = gson.toJson(jsonElement);


            // Se devuelve una respuesta con el elemento exportado
            return ResponseEntity.ok(elementoJson);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

}
