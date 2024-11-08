package com.tns.quipu.Usuario;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaRepository;
import com.tns.quipu.Historia.HistoriaService;

@Service
public class UsuarioService implements UserDetailsService {

    private UsuarioRepository ur;
    private HistoriaService hs;

    @Autowired
    public UsuarioService(UsuarioRepository ur,HistoriaService hs) {
        this.ur = ur;
        this.hs = hs;
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAllUsers() {
        return ur.findAll();
    }

    @Transactional()
    public Usuario findUserById(String id) {
        return ur.findById(id).orElse(null);
    } 

    @Transactional(readOnly = true)
    public Usuario findUserByEmail(String email) {
        return ur.findByEmail(email).orElse(null);
    }

    @Transactional(readOnly = true)
    public Usuario findUserByUsername(String username) {
        return ur.findByUsername(username).orElse(null);
    }

    @Transactional()
    public void saveUsuario(Usuario usuario) {
        usuario.setPassword(new BCryptPasswordEncoder().encode(usuario.getPassword()));
        ur.save(usuario);
    }

    
    @Transactional()
    public void saveUsuarioExceptional(Usuario usuario) {
        usuario.setPassword(usuario.getPassword());
        ur.save(usuario);
    }

    @Transactional()
    public void deleteUser(Usuario usuario) {
        List<Historia> historiasUsuario = hs.findAllUserStories(usuario);
        historiasUsuario.stream().forEach(x -> hs.deleteHistoria(x));
        ur.delete(usuario);
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Usuario user = ur.findByUsernameOrEmail(userName,userName).orElse(null);
        if (user != null) {
            Set<UsuarioRol> authorities = user
            .getAuthorities()
            .stream()
            .map((role) -> new UsuarioRol(role.getAuthority())).collect(Collectors.toSet());


            SecUserDetails usuario = new SecUserDetails(user,user.getUsername(),
            user.getPassword(),
            authorities);
            return usuario;
        }
        return null;
    }

}
