const filterOptions = {
    company: ['BMW', 'Ford', 'Audi'],
    model: ['M3', 'R8', 'GT350'],
    year: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
    status: ['clean', 'Rebuilt', 'Salvage'],
    exterior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'other'],
    interior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'other'],
    seats: ['competition', 'base', 'recaro', 'sparco'],
    transmission: ['DCT', 'Manual', 'ZF8', 'Automatic']
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
