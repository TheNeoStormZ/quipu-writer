package com.tns.quipu;

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
import com.tns.quipu.Historia.Trama.TramaService;
import com.tns.quipu.Historia.Trama.Escena.Escena;
import com.tns.quipu.Historia.Trama.Escena.EscenaController;
import com.tns.quipu.Historia.Trama.Escena.EscenaService;
import com.tns.quipu.Personaje.PersonajeRepository;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Security.JwtAuthenticationEntryPoint;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioRol;
import com.tns.quipu.Usuario.UsuarioService;

@WebMvcTest(EscenaController.class)
public class EscenaControllerNotLoggedTest {
 
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
        public void getEscenasTestNotLogged() throws Exception {
                // Arrange
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                Usuario user = new Usuario(new String("1"),"user@example.com","user","pass","",Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);

                Trama trama = new Trama(user, "1", "trama1", "descripcion1", new ArrayList<>());

                Escena escena = new Escena();
                escena.setCreador(user);
                escena.setId(id);
                escena.setNombreEscena("E1");
                trama.añadirEscena(escena);

                List<Trama> tramas = Arrays.asList(trama);
                historia.setTramas(tramas);


                // Act and Assert
                mockMvc.perform(get("/api/historia/trama/escena/{id}", id))
                                .andExpect(status().is3xxRedirection());


        }

        @Test
        public void newEscena_NotLogged()
                        throws Exception {
                Gson gson = new Gson();
                // Arrange
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                historia.setNombreHistoria("Test1");
                Usuario user = new Usuario(new String("1"),"user@example.com","user","pass","",Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);

                Trama trama = new Trama(user, "1", "trama1", "descripcion1", new ArrayList<>());

                Escena escena = new Escena();
                escena.setId(id);
                escena.setNombreEscena("E1");
                escena.setDescripcion("Descripcion");
                trama.añadirEscena(escena);

                List<Trama> tramas = Arrays.asList(trama);
                historia.setTramas(tramas);


                String escenaJson = gson.toJson(escena);


                // Act and Assert
                mockMvc.perform(post("/api/historia/trama/{tid}/escena/new", id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(escenaJson))
                                .andExpect(status().is3xxRedirection());
        }


        @Test
        public void deleteEscenaTestNotLogged() throws Exception {
                Gson gson = new Gson();
                // Arrange
                Map<String, String> mapId = new HashMap<>();
                mapId.put("id", "1");
                // Arrange
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                historia.setNombreHistoria("Test1");
                Usuario user = new Usuario(new String("1"),"user@example.com","user","pass","",Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);

                Trama trama = new Trama(user, "1", "trama1", "descripcion1", new ArrayList<>());

                Escena escena = new Escena();
                escena.setCreador(user);
                escena.setId(id);
                escena.setNombreEscena("E1");
                escena.setDescripcion("Descripcion");



                List<Trama> tramas = Arrays.asList(trama);
                historia.setTramas(tramas);


                String escenaJson = gson.toJson(mapId);

                // Act and Assert
                mockMvc.perform(delete("/api/historia/trama/escena/delete")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(escenaJson))
                                .andExpect(status().is3xxRedirection());
        }

        @Test
        public void updateEscenaNotLogged()
                        throws Exception {
                Gson gson = new Gson();
                // Arrange
                String id = "1";
                Historia historia = new Historia();
                historia.setId(id);
                historia.setNombreHistoria("Test1");
                Usuario user = new Usuario(new String("1"),"user@example.com","user","pass","",Collections.singleton(new UsuarioRol("USER")));
                historia.setCreador(user);

                Trama trama = new Trama(user, "1", "trama1", "descripcion1", new ArrayList<>());

                Escena escena = new Escena();
                escena.setId(id);
                escena.setNombreEscena("E1");
                escena.setDescripcion("Descripcion");

                Escena escena2 = new Escena();
                escena2.setId(id);
                escena2.setNombreEscena("E2");
                escena2.setDescripcion("Descripcion2");
                escena2.setCreador(user);
                trama.añadirEscena(escena2);

                List<Trama> tramas = Arrays.asList(trama);
                historia.setTramas(tramas);


                String escenaJson = gson.toJson(escena);

                // Act and Assert
                mockMvc.perform(put("/api/historia/trama/escena/update")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(escenaJson))
                                .andExpect(status().is3xxRedirection());
        }

}
