package com.tns.quipu;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
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
public class PersonajeControllerNotLoggedTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private UsuarioService us;

        @MockBean
        private EscenaService es;

        @MockBean
        private PersonajeService ps;

        @MockBean
        private HistoriaService hs;

        @MockBean
        private PersonajeRepository pr;

        @MockBean
        private JwtService jwtservice;

        @MockBean
        private JwtAuthenticationEntryPoint jwtauth;

        @Test
        public void testListPersonajesNotLogged() throws Exception {
                // Arrange

                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                List<Personaje> personajes = Arrays.asList(
                                new Personaje(user, "1", "Mario", "Pérez", "García", "Madrid", new Date(1638112320000L),
                                                "Masculino",
                                                "170 cm", "Barcelona", "Un fontanero aventurero.", "/mario.png", null,
                                                null),
                                new Personaje(user, "2", "Luigi", "López", "Sánchez", "Roma", new Date(1638112320000L),
                                                "Masculino",
                                                "180 cm", "Milán", "El hermano de Mario.", "/luigi.png", null, null));
                when(us.findUserByUsername("user")).thenReturn(user);
                when(ps.findAllUserCharacters(user)).thenReturn(personajes);

                // Act and Assert
                mockMvc.perform(get("/api/personajes"))
                                .andExpect(status().is3xxRedirection());
        }

        @Test
        public void testListPersonajesExceptNotLogged() throws Exception {
                // Arrange

                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                List<Personaje> personajes = Arrays.asList(
                                new Personaje(user, "1", "Mario", "Pérez", "García", "Madrid", new Date(1638112320000L),
                                                "Masculino",
                                                "170 cm", "Barcelona", "Un fontanero aventurero.", "/mario.png", null,
                                                null),
                                new Personaje(user, "2", "Luigi", "López", "Sánchez", "Roma", new Date(1638112320000L),
                                                "Masculino",
                                                "180 cm", "Milán", "El hermano de Mario.", "/luigi.png", null, null));

                // Act and Assert
                mockMvc.perform(get("/api/personajes/{pid}", "1"))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void testListGenerosNotLogged() throws Exception {
                // Crear un objeto mock de Usuario
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));

                // Crear un conjunto de géneros esperados
                Set<String> expectedGeneros = Set.of("Masculino", "Femenino", "No binario");

                // Llamar a la función a probar
                mockMvc.perform(get("/api/personajes/generos"))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        void newPersonajeNotLogged() throws Exception {
                // Arrange
                Personaje personaje = new Personaje();
                personaje.setNombre("Harry");
                personaje.setPrimerApellido("Potter");
                personaje.setSegundoApellido(null);
                personaje.setLugarNacimiento("Godric's Hollow");
                personaje.setFechaNacimiento(new SimpleDateFormat("dd/MM/yyyy").parse("31/07/1980"));
                personaje.setGenero("Masculino");
                personaje.setAltura("170");
                personaje.setResidencia("Privet Drive, 4");
                personaje.setDescripcion("El niño que vivió");
                personaje.setUrlIcon(
                                "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg");

                // Crear un objeto mock de Usuario
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));

                // Simular el comportamiento del servicio us y ps
                doNothing().when(ps).savePersonaje(personaje);

                // Act and Assert
                Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
                mockMvc.perform(post("/api/personajes/new")
                                .content(gson.toJson(personaje))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void testEliminarPersonajeNotLogged() throws Exception {

                // Arrange
                Personaje personaje = new Personaje();
                personaje.setId("123");
                personaje.setNombre("Batman");
                Usuario creador = new Usuario();
                creador.setUsername("user");
                personaje.setCreador(creador);

                // Simular una petición HTTP al método del controlador y verificar la respuesta
                mockMvc.perform(delete("/api/personajes/delete")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"id\":\"123\"}"))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void testUpdatePersonajeSuccessNotLogged() throws Exception {
                // Arrange
                Usuario usuario = new Usuario();
                usuario.setUsername("user");
                Personaje personaje = new Personaje(usuario, "1", "Mario", "Fontanero", null, null, null, null, null,
                                null, null, null, null, null);

                Personaje personaje2 = new Personaje(usuario, "1", "MarioEdit", "Font", "Bro", null, null, null, "100",
                                null, null, null, null, null);

                // Invocar el método bajo prueba y verificar el resultado
                Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
                mockMvc.perform(put("/api/personajes/update")
                                .content(gson.toJson(personaje2))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().is3xxRedirection());

        }

}
