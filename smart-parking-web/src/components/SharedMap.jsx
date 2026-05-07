import React, { useEffect, useRef } from 'react';

export default function SharedMap({ 
    center = [10.7729, 106.6592], 
    zoom = 17, 
    onMapReady, 
    className = "flex-1 w-full z-0 bg-gray-100",
    zoomControl = false 
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const loadLeaflet = () => {
            if (window.L) {
                initMap();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        };

        const initMap = () => {
            if (mapInstance.current || !mapRef.current) return;
            
            const L = window.L;
            mapInstance.current = L.map(mapRef.current, {
                center,
                zoom,
                zoomControl
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance.current);

            if (onMapReady) {
                onMapReady(mapInstance.current, L);
            }
        };

        loadLeaflet();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []); // Only run once on mount

    return <div ref={mapRef} className={className}></div>;
}
