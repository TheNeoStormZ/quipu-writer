package com.tns.quipu.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.tns.quipu.Usuario.UsuarioService;

@Service
public class SecurityServiceImpl implements SecurityService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    private final UsuarioService userDetailsService;

    @Autowired
    public SecurityServiceImpl(UsuarioService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public boolean login(String username, String password) {
        System.out.println("usuarioImpl: " + username + " password: " + password);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, password, userDetails.getAuthorities());

        System.out.println("P1");
        
        authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        System.out.println("P2");


        if (usernamePasswordAuthenticationToken.isAuthenticated()) {
            SecurityContextHolder.getContext()
                    .setAuthentication(usernamePasswordAuthenticationToken);
            System.out.println(("Login correcto"));
            return true;
        }

        return false;
    }
}
