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
    exterior: ['black', 'white', 'silver', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
    interior: ['black', 'white', 'silver', 'blue', 'grey', 'red', 'orange', 'yellow', 'green', 'biege', 'brown'],
    seats: ['competition', 'base', 'recaro', 'sparco'],
    transmission: ['DCT', 'Manual', 'ZF8', 'Automatic']
};

const companyModelMapping = {
    'Acura': ['NSX', 'TLX', 'Integra', 'RSX'],
    'Alfa Romeo': ['Giulia', 'Stelvio', '4C', '8C'],
    'Aston Martin': ['DB11', 'Vantage', 'DBS', 'Vanquish'],
    'Audi': ['A4', 'R8', 'RS5', 'RS7', 'RSQ8', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    'Bentley': ['Continental', 'Bentayga', 'Flying Spur', 'Mulsanne'],
    'BMW': ['1M', 'M2', 'M3', 'M4', 'M5', 'M6', 'M8', '135i', '235i', '335i', '435i', '535i', '540i', '550i', '635i', '650i'],
    'Cadillac': ['Escalade', 'CT5', 'CTS-V', 'ATS-V'],
    'Chevrolet': ['Camaro', 'Corvette', 'SS', 'Impala SS'],
    'Dodge': ['Challenger', 'Charger', 'Viper', 'Durango SRT'],
    'Ferrari': ['488', 'Roma', 'F8 Tributo', 'SF90', 'Portofino'],
    'Ford': ['Mustang', 'GT350', 'GT500', 'Ford GT', 'Focus RS'],
    'Genesis': ['G70', 'GV80', 'G80', 'G90'],
    'Honda': ['Civic', 'Accord', 'S2000', 'NSX', 'Prelude'],
    'Hyundai': ['Elantra', 'Tucson', 'Veloster N', 'Genesis Coupe'],
    'Infiniti': ['Q50', 'QX60', 'Q60', 'G37'],
    'Jaguar': ['F-Type', 'XE', 'XJ', 'XF', 'F-Pace SVR'],
    'Kia': ['Optima', 'Stinger', 'K900'],
    'Lamborghini': ['Huracan', 'Aventador', 'Urus', 'Gallardo', 'Murcielago'],
    'Lexus': ['IS', 'RX', 'LC500', 'LFA', 'RC F'],
    'Maserati': ['Ghibli', 'Levante', 'Quattroporte', 'GranTurismo'],
    'Mazda': ['MX-5', 'CX-5', 'RX-7', 'RX-8', 'Mazda3'],
    'McLaren': ['720S', 'GT', '570S', '600LT', 'P1'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'AMG GT', 'CLA 45', 'GLA 45', 'GLE 63', 'SLS AMG'],
    'Volkswagen': ['Golf', 'Passat', 'GTI', 'R32'],
    'Mitsubishi': ['Lancer', 'Outlander', 'Eclipse', '3000GT'],
    'Nissan': ['GT-R', 'Altima', '370Z', '350Z', '240SX'],
    'Porsche': ['911', 'Cayenne', '718 Cayman', 'Panamera', 'Taycan'],
    'Rolls-Royce': ['Ghost', 'Phantom', 'Wraith', 'Dawn'],
    'Subaru': ['Impreza', 'Forester', 'WRX', 'BRZ'],
    'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y'],
    'Toyota': ['Corolla', 'Camry', 'Supra', '86', 'MR2', 'Celica']
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
