package com.tns.quipu.Usuario;

import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UsuarioRol implements GrantedAuthority{
    
    private Role role;

    @JsonCreator
    public UsuarioRol(@JsonProperty("rol") String authority) {
        this.role = new Role(authority);
    }

    

    @Override
    public String getAuthority() {
        return role.getName();
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


}

