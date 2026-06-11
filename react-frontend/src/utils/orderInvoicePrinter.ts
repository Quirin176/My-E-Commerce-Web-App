import type { OrderResponse } from "../types/models/order/OrderResponse";

const PRINT_STYLES = `
  body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 32px;
    color: #111;
}

.invoice {
    border: 1px solid #ddd;
    padding: 24px;
}

.invoice-header {
    text-align: center;
    margin-bottom: 24px;
}

.section {
    margin-bottom: 24px;
}

.item-row {
    display: grid;
    grid-template-columns: 1fr 150px 150px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.total-box {
    margin-top: 24px;
    text-align: right;
    font-size: 20px;
    font-weight: bold;
}
`;

export function generateInvoiceHtml(order: OrderResponse): string {
  return `
        <html>
          <head>
            <title>Order #${order.id} — Invoice</title>
            <style>${PRINT_STYLES}</style>
          </head>
          
          <body>
            <div class="invoice">
              <h1>INVOICE</h1>
  
              <div class="section">
                <h3>Order Information</h3>
                <p>Order #${order.id}</p>
                <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
              </div>

              <div class="section">
                <h3>Customer Information</h3>
                <p>${order.customerName}</p>
                <p>${order.customerEmail}</p>
                <p>${order.customerPhone}</p>
                <p>${order.shippingAddress}</p>
              </div>

              <div class="section">

                <div class="item-row" >
                  <h3>Product Name</h3>
                  <h3>Quantity × Price</h3>
                  <h3>SubTotal</h3>
                </div>

                ${order.items.map((item) =>
                  `<div
                  class="item-row"
                  key=${item.productId}
                  >
                    <span>${item.productName}</span>
                    <span>${item.quantity} × ${item.unitPrice.toLocaleString()}</span>
                    <span>${item.totalPrice.toLocaleString()}</span>
                  </div>`).join("")}
              </div>

              <div class="total-box">Total: ${order.totalAmount.toLocaleString()} VND</div>

            </div>
          </body>
        </html>
    `;
}

export function orderInvoicePrinter(order: OrderResponse) {

  const printWindow = window.open("", "", "width=800,height=800");
  if (!printWindow) return;

  printWindow.document.write(generateInvoiceHtml(order));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}