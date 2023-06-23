# Quipu

## ¿Qué es Quipu?

Quipu es un proyecto orientado a escritores, permitiéndoles, mediante una interfaz agradable e intuitiva, almacenar información relevante de sus historias y personajes y relacionarlos entre ellos.

Pero este proyecto no se centra únicamente en sustituir a un bloc de notas tradicional, sino que pretende ir un paso más allá; haciendo uso de las relaciones creadas entre los personajes y las historias, además de sus datos, Quipu pretende ofrecer de forma accesible información relevante que se obtiene de analizar el conjunto completo de los datos.

Funcionalidades como, por ejemplo, una Línea de Tiempo por cada historia que permite visualizar todos los elementos destacables de esta en una pantalla, incluyendo los nacimientos de los personajes y la formación de nuevas relaciones entre ellos. Todo esto, como no, junto con las diferentes escenas ya registradas.

De esta forma, se permite al autor ver el panorama general de su narrativa, por los puntos claves por los que pasa y quienes son los que están involucrados.

Pero Quipu no solamente se queda en una Línea de Tiempo, sino que también ofrece más características, como un grafo de relaciones, una extracción de datos relevantes dada una escena, mejoras a las escenas mediantes elementos multimedia, … y mucho más.

## Como crear una instancia de Quipu

Para crear una instancia, se necesita contar  con una instancia de MongoDB y un servidor con Java 17 instalado. No necesariamente tienen necesidad de estar ejecutándose en la misma máquina ambos servicios, mientras se indique adecuadamente en las variables de entorno.

Para lanzar el servicio con Java 17, simplemente debe hacerse uso de `./mvnw spring-boot:run`.

También se incluye un archivo Dockerfile por si prefiere utilizarse este.

## Variables de entorno

A continuación, se incluye un ejemplo de variables de entorno para ejecutar el proyecto.

Para empezar, será necesario configurar la URI donde se puede localizar el servicio de MongoDB utilizado. Puede emplearse un servicio como MongoDB Atlas.
`MONGO_DB_URI=mongodb+srv://<URI>`

A continuación, debe indicarse estas variables tal y como se indican a continuación si se desea un equilibrio entre utilidad y cantidad en los logs en tiempo real, además de deshabilitar herramientas de desarrollo que no se necesitan en producción.
`SPRING_DEVTOOLS=false`
`SPRING_LOG=ERROR`

Finalmente, debe indicarse una clave secreta, que será utilizada en el proyecto y su sistema criptografico.
`SPRING_SECRET_KEY=`


