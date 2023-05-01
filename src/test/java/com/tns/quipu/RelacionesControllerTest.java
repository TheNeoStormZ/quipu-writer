package com.tns.quipu;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
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
import com.tns.quipu.Historia.HistoriaService;
import com.tns.quipu.Personaje.Personaje;
import com.tns.quipu.Personaje.PersonajeService;
import com.tns.quipu.Personaje.Relaciones.Relacion;
import com.tns.quipu.Personaje.Relaciones.RelacionController;
import com.tns.quipu.Personaje.Relaciones.RelacionRepository;
import com.tns.quipu.Personaje.Relaciones.RelacionService;
import com.tns.quipu.Security.JwtAuthenticationEntryPoint;
import com.tns.quipu.Security.JwtService;
import com.tns.quipu.Usuario.Usuario;
import com.tns.quipu.Usuario.UsuarioRol;
import com.tns.quipu.Usuario.UsuarioService;

@WebMvcTest(RelacionController.class)
@WithMockUser(username = "user", password = "pass", roles = "USER")
public class RelacionesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService us;

    @MockBean
    private PersonajeService ps;

    @MockBean
    private RelacionService rs;

    @MockBean
    private HistoriaService hs;

    @MockBean
    private RelacionRepository rr;

    @MockBean
    private JwtService jwtservice;

    @MockBean
    private JwtAuthenticationEntryPoint jwtauth;

    @Test
    public void testAddRelaciones() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        // Convertir el objeto relacion a JSON
        Gson gson = new Gson();
        String jsonRelacion = gson.toJson(relacion);

        // Simular el comportamiento de los servicios con Mockito
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(post("/api/personajes/relaciones/add/{pid}", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRelacion)
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isOk());

        // Verificar que se llama al metodo saveRelacion una vez con el argumento

        verify(rs).saveRelacion(any(Relacion.class));

    }

    @Test
    public void testAddRelacionesForbidden() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        // Convertir el objeto relacion a JSON
        Gson gson = new Gson();
        String jsonRelacion = gson.toJson(relacion);

        // Simular el comportamiento de los servicios con Mockito
        when(ps.findById("1")).thenReturn(null);
        when(us.findUserByUsername("user")).thenReturn(user);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(post("/api/personajes/relaciones/add/{pid}", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRelacion)
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void actualizarRelaciones_OK() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Relacion r2 = new Relacion();
        r2.setId("1");
        r2.setCreador(user);
        r2.setDescripcion("Enemigos");
        r2.addPersonaje(personaje);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Definir el comportamiento de los mocks
        when(rs.findById("1")).thenReturn(r);
        when(us.findUserByUsername("user")).thenReturn(user);
        Gson gson = new Gson();
        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(put("/api/personajes/relaciones/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(gson.toJson(r2)))
                .andExpect(status().isOk());

    }

    @Test
    public void actualizarRelaciones_Forbidden() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Relacion r2 = new Relacion();
        r2.setId("1");
        r2.setCreador(user);
        r2.setDescripcion("Enemigos");
        r2.addPersonaje(personaje);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Definir el comportamiento de los mocks
        when(rs.findById("1")).thenReturn(null);
        when(us.findUserByUsername("user")).thenReturn(user);
        Gson gson = new Gson();
        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(put("/api/personajes/relaciones/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(gson.toJson(r2)))
                .andExpect(status().isForbidden());

    }

    @Test
    public void actualizarRelaciones_Forbidden_User() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        Usuario user2 = new Usuario(new String("2"), "use2r@example.com", "user2", "pass", "",
                Collections.singleton(new UsuarioRol("USER2")));
        r.setCreador(user);
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Relacion r2 = new Relacion();
        r2.setId("1");
        r2.setCreador(user);
        r2.setDescripcion("Enemigos");
        r2.addPersonaje(personaje);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user2";
            }
        };

        // Definir el comportamiento de los mocks
        when(rs.findById("1")).thenReturn(null);
        when(us.findUserByUsername("user2")).thenReturn(user2);
        Gson gson = new Gson();
        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(put("/api/personajes/relaciones/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(gson.toJson(r2)))
                .andExpect(status().isForbidden());

    }

    @Test
    public void obtenerRelaciones() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(user);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(user);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Definir el comportamiento de los mocks
        when(rs.findById("1")).thenReturn(r);
        when(us.findUserByUsername(principal.getName())).thenReturn(user);
        when(us.findUserById("1")).thenReturn(user);
        when(rs.findAllPersonajeRelacionados(personaje, user)).thenReturn(relacionados);
        when(rr.findBypersonajesInvolucradosContainsAndCreadorEquals(personaje, user)).thenReturn(listaRelaciones);
        when(ps.findById("1")).thenReturn(personaje);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}", "1")
                .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", is("Personaje2")));

    }

    @Test
    public void obtenerRelaciones_Forbidden() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(user);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(user);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}", "1")
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void obtenerRelaciones_Forbidden_NullCreator() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(null);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(null);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Definir el comportamiento de los mocks
        when(ps.findById("1")).thenReturn(personaje);
        when(us.findUserById("1")).thenReturn(user);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}", "1")
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void obtenerRelacionesDetallado() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(user);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(user);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Definir el comportamiento de los mocks
        when(rs.findById("1")).thenReturn(r);
        when(us.findUserByUsername(principal.getName())).thenReturn(user);
        when(us.findUserById("1")).thenReturn(user);
        when(rs.findAllPersonajeRelaciones(personaje, user)).thenReturn(listaRelaciones);
        when(rr.findBypersonajesInvolucradosContainsAndCreadorEquals(personaje, user)).thenReturn(listaRelaciones);
        when(ps.findById("1")).thenReturn(personaje);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}/detailed", "1")
                .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].descripcion", is("Amigos")));

    }

    @Test
    public void obtenerRelacionesDetallado_Forbidden() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(user);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(user);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}/detailed", "1")
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void obtenerRelacionesDetallado_Forbidden_NullCreator() throws Exception {
        // Crear los objetos necesarios para el test
        Relacion r = new Relacion();
        Personaje personaje = new Personaje();
        r.setId("1");
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        r.setCreador(user);
        personaje.setCreador(null);
        personaje.setNombre("Personaje1");
        r.setDescripcion("Amigos");
        r.addPersonaje(personaje);

        Personaje personaje2 = new Personaje();
        personaje2.setCreador(null);
        personaje2.setNombre("Personaje2");

        r.addPersonaje(personaje2);

        Set<Personaje> relacionados = new HashSet<>();
        relacionados.add(personaje2);

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        List<Relacion> listaRelaciones = new ArrayList<>();
        listaRelaciones.add(r);

        // Invocar el método que se quiere probar y verificar el resultado
        mockMvc.perform(get("/api/personajes/relaciones/{pid}/detailed", "1")
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void testDelRelaciones() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setCreador(user);
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = new Relacion();
        relacion2.setCreador(user);
        relacion2.setId("1");
        relacion2.setDescripcion("Amigos");

        // Simular el comportamiento de los servicios con Mockito
        when(rs.findById("1")).thenReturn(relacion);
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        when(rs.takeOutById(relacion.getId(), personaje)).thenReturn(relacion2);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isOk());

        // Verificar que se llama al metodo saveRelacion una vez con el argumento

        verify(rs).saveRelacion(any(Relacion.class));

    }

    @Test
    public void testDelRelacionesNullSuccessfull() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setCreador(user);
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = null;

        // Simular el comportamiento de los servicios con Mockito
        when(rs.findById("1")).thenReturn(relacion);
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        when(rs.takeOutById(relacion.getId(), personaje)).thenReturn(relacion2);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isOk());

    }

    @Test
    public void testDelRelaciones_PersonajeCreatorNull() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = new Relacion();
        relacion2.setId("1");
        relacion2.setDescripcion("Amigos");

        // Simular el comportamiento de los servicios con Mockito
        when(rs.findById("1")).thenReturn(relacion);
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        when(rs.takeOutById(relacion.getId(), personaje)).thenReturn(relacion2);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void testDelRelaciones_PersonajeNull() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = new Relacion();
        relacion2.setId("1");
        relacion2.setDescripcion("Amigos");

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void testDelRelaciones_RelacionNull() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = new Relacion();
        relacion2.setId("1");
        relacion2.setDescripcion("Amigos");

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Simular el comportamiento de los servicios con Mockito
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        when(rs.takeOutById(relacion.getId(), personaje)).thenReturn(relacion2);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isForbidden());

    }

    @Test
    public void testDelRelaciones_RelacionCreadorNull() throws Exception {
        // Crear un personaje, una relacion y un usuario de prueba
        Personaje personaje = new Personaje();
        Usuario user = new Usuario(new String("1"), "user@example.com", "user", "pass", "",
                Collections.singleton(new UsuarioRol("USER")));
        personaje.setId("1");
        personaje.setCreador(user);

        Personaje personaje2 = new Personaje();
        personaje2.setId("2");
        personaje2.setCreador(user);

        Relacion relacion = new Relacion();
        relacion.setId("1");
        relacion.setDescripcion("Amigos");
        relacion.addPersonaje(personaje);

        Relacion relacion2 = new Relacion();
        relacion2.setId("1");
        relacion2.setDescripcion("Amigos");

        // Crear un objeto mock de Principal
        Principal principal = new Principal() {
            @Override
            public String getName() {
                return "user";
            }
        };

        // Simular el comportamiento de los servicios con Mockito
        when(rs.findById("1")).thenReturn(relacion);
        when(ps.findById("1")).thenReturn(personaje);
        when(ps.findById("2")).thenReturn(personaje);
        when(us.findUserByUsername("user")).thenReturn(user);
        when(rs.takeOutById(relacion.getId(), personaje)).thenReturn(relacion2);
        doNothing().when(rs).saveRelacion(any(Relacion.class));

        // Realizar la peticion POST con mockitomvc y verificar el resultado
        mockMvc.perform(delete("/api/personajes/relaciones/remove/{rid}/personaje/{pid}", "1", "2")
                .contentType(MediaType.APPLICATION_JSON)
                .principal(principal))
                .andExpect(status().isForbidden());

    }

}
