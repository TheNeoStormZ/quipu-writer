package com.tns.quipu.Usuario;

import java.security.Principal;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


    @Autowired
    public UsuarioController(UsuarioService us) {
        this.us = us;
    }

    @GetMapping(value = "/alive")
    public ResponseEntity<String> alive() {
        return new ResponseEntity<>("I AM ALIVE!!", HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/api/auth/register")
    public ResponseEntity<String> registerUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {

        if (result.hasErrors()) {
            FieldError error = result.getFieldError();
            String message = error.getField() +": " +error.getDefaultMessage();
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
            System.out.println(e);
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

    @RequestMapping("/api/loguser")
    public Principal user(Principal user) {
        return user;
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
        
        return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    } catch (NullPointerException e)  {
        return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }

    }

}
