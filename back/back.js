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


axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`, {
  headers: {
    'authorization': token
  }
}).then(res => {
    orderData = res.data.orders;
    
    showpie();
    showOrder(orderData);
  }).catch(err => {

  });










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






      //展示訂單區塊



const backTable = document.querySelector('.js-backTable');

let orderData = [];

function showOrder (data) {
  let orderHtml = '';
  
  orderData = data;
  

  orderData.forEach(value => {
    let titleHtml = '';

    let ispaid = '';

    const orderPrducts = value.products;


    orderPrducts.forEach(value => {
      titleHtml += `
        <p>${value.title}</p>
      `;
    });



    if (value.paid) ispaid = '已處理';
    else ispaid = '未處理';



    orderHtml += `
      <tr>
        <td>${value.createdAt}</td>

        <td>
          <p>${value.user.name}</p>
          <p>${value.user.tel}</p>
        </td>

        <td>${value.user.address}</td>

        <td>${value.user.email}</td>

        <td>${titleHtml}</td>

        <td class="orderStatus">
          <button class="js-statusBtn" data-order-id=${value.id} data-paid= ${value.paid}>${ispaid}</button>
        </td>

        <td>
          <input type="button" class="delSingleOrder-Btn js-delBtn" data-order-id=${value.id} value="刪除">
        </td>
      </tr>
    `;
  });


  backTable.innerHTML = `
    <thead>
      <tr class="ordertitle">
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單狀態</th>
        <th>操作</th>
      </tr>

      ${orderHtml}
    </thead>
  `;






      //更改狀態按鈕



  const statusBtn = document.querySelectorAll('.js-statusBtn');


  function changeStatus (id, status) {
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`, {
      'data': {
        'id': id,
        'paid': status
      }},{
      headers: {
        'authorization': token
      }
    }).then(res => {
      orderData = res.data.orders;

      showOrder(orderData);
    }).catch(err => {
      console.log(err.response.data.message);
    });
  };

  

  statusBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      let paid = btn.dataset.paid;
      
      if (paid === 'true') {
        changeStatus(orderId, false);
        paid = 'false';
      } else {
        changeStatus(orderId, true);
        paid = 'true';
      }
    });
  });






      //刪除按鈕



  const delBtn = document.querySelectorAll('.js-delBtn');


  function deleteOrder (orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders/${orderId}`, {
      headers: {
        'authorization': token
      }
    }).then(res => {
      orderData = res.data.orders;
      showOrder(orderData);
      showpie();
    }).catch(err => {

    });
  };


  delBtn.forEach(delBtn => {
    const orderId = delBtn.dataset.orderId;
    delBtn.addEventListener('click', () => {
      deleteOrder(orderId);
      
    });
  });
};






     //清空訂單按鈕



const delAll = document.querySelector('.js-delAll');


function delAllBtn () {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`, {
    headers: {
      'authorization': token
    }
  }).then(res => {
    orderData = res.data.orders;
    showOrder(orderData);
    showpie();
  }).catch(err => {

  });
};


delAll.addEventListener('click', () => {
  delAllBtn();
});






      //展示圓餅圖區塊










function showpie () {
  const threeCat = {
    curtain: 0,
    storage: 0,
    bedstead: 0
  }
  
  orderData.forEach(order => {
    order.products.forEach(product => {
      if (product.category === '床架') threeCat.bedstead += product.quantity;
      else if (product.category === '窗簾') threeCat.curtain += product.quantity;
      else threeCat.storage += product.quantity;

    });
    
  });

  let chart1 = c3.generate({
    bindto: '.js-threeCat', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['床架', `${threeCat.bedstead}`],
        ['窗簾', `${threeCat.curtain}`],
        ['收納', `${threeCat.storage}`]
        ],
        colors:{
            '床架':"#DACBFF",
            '窗簾':"#9D7FEA",
            '收納': "#5434A7"
        },
        size: {
          width: 100
        }
    },
  });
};





























// function profitPie (orders) {
//   const allprofit = orders.reduce((allprofit, order) => {
    
//     order.products.forEach(product => {
//       const revenue = product.price * product.quantity;
  
//       if (allprofit[product.title]) {
//         allprofit[product.title] += revenue;
//       } else {
//         allprofit[product.title] = revenue;
//       }
//     });
  
//     return allprofit;
//   }, []);

//   const rank = Object.entries(allprofit)
//   .sort((a, b) => b[1] - a[1])
//   .map(([title, revenue]) => ({ title, revenue }));

// console.log(allprofit);
// console.log(rank);
//   let chart2 = c3.generate({
//     bindto: '.js-profit', // HTML 元素綁定
//     data: {
//         type: "pie",
//         columns: [
//         ['Louvre 雙人床架', 1],
//         ['Antony 雙人床架', 2],
//         ['Anty 雙人床架', 3],
//         ['其他', 4],
//         ],
//         colors:{
//             "Louvre 雙人床架":"#DACBFF",
//             "Antony 雙人床架":"#9D7FEA",
//             "Anty 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
//   });
// }