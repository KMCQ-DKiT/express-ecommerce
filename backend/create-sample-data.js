const { faker } = require("@faker-js/faker");

const clothingItems = [];

for (let i = 0; i < 10; i++) {
    clothingItems.push({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        image: faker.image.url({ width: 200, height: 200 }),
    });
}

// clothingItems.forEach((clothingItem) => console.log(clothingItem));

fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(clothingItems),
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
