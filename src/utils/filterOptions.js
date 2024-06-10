const filterOptions = {
    company: ['BMW', 'Ford', 'Audi'],
    model: ['M3', 'A4', 'C-Class'],
    year: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
    status: ['clean', 'Rebuilt', 'Salvage'],
    miles: ['10,000', '20,000', '30,000'],
    exterior: ['white', 'black', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'other'],
    interior: ['black', 'white', 'red'],
    seats: ['competition', 'base', 'recaros'],
    transmission: ['DCT', 'Manual', 'ZF8', 'Automatic'],
    price: ['$50,000', '$60,000', '$70,000']
};

const sortOptions = [
    { label: 'Price - Highest', value: 'price_desc' },
    { label: 'Price - Lowest', value: 'price_asc' },
    { label: 'Mileage - Highest', value: 'mileage_desc' },
    { label: 'Mileage - Lowest', value: 'mileage_asc' },
    { label: 'Year - Newest', value: 'year_desc' },
    { label: 'Year - Oldest', value: 'year_asc' }
];

export { filterOptions, sortOptions };
