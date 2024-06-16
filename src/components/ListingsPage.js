import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import BrowseListings from './BrowseListings';
import Hero from './Hero';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const listingsSnapshot = await getDocs(listingsCollection);
                const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()[doc.id] }));
                setListings(listingsData);
                setFilteredListings(listingsData); // Initialize filteredListings with all listings
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };
        fetchListings();
    }, []);

    const handleSearch = (searchQuery) => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const searchResults = listings.filter(listing => {
            const { applicationMeta } = listing;
            return Object.values(applicationMeta).some(value => 
                value.toString().toLowerCase().includes(lowercasedQuery)
            );
        });
        setFilteredListings(searchResults);
    };

    return (
        <div>
            <Hero onSearch={handleSearch} />
            <BrowseListings listings={filteredListings} />
        </div>
    );
}
