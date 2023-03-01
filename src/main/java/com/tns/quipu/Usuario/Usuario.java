package com.tns.quipu.Usuario;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigInteger;
import java.util.Set;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected BigInteger id;

	@Valid
	@NotEmpty
	@NotBlank
    @Email
	@Indexed(unique = true)
	protected String email;

	@Valid
	@NotEmpty
	@NotBlank
	@Indexed(unique = true)
	protected String username;

	@Valid
    @NotBlank
	@NotBlank
	protected String password;

	private Set<UsuarioRol> authorities;

}

