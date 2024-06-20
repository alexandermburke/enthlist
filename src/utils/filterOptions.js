const filterOptions = {
    company: [
        'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Cadillac', 'Chevrolet',
        'Dodge', 'Ferrari', 'Ford', 'Genesis', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Kia',
        'Lamborghini', 'Lexus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Volkswagen',
        'Mitsubishi', 'Nissan', 'Porsche', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota',
    ],
    
    year: [
        '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', 
        '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', 
        '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'
    ],
    status: ['clean', 'Rebuilt', 'Salvage', 'lemon', 'other'],
    exterior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
    interior: ['black', 'white', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
    seats: ['competition', 'base', 'recaro', 'sparco'],
    transmission: ['DCT', 'Manual', 'ZF8', 'Automatic']
};

const companyModelMapping = {
    'Acura': ['NSX', 'TLX'],
    'Alfa Romeo': ['Giulia', 'Stelvio'],
    'Aston Martin': ['DB11', 'Vantage'],
    'Audi': ['A4', 'R8'],
    'Bentley': ['Continental', 'Bentayga'],
    'BMW': ['1M', 'M2', 'M3', 'M4', 'M5', 'M6', 'M8', '135i', '235i', '335i', '435i', '535i', '540i', '550i', '635i', '650i'],
    'Cadillac': ['Escalade', 'CT5'],
    'Chevrolet': ['Camaro', 'Corvette'],
    'Dodge': ['Challenger', 'Charger'],
    'Ferrari': ['488', 'Roma'],
    'Ford': ['Mustang', 'GT350'],
    'Genesis': ['G70', 'GV80'],
    'Honda': ['Civic', 'Accord'],
    'Hyundai': ['Elantra', 'Tucson'],
    'Infiniti': ['Q50', 'QX60'],
    'Jaguar': ['F-Type', 'XE'],
    'Kia': ['Optima', 'Stinger'],
    'Lamborghini': ['Huracan', 'Aventador'],
    'Lexus': ['IS', 'RX'],
    'Maserati': ['Ghibli', 'Levante'],
    'Mazda': ['MX-5', 'CX-5'],
    'McLaren': ['720S', 'GT'],
    'Mercedes-Benz': ['C-Class', 'E-Class'],
    'Volkswagen': ['Golf', 'Passat'],
    'Mitsubishi': ['Lancer', 'Outlander'],
    'Nissan': ['GT-R', 'Altima'],
    'Porsche': ['911', 'Cayenne'],
    'Rolls-Royce': ['Ghost', 'Phantom'],
    'Subaru': ['Impreza', 'Forester'],
    'Tesla': ['Model S', 'Model 3'],
    'Toyota': ['Corolla', 'Camry']
};

const sortOptions = [
    { label: 'Price - Highest', value: 'price_desc' },
    { label: 'Price - Lowest', value: 'price_asc' },
    { label: 'Mileage - Highest', value: 'mileage_desc' },
    { label: 'Mileage - Lowest', value: 'mileage_asc' },
    { label: 'Year - Newest', value: 'year_desc' },
    { label: 'Year - Oldest', value: 'year_asc' }
];

export { filterOptions, companyModelMapping, sortOptions };
