package com.tns.quipu;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.hamcrest.Matchers.*;

import java.math.BigInteger;
import java.security.Principal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeController;
import com.tns.quipu.Personaje.PersonajeRepository;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Security.JwtAuthenticationEntryPoint;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioRol;
import com.tns.quipu.Usuario.UsuarioService;

@WebMvcTest(PersonajeController.class)
@WithMockUser(username = "user", password = "pass", roles = "USER")
public class PersonajeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService us;

    @MockBean
    private PersonajeService ps;

    @MockBean
    private PersonajeRepository pr;

    @MockBean
    private JwtService jwtservice;

    @MockBean
    private JwtAuthenticationEntryPoint jwtauth;

    @Test
    public void testListPersonajes() throws Exception {
        // Arrange

        Usuario user = new Usuario(new BigInteger("1"), "user@example.com", "user", "pass",
                Collections.singleton(new UsuarioRol("USER")));
        List<Personaje> personajes = Arrays.asList(
                new Personaje(user, "1", "Mario", "Pérez", "García", "Madrid", new Date(1638112320000L), "Masculino",
                        "170 cm", "Barcelona", "Un fontanero aventurero.", "/mario.png"),
                new Personaje(user, "2", "Luigi", "López", "Sánchez", "Roma", new Date(1638112320000L), "Masculino",
                        "180 cm", "Milán", "El hermano de Mario.", "/luigi.png"));
        when(us.findUserByUsername("user")).thenReturn(user);
        when(ps.findAllUserCharacters(user)).thenReturn(personajes);

        // Act and Assert
        mockMvc.perform(get("/api/personajes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].creador.username", is("user")))
                .andExpect(jsonPath("$[0].id", is("1")))
                .andExpect(jsonPath("$[0].nombre", is("Mario")))
                .andExpect(jsonPath("$[0].primerApellido", is("Pérez")))
                .andExpect(jsonPath("$[0].segundoApellido", is("García")))
                .andExpect(jsonPath("$[0].lugarNacimiento", is("Madrid")))
                .andExpect(jsonPath("$[0].fechaNacimiento", is("2021-11-28T15:12:00.000+00:00")))
                .andExpect(jsonPath("$[0].genero", is("Masculino")))
                .andExpect(jsonPath("$[0].altura", is("170 cm")))
                .andExpect(jsonPath("$[0].residencia", is("Barcelona")))
                .andExpect(jsonPath("$[0].descripcion", is("Un fontanero aventurero.")))
                .andExpect(jsonPath("$[0].urlIcon", is("/mario.png")));


        verify(us).findUserByUsername("user");
        verify(ps).findAllUserCharacters(user);
    }

    @Test
    public void testListGeneros() throws Exception {
        // Crear un objeto mock de Usuario
        Usuario user = new Usuario(new BigInteger("1"), "user@example.com", "user", "pass",
                Collections.singleton(new UsuarioRol("USER")));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Crear un conjunto de géneros esperados
        Set<String> expectedGeneros = Set.of("Masculino", "Femenino", "No binario");

        // Simular el comportamiento de los servicios us y ps
        when(us.findUserByUsername("user")).thenReturn(user);
        when(ps.findAllGenders(user)).thenReturn(expectedGeneros);

        // Llamar a la función a probar
        mockMvc.perform(get("/api/personajes/generos"))
        .andExpect(status().isOk())
        .andExpect(content().json("[\"Masculino\",\"Femenino\",\"No binario\"]"));

        verify(us).findUserByUsername("user");
        verify(ps).findAllGenders(user);
}

}