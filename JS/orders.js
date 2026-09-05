// =====================================================
// My Orders Logic
// =====================================================

const ordersContainer = document.getElementById("api-orders-container");

function getOrders() {
  // Grab only the new orders placed on this device
  const localOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

  // Display them
  displayOrders(localOrders);
}
// the function itself
function displayOrders(ordersToDisplay) {
  ordersContainer.innerHTML = "";

  // Handle empty state
  if (!ordersToDisplay || ordersToDisplay.length === 0) {
    ordersContainer.innerHTML = `
      <div class="text-center p-5">
        <h4 class="text-muted fw-bold">No Past Orders Found</h4>
        <p class="text-secondary">Looks like you haven't ordered anything yet!</p>
      </div>
    `;
    return;
  }

  ordersToDisplay.forEach((order) => {
    // Format the items list
    const itemsList = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    // Determine the badge class based on status
    let badgeClass = "";
    if (order.status === "Delivered") badgeClass = "orderDelivered";
    else if (order.status === "Cancelled") badgeClass = "orderCancelled";
    else badgeClass = "bg-warning text-dark";

    // Only show the cancel button if the order is NOT Cancelled or Delivered
    let cancelButtonHTML = "";
    let deleteButtonHTML = "";

    // Show Cancel button if order is still active
    if (order.status !== "Delivered" && order.status !== "Cancelled") {
      cancelButtonHTML = `
    <button
      class="btn btn-outline-danger w-50 w-70 btn-sm mt-2 transition"
      onclick="cancelOrder('${order.orderId}')"
    >
      Cancel Order
    </button>
  `;
    }

    // Show Delete button ONLY after order is cancelled
    if (order.status === "Cancelled") {
      deleteButtonHTML = `
    <button
      class="btn btn-outline-danger deleteOrderBtn mt-2"
      onclick="deleteOrder('${order.orderId}')"
      title="Delete Order"
      aria-label="Delete Order"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  `;
    }

    // Build the HTML Card
    const orderHTML = `
      <div class="card orderCard shadow-sm border-0 p-2">

        <div class="card-body">

          <div class="row align-items-center justify-content-lg-between">

            <!-- Order Information -->
            <div class="row col-lg-9 justify-content-between">

              <div class="col-lg-4 col-md-4 col-6 mb-3 mb-lg-0">

                <h5 class="fw-bold mb-1 text-dark">
                  Order #${order.orderId}
                </h5>

                <p class="text-muted small mb-2">
                  ${order.date} - ${order.time}
                </p>

                <p
                  class="text-secondary mb-0"
                  style="font-size: 0.95rem"
                >
                  ${itemsList}
                </p>

              </div>

              <!-- Status & Price -->
              <div
                class="col-lg-8 row col-6 col-md-8 text-end
                       text-md-center align-items-md-center
                       justify-content-md-center"
              >

                <div
                  class="col-lg-6 col-md-6 col-12
                         mb-3 mb-md-0 p-0"
                >
                  <span class="badge orderBadge ${badgeClass}">
                    ${order.status}
                  </span>
                </div>

                <div
                  class="col-lg-6 col-md-6 col-12
                         mb-3 mb-md-0 text-md-end text-lg-center"
                >
                  <span class="fs-5 fw-bold text-dark">
                    $${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>

              </div>

            </div>

            <!-- Buttons -->
            <div
                class="col-lg-3 d-flex flex-column align-items-center"
              >
                <button
                  class="btn orderViewBtn w-50 w-70 transition"
                  onclick="viewOrderDetails('${order.orderId}')"
                >
                  View Details
                </button>

                ${cancelButtonHTML}

                ${deleteButtonHTML}
              </div>
 </div>
  </div>
  </div>
    `;

    ordersContainer.innerHTML += orderHTML;
  });
}

function viewOrderDetails(orderId) {
  // Grab all orders from local storage
  const localOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

  // Find the exact order that matches the button clicked
  const targetOrder = localOrders.find((order) => order.orderId === orderId);

  const modalContentContainer = document.getElementById("modalOrderContent");

  if (targetOrder && targetOrder.customerName) {
    // Format the items list for the modal
    const modalItemsList = targetOrder.items
      .map(
        (item) =>
          `<li class="text-secondary mb-1">${item.quantity}x ${item.name}</li>`,
      )
      .join("");

    // Inject data into the modal body
    modalContentContainer.innerHTML = `
      <div class="p-3 bg-light rounded-3">
        <p class="mb-1 text-muted small">Order ID</p>
        <h6 class="fw-bold text-dark mb-3">#${targetOrder.orderId}</h6>

        <p class="mb-1 text-muted small">Customer Name</p>
        <h6 class="fw-bold text-dark mb-3">${targetOrder.customerName}</h6>

        <p class="mb-1 text-muted small">Phone Number</p>
        <h6 class="fw-bold text-dark mb-3">${targetOrder.customerPhone}</h6>

        <p class="mb-1 text-muted small">Delivery Address</p>
        <h6 class="fw-bold text-dark mb-3">${targetOrder.customerAddress}</h6>

        <p class="mb-1 text-muted small">Ordered Items</p>
        <ul class="ps-3 mb-3">${modalItemsList}</ul>

        <hr class="my-2">
        
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="fw-bold text-dark">Total Price:</span>
          <span class="fs-5 fw-bold text-color">$${targetOrder.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    `;
  } else {
    modalContentContainer.innerHTML = `
      <div class="text-center py-4">
        <p class="text-secondary">Customer details were not saved for this older test order.</p>
      </div>
    `;
  }

  // Automatically trigger and show the Bootstrap Modal
  const myModal = new bootstrap.Modal(
    document.getElementById("orderDetailsModal"),
  );
  myModal.show();
}
// =====================================================
// Cancel Order Logic
// =====================================================
function cancelOrder(orderId) {
  // 1. Ask the user to confirm before doing anything
  const confirmCancel = confirm(
    "Are you sure you want to cancel Order #" + orderId + "?",
  );
  if (!confirmCancel) return; // If they click 'Cancel' on the popup, stop the function

  // 2. Grab the orders from local storage
  let localOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

  // 3. Find the exact order and update its status
  localOrders = localOrders.map((order) => {
    if (order.orderId === orderId) {
      order.status = "Cancelled";
    }
    return order;
  });

  // 4. Save the updated list back to local storage
  localStorage.setItem("myOrders", JSON.stringify(localOrders));

  // 5. Refresh the UI to show the new Cancelled badge!
  getOrders();
}
// =====================================================
// Delete Order Permanently
// =====================================================

function deleteOrder(orderId) {
  const confirmDelete = confirm(
    "Are you sure you want to permanently delete Order #" + orderId + "?",
  );

  if (!confirmDelete) return;

  let localOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

  localOrders = localOrders.filter((order) => order.orderId !== orderId);

  localStorage.setItem("myOrders", JSON.stringify(localOrders));

  getOrders();
}
// Run on page load
getOrders();
