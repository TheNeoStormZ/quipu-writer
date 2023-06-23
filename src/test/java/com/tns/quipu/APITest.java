package com.tns.quipu;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;

public class APITest {

    // El método que hace la petición HTTP y devuelve el JSON como un objeto
    private JSONObject getJSONFromAPI(String API_URL) throws IOException, JSONException {
        URL url = new URL(API_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.connect();
        int responseCode = connection.getResponseCode();
        assertEquals(200, responseCode); // Verificar que el código de respuesta es 200 (OK)
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
        }
        return new JSONObject(sb.toString()); // Convertir el String a JSONObject
    }

    @Test
    public void testAPIHistory() throws IOException, JSONException {
        // La URL de la API
        String API_URL = "https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+dbpedia-owl%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0ASELECT+DISTINCT+%3Fevent+%3Fdate%0D%0AWHERE+%7B%0D%0A++%3Fevent+rdf%3Atype+dbpedia-owl%3AEvent+.%0D%0A++%3Fevent+dbpedia-owl%3Adate+%3Fdate+.%0D%0A++FILTER+%28xsd%3Adate%28%3Fdate%29+%3E%3D+xsd%3Adate%28%221939-01-01%22%29+%26%26+xsd%3Adate%28%3Fdate%29+%3C%3D+xsd%3Adate%28%221939-12-31%22%29%29%0D%0A%7D%0D%0AORDER+BY+DESC%28%3Fdate%29&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on";

        JSONObject json = getJSONFromAPI(API_URL); // Obtener el JSON de la API
        assertNotNull(json); // Verificar que no es nulo
        JSONObject head = json.getJSONObject("head"); // Obtener el objeto "head"
        assertNotNull(head); // Verificar que no es nulo
        JSONArray link = head.getJSONArray("link"); // Obtener el array "link"
        assertNotNull(link); // Verificar que no es nulo
        JSONArray vars = head.getJSONArray("vars"); // Obtener el array "vars"
        assertNotNull(vars); // Verificar que no es nulo
        assertEquals(2, vars.length()); // Verificar que tiene dos elementos
        assertEquals("event", vars.getString(0)); // Verificar que el primer elemento es "event"
        assertEquals("date", vars.getString(1)); // Verificar que el segundo elemento es "date"
        JSONObject results = json.getJSONObject("results"); // Obtener el objeto "results"
        assertNotNull(results); // Verificar que no es nulo
        boolean distinct = results.getBoolean("distinct"); // Obtener el booleano "distinct"
        assertEquals(false, distinct); // Verificar que es falso
        boolean ordered = results.getBoolean("ordered"); // Obtener el booleano "ordered"
        assertEquals(true, ordered); // Verificar que es verdadero
        JSONArray bindings = results.getJSONArray("bindings"); // Obtener el array "bindings"
        assertNotNull(bindings); // Verificar que no es nulo
        for (int i = 0; i < bindings.length(); i++) { // Recorrer cada elemento del array
            JSONObject binding = bindings.getJSONObject(i); // Obtener el objeto "binding"
            assertNotNull(binding); // Verificar que no es nulo
            JSONObject event = binding.getJSONObject("event"); // Obtener el objeto "event"
            assertNotNull(event); // Verificar que no es nulo
            String eventType = event.getString("type");
            assertEquals("uri", eventType); // Verificar que es "uri"
            String eventValue = event.getString("value");
            assertNotNull(eventValue); // Verificar que no es nulo
            JSONObject date = binding.getJSONObject("date");
            assertNotNull(date); // Verificar que no es nulo
            String dateType = date.getString("type"); // Obtener el tipo de "date"
            assertEquals("typed-literal", dateType); // Verificar que es "typed-literal"
            String dateDatatype = date.getString("datatype"); // Obtener el datatype de "date"
            assertEquals("http://www.w3.org/2001/XMLSchema#date", dateDatatype);
            String dateValue = date.getString("value"); // Obtener el valor de "date"
        assertNotNull(dateValue); // Verificar que no es nulo
    }
}

@Test
public void testAPICharacter() throws IOException, JSONException {
    // La URL de la API
    String API_URL = "https://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0APREFIX+dbp%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0ASELECT+%3Fnombre+%3Fapellidos+%3Fgenero+%3Fresidencia+%3Faltura+%3FfechaNacimiento+%3FlugarNacimiento+%3Fdescripcion%0D%0AWHERE+%7B%0D%0A++%3Fpersona+foaf%3Aname+%3Fnombre+.%0D%0A++FILTER+regex%28%3Fnombre%2C+%22Hester+Shaw%22%2C+%22i%22%29+.%0D%0A++OPTIONAL+%7B+%3Fpersona+foaf%3Asurname+%3Fapellidos+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbp%3Agender+%3Fgenero+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aresidence+%3Fresidencia+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aheight+%3Faltura+.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbp%3Aorigin+%3FlugarNacimiento.+%7D%0D%0A++OPTIONAL+%7B+%3Fpersona+dbp%3Adata+%3FfechaNacimiento+.+%7D%0D%0A++FILTER%28STR%28%3FfechaNacimiento%29+%3D+REGEX%28STR%28%3FfechaNacimiento%29%2C+%22%5E%28%5C%5Cd%7B4%7D-%5C%5Cd%7B2%7D-%5C%5Cd%7B2%7D%7C%5C%5Cd%7B2%7D-%5C%5Cd%7B2%7D-%5C%5Cd%7B4%7D%29%24%22%29%29.%0D%0A++OPTIONAL+%7B+%3Fpersona+dbo%3Aabstract+%3Fdescripcion+.%0D%0A+++++++++++++FILTER+%28lang%28%3Fdescripcion%29+%3D+%22en%22+%7C%7C+lang%28%3Fdescripcion%29+%3D+%22es%22%29+.%0D%0A+++++++++++%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=10000&signal_void=on&signal_unconnected=on";

    JSONObject json = getJSONFromAPI(API_URL);
    assertNotNull(json); // Verificar que no es nulo
    JSONObject head = json.getJSONObject("head"); // Obtener el objeto "head"
    assertNotNull(head); // Verificar que no es nulo
    JSONArray link = head.getJSONArray("link"); // Obtener el array "link"
    assertNotNull(link); // Verificar que no es nulo
    JSONArray vars = head.getJSONArray("vars"); // Obtener el array "vars"
    assertNotNull(vars); // Verificar que no es nulo
    assertEquals(8, vars.length()); // Verificar que tiene ocho elementos
    assertEquals("nombre", vars.getString(0));
    assertEquals("apellidos", vars.getString(1));
    assertEquals("genero", vars.getString(2));
    assertEquals("residencia", vars.getString(3));
    assertEquals("altura", vars.getString(4));
    assertEquals("fechaNacimiento", vars.getString(5));
    assertEquals("lugarNacimiento", vars.getString(6));
    assertEquals("descripcion", vars.getString(7));
    JSONObject results = json.getJSONObject("results");
    assertNotNull(results); 
    boolean distinct = results.getBoolean("distinct"); 
    assertEquals(false, distinct); 
    boolean ordered = results.getBoolean("ordered"); 
    assertEquals(true, ordered); 
    JSONArray bindings = results.getJSONArray("bindings");
    assertNotNull(bindings);
    for (int i = 0; i < bindings.length(); i++) { 
        JSONObject binding = bindings.getJSONObject(i); 
        assertNotNull(binding); 
        JSONObject nombre = binding.getJSONObject("nombre"); 
        assertNotNull(nombre);
        String nombreType = nombre.getString("type");
        assertEquals("literal", nombreType);
        String nombreValue = nombre.getString("value");
        assertNotNull(nombreValue);
}
}

}
