package com.svalero.eventia.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.svalero.eventia.domain.Entrada;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
public class PdfEntradaService {

    public byte[] generarPdfEntrada(Entrada entrada) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 50, 50, 60, 50);
            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font tituloFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 30, Color.WHITE);
            Font subtituloFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.WHITE);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.GRAY);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, Color.WHITE);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.LIGHT_GRAY);

            PdfPTable ticket = new PdfPTable(2);
            ticket.setWidthPercentage(100);
            ticket.setWidths(new float[]{2.3f, 1f});
            ticket.setSpacingBefore(40);

            PdfPCell infoCell = new PdfPCell();
            infoCell.setBackgroundColor(new Color(18, 18, 26));
            infoCell.setPadding(26);
            infoCell.setBorder(Rectangle.NO_BORDER);

            Paragraph titulo = new Paragraph("EVENTIA PASS", tituloFont);
            titulo.setSpacingAfter(8);
            infoCell.addElement(titulo);

            Paragraph subtitulo = new Paragraph("Entrada digital", subtituloFont);
            subtitulo.setSpacingAfter(24);
            infoCell.addElement(subtitulo);

            addInfo(infoCell, "EVENTO", entrada.getEvento().getNombre(), labelFont, valueFont);
            addInfo(infoCell, "RECINTO", entrada.getEvento().getRecinto().getNombre(), labelFont, valueFont);
            addInfo(infoCell, "CIUDAD", entrada.getEvento().getRecinto().getCiudad(), labelFont, valueFont);
            addInfo(infoCell, "TIPO DE ENTRADA", String.valueOf(entrada.getTipoEntrada()), labelFont, valueFont);
            addInfo(infoCell, "PRECIO", entrada.getPrecio() + " €", labelFont, valueFont);
            addInfo(infoCell, "ESTADO", String.valueOf(entrada.getEstado()), labelFont, valueFont);

            Paragraph aviso = new Paragraph(
                    "Presenta este código QR en el acceso al evento.",
                    smallFont
            );
            aviso.setSpacingBefore(22);
            infoCell.addElement(aviso);

            PdfPCell qrCell = new PdfPCell();
            qrCell.setBackgroundColor(new Color(245, 245, 245));
            qrCell.setPadding(24);
            qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            qrCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            qrCell.setBorder(Rectangle.NO_BORDER);

            Image qrImage = generarQrComoImagen(entrada.getCodigoQr());
            qrImage.scaleAbsolute(170, 170);
            qrImage.setAlignment(Element.ALIGN_CENTER);

            Paragraph qrTitle = new Paragraph("SCAN TO ENTER",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY));
            qrTitle.setAlignment(Element.ALIGN_CENTER);
            qrTitle.setSpacingAfter(16);

            Paragraph codigo = new Paragraph(
                    entrada.getCodigoQr(),
                    FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY)
            );
            codigo.setAlignment(Element.ALIGN_CENTER);
            codigo.setSpacingBefore(12);

            qrCell.addElement(qrTitle);
            qrCell.addElement(qrImage);
            qrCell.addElement(codigo);

            ticket.addCell(infoCell);
            ticket.addCell(qrCell);

            document.add(ticket);

            Paragraph footer = new Paragraph(
                    "Documento generado automáticamente por Eventia.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de entrada", e);
        }
    }

    private void addInfo(
            PdfPCell cell,
            String label,
            String value,
            Font labelFont,
            Font valueFont
    ) {
        Paragraph labelParagraph = new Paragraph(label, labelFont);
        labelParagraph.setSpacingBefore(10);
        cell.addElement(labelParagraph);

        Paragraph valueParagraph = new Paragraph(value, valueFont);
        valueParagraph.setSpacingAfter(6);
        cell.addElement(valueParagraph);
    }

    private Image generarQrComoImagen(String codigoQr) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
                codigoQr,
                BarcodeFormat.QR_CODE,
                300,
                300
        );

        ByteArrayOutputStream qrOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrOutputStream);

        return Image.getInstance(qrOutputStream.toByteArray());
    }
}