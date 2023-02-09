package com.tns.quipu.Usuario;

import org.springframework.security.core.GrantedAuthority;

public class UsuarioRol implements GrantedAuthority{
    
    private Role role;


	public UsuarioRol(String authority) {

        this.role=new Role(authority);

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

