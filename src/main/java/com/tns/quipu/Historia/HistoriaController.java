package com.tns.quipu.Historia;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

import net.minidev.json.JSONObject;

@RestController
public class HistoriaController {

    private final HistoriaService hs;

    private final TramaService ts;

    private final EscenaService es;

    private final PersonajeService ps;

    @Autowired
    private UsuarioService us;

    @Autowired
    public HistoriaController(HistoriaService hs, TramaService ts, EscenaService es, PersonajeService ps) {
        this.hs = hs;
        this.ts = ts;
        this.es = es;
        this.ps = ps;
    }

    @GetMapping(value = "/api/historias")
    public List<Historia> listHistorias(Principal principal) {
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        List<Historia> historias = hs.findAllUserStories(loggedUser);
        return historias;

    }


    @GetMapping(value = "/api/historias/generos")
    public Set<String> listGeneros(Principal principal) {
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        Set<String> generos = hs.findAllGenres(loggedUser);
        return generos;
    }

    @PostMapping(value = "/api/historias/new")
    public ResponseEntity<String> newHistoria(@Valid @RequestBody Historia historia, Principal principal,
            BindingResult result) {

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        historia.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        hs.saveHistoria(historia);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @PostMapping(value = "/api/historias/new/fast")
    public ResponseEntity<Historia> newHistoriaFast(@Valid @RequestBody Historia historia, Principal principal,
            BindingResult result) { 
                ResponseEntity<String> resutCreation = this.newHistoria(historia, principal, result);
                 if (resutCreation.getStatusCode().is2xxSuccessful()){
                    Usuario loggedUser = us.findUserByUsername(principal.getName());
                    Historia og = hs.findById(historia.getId());

                    Trama t = new Trama(loggedUser, null, "Introducción", "El inicio de la historia", new ArrayList<>());
                    ts.saveTrama(t);
                    og.añadirTrama(t);
                    hs.saveHistoria(og);

                    return new ResponseEntity<>(og, HttpStatus.CREATED);
                 }

                 return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
            }
    
    @PutMapping(value = "/api/historias/update")
    public ResponseEntity<String> updateHistoria(@RequestBody Historia historia, Principal principal,
            BindingResult result) {

        Historia og = hs.findById(historia.getId());

        if (!(og.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        historia.setCreador(loggedUser);

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() + ": " + error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        if (historia.getTramas().isEmpty()) {
            historia.setTramas(og.getTramas());
        }

        hs.saveHistoria(historia);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);

    }

    @DeleteMapping(value = "/api/historias/delete")
    public ResponseEntity<String> eliminarHistoria(@RequestBody Map<String, String> mapId, Principal principal) {
        String id = mapId.get("id");
        Historia historia = hs.findById(id);
        if (!(historia.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        hs.deleteHistoria(historia);

        return new ResponseEntity<>("OK", HttpStatus.ACCEPTED);

    }

    @PostMapping(value = "/api/historias/import")
    public ResponseEntity<String> importarHistoria(@RequestBody @Valid Historia historia, Principal principal) {

        Historia historiaFound = null;

        try {
            historiaFound = hs.findById(historia.getId());

        } catch (Exception e) {

        }

        String message = "Empty message";

        if (historiaFound == null) {
            message = "Historia exportada correctamente";
        } else {
            message = "Hstoria actualizada correctamente";
        }

        Usuario loggedUser = us.findUserByUsername(principal.getName());

        historia.setCreador(loggedUser);

        List<Trama> tramasBackup = historia.getTramas();

        historia.purgeDepedencies();

        tramasBackup.parallelStream().forEach(x -> {
            x.setCreador(loggedUser);
            x.setId(null);
            x.getEscenas().parallelStream().forEach(e -> {
                e.setCreador(loggedUser);
                e.setId(null);
                List<Personaje> oldPersonajesInvolucrados = e.getPersonajesInvolucrados();
                e.purgeDepedencies();
                oldPersonajesInvolucrados.parallelStream().forEach(p -> {
                    if (p.getId() != null) {
                        Personaje pFound = ps.findById(p.getId());
                        if (pFound == null) {
                            p.setCreador(loggedUser);
                            ps.savePersonaje(p);
                            e.añadirPersonaje(p);
                        } else if (pFound.getCreador() == null) {
                            pFound.setCreador(loggedUser);
                            ps.savePersonaje(pFound);
                            e.añadirPersonaje(pFound);
                        } else if (pFound.getCreador().getUsername().equals(principal.getName())) {
                            e.añadirPersonaje(pFound);
                        }
                    }
                });
                es.saveEscena(e);
                x.añadirEscena(e);
            });
            ts.saveTrama(x);
            historia.añadirTrama(x);
        });

        hs.saveHistoria(historia);

        return new ResponseEntity<>(message, HttpStatus.CREATED);

    }

    @GetMapping(value = "/api/historias/{id}/export", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> exportarHistoria(@PathVariable String id, Principal principal) {
        Historia historia = hs.findById(id);

        if (historia == null) {
            return ResponseEntity.notFound().build();
        }

        else if (!(historia.getCreador().getUsername().equals(principal.getName()))) {
            return new ResponseEntity<>("Not the owner", HttpStatus.FORBIDDEN);
        }

        try {
            // Convierte el objeto a formato JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String elementoJson = objectMapper.writeValueAsString(historia);
            Gson gson = new Gson();

            JsonElement jsonElement = gson.fromJson(elementoJson, JsonElement.class);

            JsonObject jsonObject = jsonElement.getAsJsonObject();

            jsonObject.remove("creador");

            JsonArray tramasJson = jsonObject.get("tramas").getAsJsonArray();

            for (JsonElement trama : tramasJson) {
                trama.getAsJsonObject().remove("creador");
                JsonArray escenas = trama.getAsJsonObject().get("escenas").getAsJsonArray();
                for (JsonElement escena : escenas) {
                    escena.getAsJsonObject().remove("creador");
                }
            }

            elementoJson = gson.toJson(jsonElement);

            // Se devuelve una respuesta con el elemento exportado
            return ResponseEntity.ok(elementoJson);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }


}
