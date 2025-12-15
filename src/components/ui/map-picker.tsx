"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Locate } from 'lucide-react'

// Define the shape of the Leaflet object on window
interface WindowWithLeaflet extends Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
}

interface MapPickerProps {
    onLocationSelect: (location: string) => void
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstanceRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markerRef = useRef<any>(null)
    const [isLeafletLoaded, setIsLeafletLoaded] = useState(false)
    const [isLocating, setIsLocating] = useState(false)

    useEffect(() => {
        // Check if Leaflet is already loaded globally
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).L) {
            setIsLeafletLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"]');
        if (existingScript) {
            // If script tag exists but L not yet ready, wait for it
            existingScript.addEventListener('load', () => setIsLeafletLoaded(true));
            return;
        }

        // 1. Inject Leaflet CSS
        if (!document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
            link.crossOrigin = "";
            document.head.appendChild(link);
        }

        // 2. Inject Leaflet JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        script.crossOrigin = "";
        script.async = true;

        script.onload = () => {
            setIsLeafletLoaded(true);
        };

        script.onerror = () => {
            console.error("Failed to load Leaflet map script");
        };

        document.body.appendChild(script);
    }, []);

    const updateLocation = useCallback((lat: number, lng: number) => {
        const locationString = `${lat},${lng}`;
        onLocationSelect(locationString);
    }, [onLocationSelect]);

    useEffect(() => {
        if (isLeafletLoaded && mapContainerRef.current && !mapInstanceRef.current && (window as unknown as WindowWithLeaflet).L) {
            const L = (window as unknown as WindowWithLeaflet).L;

            // Fix icon issues
            const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
            const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
            const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

            const DefaultIcon = L.icon({
                iconUrl,
                iconRetinaUrl,
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            L.Marker.prototype.options.icon = DefaultIcon;

            // Initialize Map
            const initialPos = [30.0444, 31.2357]; // Cairo
            const map = L.map(mapContainerRef.current).setView(initialPos, 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Add Marker
            const marker = L.marker(initialPos, { draggable: true }).addTo(map);
            markerRef.current = marker;

            // Handle map click
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.on('click', (e: any) => {
                marker.setLatLng(e.latlng);
                updateLocation(e.latlng.lat, e.latlng.lng);
                map.flyTo(e.latlng, map.getZoom());
            });

            // Handle marker drag
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            marker.on('dragend', (_e: any) => {
                const latLng = marker.getLatLng();
                updateLocation(latLng.lat, latLng.lng);
            });

            // Initial set
            updateLocation(initialPos[0], initialPos[1]);

            mapInstanceRef.current = map;

            setTimeout(() => {
                map.invalidateSize();
            }, 500);
        }
    }, [isLeafletLoaded, updateLocation]);



    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (mapInstanceRef.current && markerRef.current) {
                    const latLng = [latitude, longitude];
                    mapInstanceRef.current.flyTo(latLng, 16);
                    markerRef.current.setLatLng(latLng);
                    updateLocation(latitude, longitude);
                }
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLocating(false);
                let msg = "Could not get your location.";
                if (error.code === 1) msg = "Please enable GPS/Location permissions for this site.";
                else if (error.code === 2) msg = "Location unavailable. Please check your GPS.";
                else if (error.code === 3) msg = "Location request timed out.";
                alert(msg);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
        );
    };

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
            {!isLeafletLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground mt-2">Loading Map...</p>
                </div>
            )}

            <div ref={mapContainerRef} className="h-[300px] w-full z-0" />

            {/* Locate Me Button */}
            <button
                type="button"
                onClick={handleLocateMe}
                disabled={!isLeafletLoaded || isLocating}
                className="absolute bottom-4 right-4 z-[400] bg-white text-primary p-2 px-4 rounded-lg shadow-lg border border-gray-200 font-semibold text-sm hover:bg-gray-50 disabled:opacity-70 flex items-center gap-2 transition-all transform active:scale-95"
            >
                {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Locate className="w-4 h-4" />
                )}
                {isLocating ? "Locating..." : "Locate Me"}
            </button>
        </div>
    )
}
