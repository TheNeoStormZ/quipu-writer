package com.tns.quipu.Personaje;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioService;

@RestController
public class PersonajeController {

 
    private final PersonajeService ps;

    @Autowired
    private UsuarioService us;

    @Autowired
    public PersonajeController(PersonajeService ps) {
        this.ps=ps;
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
    public ResponseEntity<String> newPersonaje(@Valid @RequestBody Personaje personaje, Principal principal, BindingResult result) {

        personaje.setCreador(principal.getName());

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() +": " +error.getDefaultMessage();
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        ps.savePersonaje(personaje);

        return new ResponseEntity<>("OK", HttpStatus.CREATED);
        
    }

    

    
}
