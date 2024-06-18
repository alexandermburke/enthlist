const filterOptions = {
    company: [
        'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Cadillac', 'Chevrolet',
        'Dodge', 'Ferrari', 'Ford', 'Genesis', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Kia',
        'Lamborghini', 'Lexus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Volkswagen',
        'Mitsubishi', 'Nissan', 'Porsche', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota',
    ],
    
    model: ['M3', 'R8', 'GT350'],
    year: [
        '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', 
        '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', 
        '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'
    ],
    status: ['clean', 'Rebuilt', 'Salvage', 'lemon'],
    exterior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
    interior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
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
