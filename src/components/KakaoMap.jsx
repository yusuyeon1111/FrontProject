import React, { useEffect, useRef } from 'react';
import useLocation from '../hooks/useLocation';

const { kakao } = window;
function KakaoMap() {
  const mapRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(location.latitude, location.longitude),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);
        mapRef.current = map;

        const markerPosition = new kakao.maps.LatLng(location.latitude, location.longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition
        })
        marker.setMap(map)
      });
    }
  }, [location]);

  return <div id="map" style={{ width: "70%", height: "50%" }}></div>;
}

export default KakaoMap;
