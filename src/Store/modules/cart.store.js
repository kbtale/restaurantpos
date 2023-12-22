const state = {
  products: [],
};

const getters = {
  getCartItems(state) {
    return state.products;
  },
  getCartTotalItems(state) {
    let qty = 0;
    state.products.forEach((item) => {
      qty += item.qty;
    });
    return qty;
  },
  getCartTotalPrice(state) {
    let price = 0;
    state.products.forEach((item) => {
      price += Number(item.sub_total);
    });
    return price;
  },
  getCartTotalCost(state) {
    let cost = 0;
    state.products.forEach((item) => {
      cost += Number(item.cost * item.qty);
      cost += Number(item.modifiers_cost);
    });
    return cost;
  },
};

const actions = {
  setCartItems({ commit }, payload) {
    commit('SET_PRODUCTS', payload);
  },
  unsetCartItems({ commit }) {
    commit('REMOVE_PRODUCTS');
  },
  setCartItem({ commit }, payload) {
    commit('ADD_PRODUCT', payload);
  },
  unsetCartItem({ commit }, payload) {
    commit('REMOVE_PRODUCT', payload);
  },
  updateCartItem({ commit }, payload) {
    commit('ITEM_UPDATE', payload);
  },
};

const mutations = {
  SET_PRODUCTS(state, items) {
    state.products = items;
  },
  REMOVE_PRODUCTS(state) {
    state.products = [];
  },

  ITEM_UPDATE(state, item) {
    state.products.map((product) => {
      if (item.id === product.id && item.uuid === product.uuid) {
        product.sub_total = 0;
        product.modifiers_price = 0;
        product.modifiers_cost = 0;
        product.sub_total = product.qty * product.price;
        if (product.modifiers.length) {
          product.modifiers.forEach((item) => {
            if (item.is_checked) {
              product.modifiers_price += Number(item.qty * item.price);
              product.modifiers_cost += Number(item.qty * item.cost);
            }
          });
          product.sub_total += Number(product.modifiers_price);
        }
      }
    });
  },
  ADD_PRODUCT(state, item) {
    let cat = {
      cart_uuid: item.id + item.uuid + new Date().getTime(),
      uuid: item.uuid,
      id: item.id,
      name: item.name,
      upc: item.upc,
      image: item.image,
      price: item.price,
      cost: item.cost,
      in_stock: item.in_stock,
      qty: 0,
      sub_total: 0,
      data: item,
      modifiers: item.modifiers,
      modifiers_price: 0,
      modifiers_cost: 0,
      is_ready: false,
    };

    state.products.map((product) => {
      if (item.id === product.id && item.uuid === product.uuid && !product.is_ready) {
        cat = product;
        state.products.splice(state.products.indexOf(cat), 1);
      }
    });
    cat.qty++;
    if (cat.modifiers.length) {
      cat.modifiers.forEach((item) => {
        if (item.is_checked) {
          cat.modifiers_price += Number(item.price * item.qty);
          cat.modifiers_cost += Number(item.cost * item.qty);
        }
      });
    }
    cat.sub_total = Number(cat.price * cat.qty);
    cat.sub_total += Number(cat.modifiers_price);
    state.products.push(cat);
  },

  REMOVE_PRODUCT(state, product) {
    state.products.splice(state.products.indexOf(product), 1);
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
