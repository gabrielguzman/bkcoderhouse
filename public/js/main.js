const socket = io();

socket.emit('message','Nuevo cliente conectado');

function addProduct() {
  event.preventDefault();
  const thumbnails = document.getElementById("thumbnails").value;
  const thumbnailsArray = thumbnails.split(",");
  try {
    const product = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      price: document.getElementById("price").value.trim(),
      thumbnail: thumbnailsArray,
      code: document.getElementById("code").value.trim(),
      category: document.getElementById("category").value.trim(),
      stock: document.getElementById("stock").value.trim(),
    };

    socket.emit("addproduct", product);
    document.getElementById("productForm").reset();

  } catch (error) {
    socket.emit("error", error);
  }
}

function deleteProduct(id) {
  socket.emit("deleteproduct", id);
}

socket.on("products", (products) => {
  let body = document.getElementById("bodyproducts");
  let content = "";
  if (products.length > 0) {
    products.forEach((product) => {
      content += `
        <tr>
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>${product.description}</td>
          <td>${product.price}</td>
          <td>${product.thumbnail}</td>
          <td>${product.code}</td>
          <td>${product.category}</td>
          <td>${product.stock}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Eliminar</button></td>
        </tr>
      `;
    });
  } else {
    content = "<tr><td colspan='9'>No se encontraron productos</td></tr>";
  }
  body.innerHTML = content;
});

socket.on('error',(data)=>{
  alert(data);
})

socket.on('success', (data) => {
  alert(JSON.stringify(data));
});

