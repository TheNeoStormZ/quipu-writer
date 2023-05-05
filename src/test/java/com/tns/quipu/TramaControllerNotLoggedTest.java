package com.tns.quipu;

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

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;
import com.tns.quipu.Historia.Historia;
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Historia.Trama.Trama;
import com.tns.quipu.Historia.Trama.TramaController;
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Personaje.PersonajeRepository;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Security.JwtAuthenticationEntryPoint;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioRol;
import com.tns.quipu.Usuario.UsuarioService;

@WebMvcTest(TramaController.class)
public class TramaControllerNotLoggedTest {

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
        public void getTramas_NotLogged() throws Exception {
                // Arrange
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);
                List<Trama> tramas = Arrays.asList(new Trama(user, "1", "trama1", "descripcion1", new ArrayList<>()),
                                new Trama(user, "2", "trama2", "descripcion2", new ArrayList<>()));
                historia.setTramas(tramas);


                // Act and Assert
                mockMvc.perform(get("/api/historia/{id}/tramas", id))
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void getTrama_ShouldReturnTrama_NotLogged() throws Exception {
                // Arrange
                String id = "1234";

                Trama trama = new Trama();
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                trama.setCreador(user);
                trama.setId(id);
                trama.setNombreTrama("Trama de prueba");
                trama.setDescripcion("Esta es una trama de prueba");
                trama.setEscenas(new ArrayList<>());

                // Act && Assert
                mockMvc.perform(get("/api/historia/trama/{id}", id)).andExpect(status().is3xxRedirection());
        }

        @Test
        public void newTramaTestNotLogged() throws Exception {
                Gson gson = new Gson();
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);
                // Crea un objeto Trama
                Trama trama = new Trama();
                trama.setNombreTrama("trama1");
                trama.setDescripcion("descripcion1");

                // Convierte el objeto Trama en una cadena JSON
                String tramaJson = gson.toJson(trama);

                // Simula una petición POST a la API con el JSON como cuerpo y verifica la
                // respuesta
                mockMvc.perform(post("/api/historia/{hid}/trama/new", "1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(tramaJson))
                                .andExpect(status().is3xxRedirection());
        }

        @Test
        public void eliminarTramaTestNotLogged() throws Exception {
                Gson gson = new Gson();
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);
                // Crea un objeto Trama
                Trama trama = new Trama();
                trama.setCreador(user);
                trama.setNombreTrama("trama1");
                trama.setDescripcion("descripcion1");

                // Convierte el objeto Trama en una cadena JSON
                String tramaJson = gson.toJson(trama);

                when(us.findUserByUsername("user")).thenReturn(user);
                when(hs.findByTrama(trama)).thenReturn(historia);
                when(ts.findById("1")).thenReturn(trama);
                doNothing().when(ts).deleteTrama(trama);

                Map<String, String> mapId = new HashMap<>();
                mapId.put("id", "1");


                // Realizar la petición DELETE con el mapa y el principal
                mockMvc.perform(delete("/api/historia/trama/delete")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gson.toJson(mapId))) // convertir el mapa en JSON usando Gson
                                .andExpect(status().is3xxRedirection());

        }

        @Test
        public void updateTramaTestNotLogged() throws Exception {
                // Arrange
                Trama trama = new Trama();
                trama.setId("1");
                trama.setNombreTrama("Trama de prueba");
                trama.setDescripcion("Esta es una trama de prueba");
                Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                                Collections.singleton(new UsuarioRol("USER")));

                Trama trama2 = new Trama();
                trama2.setId("1");
                trama2.setNombreTrama("Trama de prueba2");
                trama2.setDescripcion("Esta es una trama de prueba2");
                trama2.setCreador(user);

                Historia historia = new Historia();
                historia.setId("1");
                historia.setNombreHistoria("Historia de prueba");
                historia.setDescripcion("Esta es una historia de prueba");
                historia.setCreador(user);
                historia.setTramas(Collections.singletonList(trama2));


                Gson gson = new Gson();
                // Act & Assert
                mockMvc.perform(put("/api/historia/trama/update")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gson.toJson(trama)))
                                .andExpect(status().is3xxRedirection());

        }



}
