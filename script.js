const foods = [{
        id: 'ravitoto',
        price: 5000,
        title: 'Ravitoto',
        spicy: true,
        vegetarian: false,
    },
    {
        id: 'pasta',
        price: 4000,
        title: 'Pasta',
        spicy: true,
        vegetarian: true,
    },
    {
        id: 'burger',
        price: 5000,
        title: 'Burger',
        spicy: false,
        vegetarian: false,
    },
    {
        id: 'rice',
        price: 2000,
        title: 'Rice and Leaves',
        spicy: false,
        vegetarian: true,
    },
    {
        id: 'mofogasy',
        price: 500,
        title: 'Mofogasy',
        spicy: false,
        vegetarian: true,
    },
];

const orders = [];

const foodList = document.querySelector('.food-list');
const orderList = document.querySelector('.order-list');
const totalElem = document.querySelector('.total');
const spicy = document.querySelector('#spicy');
const vegetarian = document.querySelector('#vegetarian');

// show the food elements from the list
const loadFoodList = e => {
    let filterFood = [...foods];
    if (spicy.checked) {
        filterFood = filterFood.filter(food => food.spicy);
    }

    if (vegetarian.checked) {
        filterFood = filterFood.filter(food => food.vegetarian);
    }

    const html = filterFood.map(food => {
        return `
			<li>
				<span>${food.title}
				<img class="icon" ${food.spicy ? '' : 'hidden'} src="./assets/flame.svg" alt="spicy ${food.title}">
				<img class="icon" ${food.vegetarian ? '' : 'hidden'} src="./assets/leaf.svg" alt="vegetarian ${food.title}">
				</span>
				<span>${food.price} Ar</span>
				<button value="${food.id}" class="add"> Add </button>
			</li>
		`;
    });
    foodList.innerHTML = html.join('');
};

// add a food element to the order
const addFoodToOrder = id => {
    // find the food tht has the same id
    const newOrder = foods.find(food => food.id === id);
    orders.push(newOrder);
    orderList.dispatchEvent(new CustomEvent('orderUpdated'));
};

// event delegation to handle click on a food list button
const handleListClick = e => {
    if (e.target.matches('button.add')) {
        addFoodToOrder(e.target.value);
    }
};

const showOrderList = () => {
    const instances = orders.reduce((acc, order) => {
        if (acc[order.id]) {
            acc[order.id]++;
        } else {
            acc[order.id] = 1;
        }
        return acc;
    }, {});
    console.log(instances);
    // change this object into an array
    const html = Object.entries(instances)
        // loop through each properties of this array
        .map(order => {
            const numberOfFood = order[1];
            // get the full object back, with its id
            const fullOrder = foods.find(food => food.id === order[0]);
            return `<li>
						<span>${fullOrder.title}</span>
						<span>x ${numberOfFood}</span> 
						<span>${fullOrder.price * numberOfFood} Ar</span>
					</li>`;
        })
        .join('');
    orderList.innerHTML = html;
};

const upDateTotal = () => {
    const total = orders.reduce((totalAcc, order) => {
        return totalAcc + order.price;
    }, 0);
    totalElem.textContent = `${total} Ar`;
};
orderList.addEventListener('orderUpdated', upDateTotal);

// ***** MODAL CODE *****

const outerModal = document.querySelector('.modal-outer');
const innerModal = document.querySelector('.modal-inner');
const orderButton = document.querySelector('.confirm');

const openModal = e => {
    const html = `
		<h2>Thank you!</h2>
		<p>Your order is confirmed.<br/>
		We will prepare your food, and deliver to you when it's ready.</p>
		<p>The total amount is <b>${totalElem.textContent}</b>.</p>
		<button>Close</button>
	`;
    innerModal.innerHTML = html;
    outerModal.classList.add('open');
};

const handleClick = e => {
    const isOutside = !e.target.closest('.modal-inner');
    if (isOutside) {
        outerModal.classList.remove('open');
    }
    if (e.target.matches('button')) {
        outerModal.classList.remove('open');
    }
};

const handleEscape = e => {
    if (e.key === 'Escape') {
        outerModal.classList.remove('open');
    }
};

// ******* LISTENERS *******

orderButton.addEventListener('click', openModal);
window.addEventListener('keydown', handleEscape);
outerModal.addEventListener('click', handleClick);
foodList.addEventListener('click', handleListClick);
orderList.addEventListener('orderUpdated', showOrderList);
spicy.addEventListener('change', loadFoodList);
vegetarian.addEventListener('change', loadFoodList);
window.addEventListener('DOMContentLoaded', loadFoodList);