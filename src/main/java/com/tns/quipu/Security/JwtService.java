
package com.tns.quipu.Security;

import java.util.Base64;
import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {
    private static final int EXPIRATION_TIME = 1000 * 60 * 60;
    private static final String AUTHORITIES = "authorities";
    private final String SECRET_KEY;
 
    public JwtService() {
        String envsecret = System.getenv("SPRING_SECRET_KEY");
        SECRET_KEY = Base64.getEncoder().encodeToString(envsecret.getBytes());
    }
 
    public String createToken(UserDetails userDetails) {
        System.out.println(SECRET_KEY);
        String username = userDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        return Jwts.builder()
                .setSubject(username)
                .claim(AUTHORITIES, authorities)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
 
    public Boolean hasTokenExpired(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
 
    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (userDetails.getUsername().equals(username) && !hasTokenExpired(token));
 
    }
 
    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
 
    public Collection<? extends GrantedAuthority> getAuthorities(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        return (Collection<? extends GrantedAuthority>) claims.get(AUTHORITIES);
    }
}

