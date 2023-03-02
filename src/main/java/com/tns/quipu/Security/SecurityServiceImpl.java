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


    private final UsuarioService userDetailsService;

    @Autowired
    public SecurityServiceImpl(UsuarioService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public boolean login(String username, String password) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, password, userDetails.getAuthorities());

        
        authenticationManager.authenticate(usernamePasswordAuthenticationToken);



        if (usernamePasswordAuthenticationToken.isAuthenticated()) {
            SecurityContextHolder.getContext()
                    .setAuthentication(usernamePasswordAuthenticationToken);
            return true;
        }

        return false;
    }
}
