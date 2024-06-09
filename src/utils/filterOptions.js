const filterOptions = {
    company: ['BMW', 'Ford', 'Audi'],
    model: ['M3', 'A4', 'C-Class'],
    year: ['2018', '2019', '2020'],
    status: ['clean', 'used', 'new'],
    miles: ['10,000', '20,000', '30,000'],
    exterior: ['alpine white', 'black', 'blue'],
    interior: ['black', 'white', 'red'],
    seats: ['competition', 'standard', 'luxury'],
    transmission: ['DCT', 'manual', 'automatic'],
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
