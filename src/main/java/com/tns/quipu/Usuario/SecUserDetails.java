package com.tns.quipu.Usuario;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.ToString;
@ToString
public class SecUserDetails implements UserDetails {

    private Usuario user;

    public SecUserDetails(Usuario user) {
        this.user = user;
    }
	
    public SecUserDetails(Usuario user, String username, String password, Set<UsuarioRol> authorities) {
		this.user = user;
		this.user.username=username;
		this.user.password=password;
		this.user.setAuthorities(authorities);
    }

    public SecUserDetails(String email, String password, Set<GrantedAuthority> authorities) {
		this.user.setEmail(email);
		this.user.setPassword(password);
    }

    @Override
	public Set<UsuarioRol> getAuthorities() {

		return this.user.getAuthorities();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return user.getUsername();
    }

}