export interface ProductoOption {
  label: string;
  value: string;
}

export interface ProductosModuleData {
  message: string;
  options: ProductoOption[];
}

export const ProductosModule = (): ProductosModuleData => {
  return {
    message: `Módulo de *Productos*: aquí puedes gestionar los productos del sistema. 
Selecciona una de las siguientes opciones para continuar:`,
    options: [
      { label: "Ver producto", value: "ver_producto" },
      { label: "Crear producto", value: "crear_producto" },
      { label: "Eliminar producto", value: "eliminar_producto" },
      { label: "Modificar producto", value: "modificar_producto" },
    ],
  };
};

// Función que maneja las opciones del módulo de productos
export const handleProductoOption = (value: string) => {
  const volverProductos = { label: "Volver a Productos", value: "productos" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_producto":
      return {
        text: `Ver producto:\n1️⃣ Ir al módulo de Productos >\n2️⃣ Seleccionar "Ver producto" >\n3️⃣ Consultar la lista de productos o buscar por nombre/código.`,
        options: [volverProductos, volverInicio],
      };
    case "crear_producto":
  return {
    text: `Crear producto:\n
>1️⃣ Ingresa al módulo de Productos.\n
>2️⃣ Haz clic en "Añadir Producto".\n
>3️⃣ Completa el formulario con todos los datos del nuevo producto.\n
>4️⃣ Haz clic en "Añadir Producto" para registrar el producto en el sistema.\n
✅ ¡Producto agregado exitosamente!`,
    options: [volverProductos, volverInicio],
  };

case "modificar_producto":
  return {
    text: `Modificar producto:\n
>1️⃣ Ingresa al módulo de Productos.\n
>2️⃣ Busca el producto que deseas modificar.\n
>3️⃣ Haz clic en el ícono de editar ✏️ junto al producto.\n
>4️⃣ Completa el formulario con los nuevos datos del producto y guarda los cambios.\n
✅ Producto modificado exitosamente.`,
    options: [volverProductos, volverInicio],
  };
    case "eliminar_producto":
  return {
    text: `Eliminar producto:\n
>1️⃣ Ingresa al módulo de Productos.\n
>2️⃣ Busca el producto que deseas eliminar.\n
>3️⃣ Haz clic en el ícono de basura 🗑️ junto al producto.\n
>4️⃣ Confirma la eliminación para quitar el producto del sistema.\n
✅ Producto eliminado exitosamente.`,
    options: [volverProductos, volverInicio],
  };
    default:
      return {
        text: `Has seleccionado una opción desconocida. Por favor elige otra opción.`,
        options: [volverProductos, volverInicio],
      };
  }
};
