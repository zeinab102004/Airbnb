'use client';
import { useState } from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import { ListingCardItem, SearchResultData } from '../types/app';
import { getCenter } from 'geolib';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';

const Map = ({ searchResultData }: { searchResultData: SearchResultData }) => {
  if (!searchResultData || searchResultData.length === 0) {
    return <p>No data available</p>;
  }

  const validListings = searchResultData.filter(
    (listing) => typeof listing.lat === 'number' && typeof listing.long === 'number'
  );

  const coordinates = validListings.map((listing) => ({
    longitude: listing.long,
    latitude: listing.lat,
  }));

  if (coordinates.length === 0) {
    return <p>No valid coordinates</p>;
  }

  const center = getCenter(coordinates);

  if (!center) {
    return <p>Loading map center...</p>;
  }

  const [selectedLocation, setSelectedLocation] =
    useState<ListingCardItem | null>(null);

  const [viewport, setViewPort] = useState({
    width: '100%',
    height: '100%',
    zoom: 11,
    longitude: center.longitude,
    latitude: center.latitude,
  });

  return (
    <MapGL
      {...viewport}
      mapStyle='mapbox://styles/kareem2002shimes/cl9ogfais007a14o2dcf0byo6'
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      onLoad={() => {
        console.log('✅ Map fully loaded');
      }}
      onMove={(nextViewport) =>
        setViewPort((prev) => ({
          ...prev,
          longitude: nextViewport.viewState.longitude,
          latitude: nextViewport.viewState.latitude,
        }))
      }
    >
      {validListings.map((listing) => (
        <div key={`${listing.lat}-${listing.long}`}>
          <Marker longitude={listing.long} latitude={listing.lat}>
            <div
              onClick={() => setSelectedLocation(listing)}
              className='animate-bounce cursor-pointer'
            >
              <Image
                src='/mapMarker.png'
                alt='map-marker'
                width={24}
                height={24}
              />
            </div>
          </Marker>

          {selectedLocation?.long === listing.long ? (
            <Popup
              closeOnClick={false}
              onClose={() => setSelectedLocation(null)}
              longitude={listing.long}
              latitude={listing.lat}
            >
              {listing.title}
            </Popup>
          ) : null}
        </div>
      ))}
    </MapGL>
  );
};

export default Map;
