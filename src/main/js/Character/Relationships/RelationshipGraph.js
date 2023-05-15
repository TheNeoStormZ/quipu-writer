const React = require("react");
const ReactDOM = require("react-dom");

import cytoscape from "cytoscape";
import PersonajeModal from "./PersonajeModal/CharacterInfoModal";

class RelationshipGraph extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = { 
      matches: window.matchMedia("(min-width: 768px)").matches,
      personajeDato: null // declara el estado inicial de personajeDato
    };
    this.styleMax = {
      /* Estilo por defecto */ width: "800px",
      height: "600px",
      filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))",
      boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.5)",
    };
    this.styleMin = {
      /* Estilo para pantallas pequeñas */
      width: "300px",
      height: "300px",
      filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5))",
      boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.5)",
    };
  }

  updatePersonajeDato = (newPersonajeDato) => {
    // Usa this.setState para actualizar el estado de personajeDato
    this.setState({ personajeDato: newPersonajeDato });
  }

  componentDidMount() {
    // Tus variables
    const personaje = JSON.parse(localStorage.getItem("personaje"));
    const { datos } = this.props;

    // Crea un array vacío para guardar los elementos
    const elements = [];

    // Crea un objeto con la información del personaje principal y añádelo al array como un nodo
    const mainNode = {
      data: {
        id: personaje.id,
        label: personaje.nombre,
        personajeDato: personaje,
        color: "#191970",
      },
    };
    elements.push(mainNode);

    // Define una variable para guardar la posición inicial de los nodos
    let x = 0;
    let y = 0;

    // Define una variable para guardar el incremento de la posición de los nodos
    const dx = 100;
    const dy = 100;

    // Recorre el array de datos y por cada elemento crea un objeto con la información de la relación y añádelo al array como un nodo
    datos.forEach((dato) => {
      const relationNode = {
        data: {
          id: dato.id,
          label: "Relación: " + dato.descripcion,
          color: "#197070",
        },
        position: {
          x: x,
          y: y,
        },
      };
      elements.push(relationNode);

      // Incrementa el valor de x e y en dx y dy
      x += dx;
      y += dy;
    });

    // Recorre el array de datos y por cada elemento recorre el array de personajesInvolucrados y por cada uno crea otro objeto con la información del personaje secundario y añádelo al array como otro nodo
    datos.forEach((dato) => {
      dato.personajesInvolucrados.forEach((personajeSecundario) => {
        const secondaryNode = {
          data: {
            id: personajeSecundario.id,
            label: personajeSecundario.nombre,
            personajeDato: personajeSecundario,
            color: "#666",
          },
          position: {
            x: x,
            y: y,
          },
        };
        elements.push(secondaryNode);

        // Incrementa el valor de x e y en dx y dy
        x += dx;
        y += dy;
      });
    });

    // Recorre el array de datos y por cada elemento recorre el array de personajesInvolucrados y por cada uno crea una arista entre el personaje principal y el nodo de la relación
    datos.forEach((dato) => {
      dato.personajesInvolucrados.forEach((personajeSecundario) => {
        const mainEdge = {
          data: {
            source: personaje.id,
            target: dato.id,
          },
        };
        elements.push(mainEdge);
      });
    });

    // Recorre el array de datos y por cada elemento recorre el array de personajesInvolucrados y por cada uno crea otra arista entre el nodo de la relación y el personaje secundario
    datos.forEach((dato) => {
      dato.personajesInvolucrados.forEach((personajeSecundario) => {
        const edge = {
          data: {
            source: dato.id,
            target: personajeSecundario.id,
          },
        };
        elements.push(edge);
      });
    });
    let container = this.containerRef.current;
    // Crea una instancia de cytoscape y pasa el elemento HTML como el contenedor y los elementos como la opción elements

    const cy = cytoscape({
      container: container,
      elements: elements,
    });

    // Aplica el estilo que quieras al gráfico de cytoscape
    cy.style([
      {
        selector: "node",
        style: {
          "background-color": "data(color)",
          label: "data(label)",
        },
      },

      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#ccc",
          "target-arrow-color": "#ccc",
          "target-arrow-shape": "triangle",
          label: "data(label)",
        },
      },
    ]);

    cy.on("tap", "node", (event) => {
      let node = event.target;
      console.log(node.data("label"));
      console.log(node.data("color"));
      let personajeDato = node.data("personajeDato");
      console.log(personajeDato);
     
      if (personajeDato != null) {

      this.setState({ personajeDato: personajeDato });
      }
      });

  }

  render() {
    return (
      <div>
        {this.state.matches && (
          <div ref={this.containerRef} style={this.styleMax}></div>
        )}
        {!this.state.matches && (
          <div ref={this.containerRef} style={this.styleMin}></div>
        )}
        {this.state.personajeDato && ( <PersonajeModal data={this.state.personajeDato} updatePersonajeDato={this.updatePersonajeDato} />)}
      </div>
    );
  }
}

export default RelationshipGraph;
