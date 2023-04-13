const React = require("react");
const ReactDOM = require("react-dom");

function Modal(props) {
    // Obtener el elemento div donde se renderizará el modal
    const modalRoot = document.body;
  
    // Crear un elemento div para contener el contenido del modal
    const modalContainer = document.createElement('div');
  
    // Añadir algunos estilos al contenedor del modal
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.zIndex="1000",
    modalContainer.style.left = '0';
    modalContainer.style.boxSizing = "border-box";
    modalContainer.style.width = '100vw';
    modalContainer.style.height = '100vh';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.overflowY = "auto";
  
    // Usar el hook useEffect para añadir y eliminar el contenedor del modal al div raíz
    React.useEffect(() => {
      // Añadir el contenedor del modal al div raíz al montar el componente
      modalRoot.appendChild(modalContainer);
  
      // Eliminar el contenedor del modal al desmontar el componente
      return () => {
        modalRoot.removeChild(modalContainer);
      };
    }, [modalContainer, modalRoot]);
  
    // Usar createPortal para renderizar los hijos del componente Modal en el contenedor del modal
    return ReactDOM.createPortal(props.children, modalContainer);
  }
  
  export default Modal;