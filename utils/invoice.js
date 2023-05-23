const PDFDocument = require("pdfkit");
const fs = require('fs');

const { initializeApp } = require("firebase/app");
const { getDownloadURL, getStorage, ref, uploadBytes } = require("firebase/storage");

// const app = initializeApp(process.env.firebaseConfig);
const app = initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: "flutter-shop-f2274.appspot.com",
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
});

// Create a root reference
const storage = getStorage(app);

async function generateInvoice(order, next) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, order);
    generateInvoiceTable(doc, order);
    generateFooter(doc);

    // Write the PDF document to a buffer
    const buffer = [];

    // Create a reference to 'invoices/.pdf'
    const invoiceRef = ref(storage, `invoices/${order._id}.pdf`);

    doc.on('data', function (chunk) {
        buffer.push(chunk);
    });
    doc.end();

    doc.on('end', function () {
        // Convert the buffer to a Uint8Array
        const uint8Array = new Uint8Array(Buffer.concat(buffer));
        uploadBytes(invoiceRef, uint8Array).then((p0) => {
            return getDownloadURL(invoiceRef);
        }).then((url) => {
            order.invoiceLink = url;
            return order.save();
        }).then((order) => {
            return next();
        }).catch((e) => { })
    });


}

function generateHeader(doc) {
    doc
        .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Quick Shop", 110, 57)
        .fontSize(10)
        .text("Quick Shop Pvt Ltd.", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, order) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(order._id.toString().slice(10, 23).toUpperCase(), 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(0),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(order.name.toUpperCase(), 300, customerInformationTop)
        .font("Helvetica")
        .text(order.line1, 300, customerInformationTop + 15)
        .text(
            order.line2 + order.city +
            ",\n" +
            order.state +
            ", " +
            order.country,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < order.details.items.length; i++) {
        const item = order.details.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.id['title'],
            formatCurrency(item.id['price']),
            item.quantity,
            formatCurrency(item.id['price'] * item.quantity)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "Subtotal",
        "",
        formatCurrency(order.details['total'])
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "Paid To Date",
        "",
        formatCurrency(order.details.total)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "Balance Due",
        "",
        formatCurrency(0)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for Shopping.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(ruppees) {
    return `Rs. ${ruppees}`;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

module.exports = {
    generateInvoice
};