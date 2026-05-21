"use client";

export default function PrintReceiptButton({ reservation }) {
  function handlePrint() {
    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Reservation Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
            }
            .receipt {
              max-width: 500px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 10px;
            }
            h1 {
              text-align: center;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              border-bottom: 1px dashed #ddd;
              padding-bottom: 8px;
            }
            .status {
              text-transform: uppercase;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>Electric Shop</h1>
            <h3>Reservation Receipt</h3>

            <div class="row">
              <span>Name</span>
              <b>${reservation.name || "N/A"}</b>
            </div>

            <div class="row">
              <span>Phone</span>
              <b>${reservation.phone || "N/A"}</b>
            </div>

            <div class="row">
              <span>Product</span>
              <b>${reservation.product?.name || "Product deleted"}</b>
            </div>

            <div class="row">
              <span>Quantity</span>
              <b>${reservation.quantity}</b>
            </div>

            <div class="row">
              <span>Status</span>
              <b class="status">${reservation.status}</b>
            </div>

            <div class="row">
              <span>Date</span>
              <b>${new Date(reservation.createdAt).toLocaleDateString()}</b>
            </div>

            <p style="text-align:center;margin-top:25px;">
              Thank you for your reservation!
            </p>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
    >
      Print
    </button>
  );
}