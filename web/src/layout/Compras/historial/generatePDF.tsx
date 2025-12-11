// 🔵 GenerarPDFCompras.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Compra } from "../../../types/compras";
import { imageToBase64 } from "../../../utils/imageToBase64";

export const generarHistorialComprasPDF = async (compras: Compra[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const primary: [number, number, number] = [30, 80, 160];
  const secondary: [number, number, number] = [230, 230, 230];
  const textGray: [number, number, number] = [80, 80, 80];

  try {
    const logoBase64 = await imageToBase64("/Logo5.png");
    doc.addImage(logoBase64, "PNG", 15, 10, 28, 28);
  }catch{
    console.log("error")
  }

  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("BlueLock", 50, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.text("Historial de movimiento de compras", 50, 28);

  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(0.7);
  doc.line(15, 42, doc.internal.pageSize.getWidth() - 15, 42);

  const fechaEmision = new Date().toLocaleString();
  const usuario = localStorage.getItem("nombre") || "Usuario desconocido";

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(90);

  doc.text(`Reporte: Historial de Compras`, 15, 50);
  doc.text(`Generado por: ${usuario}`, 15, 56);
  doc.text(`Fecha de emisión: ${fechaEmision}`, 15, 62);

  doc.setDrawColor(180);
  doc.line(15, 67, doc.internal.pageSize.getWidth() - 15, 67);

  // =====================
  // 🔹 TABLA
  // =====================

  const tableColumn = [
    "Proveedor",
    "Teléfono",
    "Total",
    "Materiales",
    "Productos",
    "Fecha",
  ];

  const tableRows: (string | number)[][] = [];

  compras.forEach((compra) => {
    const totalMateriales =
      compra.materiales?.reduce((acc, m) => acc + (m.cantidad ?? 1), 0) || 0;

    const totalProductos =
      compra.productos?.reduce((acc, p) => acc + (p.cantidad ?? 1), 0) || 0;

    // ➤ FORMATEO DE PRECIOS
    const dollarOficial = Number(localStorage.getItem("dollar_oficial") || 0);

    const totalUsdFormatted = `$${Number(compra.totalUsd).toFixed(2)}`;

    const totalBs = Number(compra.totalUsd) * dollarOficial;

    const totalBsFormatted =
      totalBs.toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " Bs";

    // Mostrar ambos valores en la misma celda
    const precioMostrado = `${totalUsdFormatted}\n${totalBsFormatted}`;

    const row = [
      compra.proveedor?.nombre || "N/A",
      compra.proveedor?.telefono || "N/A",
      precioMostrado,
      totalMateriales,
      totalProductos,
      new Date(compra.fecha).toLocaleDateString(),
    ];

    tableRows.push(row);
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

  doc.save("historial_compras.pdf");
};
