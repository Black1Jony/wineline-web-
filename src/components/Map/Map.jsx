import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/api";
import { message } from "antd";

const MapModal = ({ onClose, userId }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [marker, setMarker] = useState(null);
  const [position, setPosition] = useState(
    JSON.parse(localStorage.getItem("userGeoposition"))?.coords || [
      51.505, -0.09,
    ]
  );
  const [address, setAddress] = useState(
    JSON.parse(localStorage.getItem("userGeoposition"))?.address || ""
  );

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await api.get(
        `/nominatim/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      if (res.data && res.data.display_name) {
        setAddress(res.data.display_name);
      }
    } catch (err) {
      console.error("Ошибка при получении адреса:", err);
      message.error("Не удалось получить адрес");
    }
  };

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map").setView(position, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setMapInstance(map);

    const initMarker = (coords) => {
      const m = L.marker(coords, { draggable: true })
        .addTo(map)
        .bindPopup("Перетащи маркер на нужное место")
        .openPopup();

      m.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
      });

      setMarker(m);
    };

    if (
      navigator.geolocation &&
      !JSON.parse(localStorage.getItem("userGeoposition"))
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          map.setView([latitude, longitude], 13);
          initMarker([latitude, longitude]);
          fetchAddress(latitude, longitude);
        },
        () => {
          initMarker(position);
          fetchAddress(position[0], position[1]);
        }
      );
    } else {
      initMarker(position);
      fetchAddress(position[0], position[1]);
    }

    return () => map.remove();
  }, []);

  const handleSave = async () => {
    try {
      // сохраняем в бэкенд
      await api.post("/geoposition", {
        id: userId,
        lat: position[0],
        lon: position[1],
        address,
      });

      // сохраняем в локалсторадже
      localStorage.setItem(
        "userGeoposition",
        JSON.stringify({ coords: position, address })
      );

      message.success("Геопозиция сохранена ✅");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Ошибка при сохранении ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-[80%] h-[75%] flex flex-col p-4 relative">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-3/4 p-2 border rounded bg-white shadow"
          placeholder="Адрес"
        />
        <div id="map" className="flex-1 mb-4 rounded" />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
