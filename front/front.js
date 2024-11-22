/*



   █████████      ███████████     █████
  ███░░░░░███    ░░███░░░░░███   ░░███ 
 ░███    ░███     ░███    ░███    ░███ 
 ░███████████     ░██████████     ░███ 
 ░███░░░░░███     ░███░░░░░░      ░███ 
 ░███    ░███     ░███            ░███ 
 █████   █████    █████           █████
░░░░░   ░░░░░    ░░░░░           ░░░░░ 



*/




const apiPath = 'dog';

const token = '4dIVcg2ZauTxdwElJGI2FgWq4jC3';



      //取得產品區塊內容


axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`)
  .then(res => {
    const productData = res.data.products;
    
    showProduct(productData);
  }).catch(err => {
    
  });

  

      //取得購物車區塊內容


axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
  .then(res => {
    
    cartData = res.data.carts;
    console.log(cartData);
    showCart(cartData);
   
  }).catch(err => {
    console.log(err);
  })



  












/*



 ███████████                                 █████     ███                     
░░███░░░░░░█                                ░░███     ░░░                      
 ░███   █ ░  █████ ████ ████████    ██████  ███████   ████   ██████  ████████  
 ░███████   ░░███ ░███ ░░███░░███  ███░░███░░░███░   ░░███  ███░░███░░███░░███ 
 ░███░░░█    ░███ ░███  ░███ ░███ ░███ ░░░   ░███     ░███ ░███ ░███ ░███ ░███ 
 ░███  ░     ░███ ░███  ░███ ░███ ░███  ███  ░███ ███ ░███ ░███ ░███ ░███ ░███ 
 █████       ░░████████ ████ █████░░██████   ░░█████  █████░░██████  ████ █████
░░░░░         ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░     ░░░░░  ░░░░░  ░░░░░░  ░░░░ ░░░░░ 



*/






//   展示產品列表區塊


const productList = document.querySelector('.js-showProduct');



function showProduct (productData) {
  let productHtml = '';

  productData.forEach(value => {
    productHtml += `
      <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${value.images}" alt="">
        <button class="addCardBtn js-addCart" data-product-id = ${value.id}>加入購物車</button>
        <h3>${value.title}</h3>
        <del class="originPrice">NT$${value.origin_price}</del>
        <p class="nowPrice">NT$${value.price}</p>
      </li>
    `;
  })

  productList.innerHTML = productHtml;



      //添加到購物車


  const addCart = document.querySelectorAll('.js-addCart');

  addCart.forEach(addBtn => {
    addBtn.addEventListener('click', () => {
      const productId = addBtn.dataset.productId;
      let sameProduct;

      
      cartData.forEach(value => {
        if (productId === value.product.id) sameProduct = value;
      });


      if (sameProduct) {
        axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`, {
          data: {
            productId: `${productId}`,
            quantity: Number(`${sameProduct.quantity += 1}`)
          }
        }).then(res => {
          
          cartData = res.data.carts;
          showCart(cartData);

        }).catch(err => {
          
        });
      } else {
        axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`, {
          data: {
            productId: `${productId}`,
            quantity: Number(1)
          }
        }).then(res => {
          

          cartData = res.data.carts;
          showCart(cartData);

        }).catch(err => {
          
        });
      }
    });
  });
};



      


//   購物車區塊


      //展示購物車內容


const table = document.querySelector('.js-table');


let cartData = [];

function showCart (res) {
  cartData = res;

  let cartContentHtml = '';

  let totalCost = 0;

  cartData.forEach(value => {
    totalCost += value.product.price * value.quantity;
    
    cartContentHtml += `
      <tr>
        <td>
          <div class="cardItem-title">
            <img src="${value.product.images}" alt="">
            <p>${value.product.title}</p>
          </div>
        </td>

        <td>NT$${value.product.price}</td>

        <td>${value.quantity}</td>

        <td>NT$${value.product.price * value.quantity}</td>

        <td class="discardBtn js-deleteItem" data-item-id = ${value.id}>
          <button class="material-icons" >
              clear
          </button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = `
    <tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>

    <div>${cartContentHtml}</div>

    <tr>
      <td>
          <button class="discardAllBtn js-deleteAll">刪除所有品項</button>
      </td>

      <td></td>

      <td></td>

      <td>
        <p>總金額</p>
      </td>

      <td>$${totalCost}</td>
    </tr>
  `;



        //刪除一項產品


  const deleteItem = document.querySelectorAll('.js-deleteItem');

  deleteItem.forEach(deleteBtn => {
    const itemId = deleteBtn.dataset.itemId;
    
    deleteBtn.addEventListener('click', () => {
      axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${itemId}`)
        .then(res => {
          
          cartData = res.data.carts;

          showCart(cartData);
        }).catch(err => {
          
        });
    });
  });



        //清空購物車


  const deleteAll = document.querySelector('.js-deleteAll');

  deleteAll.addEventListener('click', () => {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
    .then(res => {
      cartData = res.data.carts;

      showCart(cartData);
    }).catch(err => {
      
    })
  })
}


      


//   送出訂單區塊



const cusName = document.querySelector('.js-cusName');

const cusTel = document.querySelector('.js-tel');

const cusEmail = document.querySelector('.js-email');

const cusAddress = document.querySelector('.js-address');

const cusPaid = document.querySelector('.js-paid');

const orderForm = document.querySelector('.orderInfo-form');

const sentBtn = document.querySelector('.js-sentBtn');



function sentOrder () {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`, {
    data: {
      user: {
        name: `${cusName.value}`,
        tel: `${cusTel.value}`,
        email: `${cusEmail.value}`,
        address: `${cusAddress.value}`,
        payment: `${cusPaid.value}`
      }
    }
  }).then(res => {
    
    showCart([]);
  }).catch(err => {
    console.log(err);
  });

  orderForm.reset();
};




function checkValue () {
  const allInput = [
    cusName,
    cusTel,
    cusEmail,
    cusAddress
  ];

  allInput.forEach((input, index) => {
    const data = document.getElementsByClassName('orderInfo-message');
    
    if (input.value) data[index].classList.remove('d-b');

    else {
      if (input.getAttribute('name') === data[index].dataset.message) {
        data[index].classList.add('d-b');
      } 
    }
  });

  if (allInput.every(input => input.value !== '')) sentOrder();
};



sentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkValue();
});