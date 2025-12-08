import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Venta, ProductoVentaHist, ServicioVentaHist } from "../types/ventas";
import { imageToBase64 } from "./imageToBase64";

// 📘 Generar PDF con diseño corporativo moderno
export const generarHistorialVentasPDF = async (ventas: Venta[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  // 🎨 Colores corporativos
const primary: [number, number, number] = [30, 80, 160];     // Azul profesional
const secondary: [number, number, number] = [230, 230, 230]; // Gris claro
const textGray: [number, number, number] = [80, 80, 80];  

  // ==========================
  // 🔹 ENCABEZADO CORPORATIVO
  // ==========================
  try {
    const logoBase64 = await imageToBase64("/Logo5.png");
    doc.addImage(logoBase64, "PNG", 15, 10, 28, 28);
  } catch (err) {
    console.error("No se pudo cargar el logo:", err);
  }

  // Línea decorativa superior
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 6, "F");

  // Nombre empresarial elegante
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("BlueLock - Servicios de Cerrajería", 50, 20);

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.text("Historial de movimiento de ventas", 50, 28);

  // Línea divisoria inferior
  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(0.7);
  doc.line(15, 42, doc.internal.pageSize.getWidth() - 15, 42);

  // ==========================
  // 🔹 INFORMACIÓN DEL REPORTE
  // ==========================
  const fechaEmision = new Date().toLocaleString();
  const usuario = localStorage.getItem("nombre") || "Usuario desconocido";

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(90);

  doc.text(`Reporte: Historial de Ventas`, 15, 50);
  doc.text(`Generado por: ${usuario}`, 15, 56);
  doc.text(`Fecha de emisión: ${fechaEmision}`, 15, 62);

  // Línea antes de la tabla
  doc.setDrawColor(180);
  doc.line(15, 67, doc.internal.pageSize.getWidth() - 15, 67);

  // ==========================
  // 🔹 TABLA DE DATOS
  // ==========================
  const tableColumn = [
    "Cliente",
    "D.I",
    "Total Bs",
    "Total USD",
    "Productos",
    "Servicios",
    "Fecha",
    "Tipo",
    "Nota",
  ];

  

  const tableRows: (string | number)[][] = [];

  ventas.forEach((venta) => {
    const cantProductos =
      venta.productos?.reduce(
        (acc: number, p: ProductoVentaHist) => acc + (p.cantidad ?? 1),
        0
      ) || 0;

    const cantServicios =
      venta.servicios?.reduce(
        (acc: number, s: ServicioVentaHist) => acc + (s.cantidad ?? 1),
        0
      ) || 0;

    const ventaData: (string | number)[] = [
      `${venta.cliente.nombre} ${venta.cliente.apellido}`,
      venta.cliente.rif,
      venta.total_bs,
      venta.total_usd,
      cantProductos,
      cantServicios,
      new Date(venta.fechaVenta).toLocaleDateString(),
      venta.tipo_venta,
      venta.nota || "-",
    ];

    tableRows.push(ventaData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 72,
    styles: {
      fontSize: 10,
      halign: "center",
      textColor: 40,
    },
    headStyles: {
      fillColor: primary,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: secondary,
    },
    margin: { left: 12, right: 12 },
  });

  // ==========================
  // 🔹 FOOTER CORPORATIVO
  // ==========================
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(9);
    doc.setTextColor(130);

    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - 35,
      doc.internal.pageSize.getHeight() - 8
    );

    doc.text(
      "Reporte generado automáticamente por BlueLock — Sistema de Gestión Comercial",
      12,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  // Guardar
  doc.save("historial_ventas.pdf");
};
