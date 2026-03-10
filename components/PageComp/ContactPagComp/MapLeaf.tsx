"use client"

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

export default function MapLeaf() {

    useEffect(() => {
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    return (
        <MapContainer 
            center={[47.5007394121694, -0.5936152669960074]} 
            zoom={13} 
            scrollWheelZoom={false} 
            // 3. HAUTEUR OBLIGATOIRE et z-index bas pour ne pas passer au dessus du menu
            className="h-60 w-full rounded-lg z-0 relative"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[47.5007394121694, -0.5936152669960074]}>
                <Popup>
                    Stade Auguste Delaune <br /> Les Foulées Avrillaises
                </Popup>
            </Marker>
        </MapContainer>
    )
}