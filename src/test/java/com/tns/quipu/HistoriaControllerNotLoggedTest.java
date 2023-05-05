package com.tns.quipu;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;
import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaController;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Personaje.PersonajeRepository;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Security.JwtAuthenticationEntryPoint;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioRol;
import com.tns.quipu.Usuario.UsuarioService;

@WebMvcTest(HistoriaController.class)
public class HistoriaControllerNotLoggedTest {

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
        private TramaService ts;

        @MockBean
        private PersonajeRepository pr;

        @MockBean
        private JwtService jwtservice;

        @MockBean
        private JwtAuthenticationEntryPoint jwtauth;

        @Test
        public void testListGenerosNotLogged() throws Exception {
                // Crear un objeto mock de Usuario
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));


                // Crear un conjunto de géneros esperados
                Set<String> expectedGeneros = Set.of("Aventura", "Ciencia Ficción", "Historico");


                // Llamar a la función a probar
                mockMvc.perform(get("/api/historias/generos"))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void testListHistoriasNotLogged() throws Exception {
                // Crear un usuario y una lista de historias
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                List<Historia> historias = new ArrayList<>();
                Historia historia1 = new Historia();
                historia1.setCreador(user);
                historia1.setId("1");
                historia1.setNombreHistoria("Historia 1");
                historia1.setGeneros(Arrays.asList("Fantasía", "Aventura"));
                historia1.setDescripcion("Descripción 1");
                Historia historia2 = new Historia();
                historia2.setCreador(user);
                historia2.setId("2");
                historia2.setNombreHistoria("Historia 2");
                historia2.setGeneros(Arrays.asList("Ciencia ficción", "Terror"));
                historia2.setDescripcion("Descripción 2");
                historias.add(historia1);
                historias.add(historia2);


                // Realizar la petición GET y comprobar el resultado
                mockMvc.perform(get("/api/historias"))
                                .andExpect(status().is3xxRedirection());
        }

        @Test
        public void testNewHistoriaNotLogged() throws Exception {
                // Crear un usuario y una historia válida
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                Historia historia = new Historia();
                historia.setId("1");
                historia.setNombreHistoria("Historia 1");
                historia.setGeneros(Arrays.asList("Fantasía", "Aventura"));
                historia.setDescripcion("Descripción 1");


                // Crear un objeto Gson
                Gson gson = new Gson();

                // Realizar la petición POST con la historia válida y comprobar el resultado
                mockMvc.perform(post("/api/historias/new")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gson.toJson(historia))) // convertir la historia en JSON usando Gson
                                .andExpect(status().is3xxRedirection());


        }

        @Test
        public void testUpdateHistoriaNotLogged() throws Exception {
                // Crear un usuario y una historia original
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                Historia historiaOriginal = new Historia();
                historiaOriginal.setCreador(user);
                historiaOriginal.setId("1");
                historiaOriginal.setNombreHistoria("Historia 1");
                historiaOriginal.setGeneros(Arrays.asList("Fantasía", "Aventura"));
                historiaOriginal.setDescripcion("Descripción 1");

                // Crear una trama original
                Trama tramaOriginal = new Trama();
                tramaOriginal.setCreador(user);
                tramaOriginal.setId("1");
                tramaOriginal.setNombreTrama("Trama 1");
                tramaOriginal.setDescripcion("Contenido 1");
                // Añadir la trama original a la historia original
                historiaOriginal.setTramas(Arrays.asList(tramaOriginal));

                // Crear una historia modificada con el mismo id y creador
                Historia historiaModificada = new Historia();
                historiaModificada.setId("1");
                historiaModificada.setNombreHistoria("Historia 2");
                historiaModificada.setGeneros(Arrays.asList("Ciencia ficción", "Terror"));
                historiaModificada.setDescripcion("Descripción 2");

                // Crear una trama modificada con el mismo id y creador
                Trama tramaModificada = new Trama();
                tramaModificada.setId("1");
                tramaModificada.setNombreTrama("Trama 2");
                tramaModificada.setDescripcion("Contenido 2");

                // Añadir la trama modificada a la historia modificada
                historiaModificada.setTramas(Arrays.asList(tramaModificada));

                // Crear un objeto Gson
                Gson gson = new Gson();

                // Realizar la petición PUT con la historia modificada y comprobar el resultado
                mockMvc.perform(put("/api/historias/update")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gson.toJson(historiaModificada))) // convertir la historia modificada en JSON
                                                                           // usando Gson
                                .andExpect(status().is3xxRedirection());


        }

        @Test
        public void testEliminarHistoriaNotLogged() throws Exception {
                // Crear un usuario y una historia
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                Historia historia = new Historia();
                historia.setCreador(user);
                historia.setId("1");
                historia.setNombreHistoria("Historia 1");
                historia.setGeneros(Arrays.asList("Fantasía", "Aventura"));
                historia.setDescripcion("Descripción 1");

                // Crear un mapa con el id de la historia
                Map<String, String> mapId = new HashMap<>();
                mapId.put("id", "1");


                // Crear un objeto Gson
                Gson gson = new Gson();

                // Realizar la petición DELETE con el mapa y comprobar el resultado
                mockMvc.perform(delete("/api/historias/delete")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gson.toJson(mapId))) // convertir el mapa en JSON usando Gson
                                .andExpect(status().is3xxRedirection());

        }


}
