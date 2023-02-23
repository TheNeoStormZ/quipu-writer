package com.tns.quipu.Security;

import org.springframework.beans.factory.annotation.Autowired;
/* */
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.tns.quipu.Usuario.UsuarioService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	private UsuarioService us;

	private JwtAuthenticationEntryPoint authEntryPoint;

	@Autowired
	public SecurityConfiguration(UsuarioService us, JwtAuthenticationEntryPoint authEntryPoint) {
		this.us = us;
		this.authEntryPoint = authEntryPoint;
	}



	@Bean
	public AuthenticationManager authManager(HttpSecurity http, PasswordEncoder passwordEncoder, UserDetailsService userDetailService)
			throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class)
				.userDetailsService(userDetailService)
				.passwordEncoder(passwordEncoder)
				.and()
				.build();
	}


	@Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		.exceptionHandling()
		.and()
		.sessionManagement()
		.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		.authorizeHttpRequests((requests) -> requests
						.requestMatchers("/built/**", "/login", "/register", "/api/auth/**","/alive")
						.permitAll()
						.anyRequest().authenticated())
				.formLogin()
				.loginPage("/login").defaultSuccessUrl("/").and()
				.csrf().ignoringRequestMatchers("/api/auth/**","/api/**","/api/personajes/**").and()
				.logout((logout) -> logout.permitAll());

		http.addFilterAfter(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
    public  JwtRequestFilter jwtAuthenticationFilter() {
        return new JwtRequestFilter();
    }
}
