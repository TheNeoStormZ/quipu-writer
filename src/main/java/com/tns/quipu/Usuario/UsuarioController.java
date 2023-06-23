package com.tns.quipu.Usuario;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Security.JwtResponse;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Security.SecurityServiceImpl;

import jakarta.validation.Valid;


@RestController
public class UsuarioController {

    @Autowired
    SecurityServiceImpl ssi;


    @Autowired
    private UsuarioService userDetailsService;

    @Autowired
    private JwtService jwtService;

    private final UsuarioService us;

    private final HistoriaService hs;

    private final PersonajeService ps;


    @Autowired
    public UsuarioController(UsuarioService us, HistoriaService hs, PersonajeService ps) {
        this.us = us;
        this.hs=hs;
        this.ps = ps;
    }

    @GetMapping(value = "/alive")
    public ResponseEntity<String> alive() {
        return new ResponseEntity<>("I AM ALIVE!!", HttpStatus.ACCEPTED);
    }

    @DeleteMapping(value = "/api/auth/delete")
    public ResponseEntity<String> deleteUsuario(Principal principal) {
        Usuario loggedUser = us.findUserByUsername(principal.getName());
        us.deleteUser(loggedUser);
        return new ResponseEntity<>("OK", HttpStatus.OK);

    }

    @PostMapping(value = "/api/auth/register")
    public ResponseEntity<String> registerUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = "Error desconocido";
            if (error != null){
                message = error.getField() + ": " + error.getDefaultMessage();
            }
            return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
        }

        usuario.setAuthorities(new HashSet<>());

        if (usuario.getPassword().length()<8){
            return new ResponseEntity<>("La contraseña debe ser mayor o igual a 8 caracteres", HttpStatus.FORBIDDEN);
        }

        try {
            us.saveUsuario(usuario);
        } catch (DuplicateKeyException e) {
            if (e.getMessage().contains("username dup key")){
                return new ResponseEntity<>("Ya existe un usuario registrado con ese nombre", HttpStatus.FORBIDDEN);
            } else {
                return new ResponseEntity<>("Ya existe un usuario registrado con ese correo", HttpStatus.FORBIDDEN);
            }
            
        } catch (Exception e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

    @PutMapping(value = "/api/auth/update")
    public ResponseEntity<String> updateUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
        boolean isSpecialCase = false;
        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = "Error desconocido";
            if (error != null){
                message = error.getField() + ": " + error.getDefaultMessage();
                if (error.getField().equals("password") && usuario.getPassword().isBlank()) {
                    isSpecialCase = true;
                }
            } 

            if (!isSpecialCase) {
                return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
            }
        }
        if (usuario.getPassword().length()<8 && !(isSpecialCase)){
            return new ResponseEntity<>("La contraseña debe ser mayor o igual a 8 caracteres", HttpStatus.FORBIDDEN);
        }

        try {
            Usuario ogUser = us.findUserById(usuario.getId());
            usuario.setAuthorities(ogUser.getAuthorities());
            if (isSpecialCase) {
                usuario.setPassword(ogUser.getPassword());
                us.saveUsuarioExceptional(usuario);
            } else {
                us.saveUsuario(usuario);
            }
        } catch (DuplicateKeyException e) {
            if (e.getMessage().contains("username dup key")){
                return new ResponseEntity<>("Ya existe un usuario registrado con ese nombre", HttpStatus.FORBIDDEN);
            } else {
                return new ResponseEntity<>("Ya existe un usuario registrado con ese correo", HttpStatus.FORBIDDEN);
            }
            
        } catch (Exception e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

    @GetMapping("/api/me")
    public Usuario user(Principal user) {
        return us.findUserByUsername(user.getName());
    }

    @GetMapping("/api/me/mydata")
    public List<Pair<String, Integer>> userData(Principal user) {
        List<Pair<String, Integer>> lista = new ArrayList<>();
        Usuario usuario = us.findUserByUsername(user.getName());
        int numHistorias = hs.findAllUserStories(usuario).size();
        int numPersonajes = ps.findAllUserCharacters(usuario).size();
        Pair<String, Integer> pair = Pair.of("numHistorias", numHistorias);
        lista.add(pair);
        Pair<String, Integer> pair2 = Pair.of("numPersonajes", numPersonajes);
        lista.add(pair2);
        return lista;
    }
 
    @PostMapping(value = "/api/auth/login")
    public ResponseEntity<JwtResponse> loginUsuario(@RequestBody Usuario usuario) {


        Usuario usuarioFound = us.findUserByEmail(usuario.getEmail());

        try {
        UserDetails userDetails = userDetailsService.loadUserByUsername(usuarioFound.getUsername());
        
        boolean login = ssi.login(usuarioFound.getUsername(), usuario.getPassword());
        if (login){
            String token = jwtService.createToken(userDetails);
            JwtResponse jToken = new JwtResponse(token);
            return new ResponseEntity<>(jToken, HttpStatus.ACCEPTED);

        }
        
        return new ResponseEntity<>(new JwtResponse(null), HttpStatus.FORBIDDEN);
    } catch (NullPointerException e)  {
        return new ResponseEntity<>(new JwtResponse(null), HttpStatus.FORBIDDEN);
    }

    }

}
