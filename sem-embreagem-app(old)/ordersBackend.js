// ordersBackend.js

let orders = []; // Armazena os pedidos

// Adiciona um novo pedido
export const addOrder = (description) => {
  console.log(description);
  const newOrder = {
    id: orders.length + 1,
    description,
    status: 'Aguardando',
  };
  orders.push(newOrder);
  return newOrder;
};

// Retorna a lista de todos os pedidos
export const getOrders = () => {
  return orders;
};

// Atualiza o status de um pedido pelo ID
export const updateOrderStatus = (id) => {
  orders = orders.map((order) => {
    if (order.id === id) {
      switch (order.status) {
        case 'Aguardando':
          order.status = 'Em preparo';
          break;
        case 'Em preparo':
          order.status = 'A caminho';
          break;
        case 'A caminho':
          order.status = 'Entregue';
          break;
        default:
          break;
      }
    }
    return order;
  });
};
