import { Hospital, MerReportDate, HawaiiObject } from "@sarr-app-hackathon-project/sdk";
import { useEffect, useRef, useState } from "react";
import client from "../client.ts";
import 'leaflet-contextmenu';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import css from "../Home.module.css";
import { HospitalMapIcon, EmergencyMapIcon } from "./MapIcons.tsx";

interface HospitalType {
  id: string;
  name: string;
  city: string;
  state: string;
  beds: number;
  helipad: boolean;
  trauma: string;
  type: string;
  geopoint: { type: string, coordinates: [number, number] } | undefined;
}

// interface MerReportType {
//   lat: string;
//   long: string;
//   fatalities?: number;
//   injured?: number;
//   unit_assigned?: string;
// }


interface UnitType {
  uicName: string;
  equipmentFamily: string;
  equipmentDescription: string;
  totalOnHand: number;
  unitLatitude: number;
  unitLongitude: number;
}

function Reports() {
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [merReports, setMerReports] = useState<MerReportDate[]>([]);
  const [units, setUnits] = useState<UnitType[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const merReportMarkers = useRef<L.Marker[]>([]); // Store all MER report markers

  const center = { lat: 19.5, long: -155.5 };
  const radius = 55000;

  useEffect(() => {
    async function fetchHospitals() {
      const objects: HospitalType[] = [];
      for await (const obj of client(Hospital).asyncIter()) {
        const hospital = obj as HospitalType;
        if (hospital.state === "HI") {
          objects.push(hospital);
        }
      }
      setHospitals(objects);
    }
    fetchHospitals();
  }, []);

  useEffect(() => {
    async function fetchUnits() {
      const objects: UnitType[] = [];
      for await (const obj of client(HawaiiObject).asyncIter()) {
        const unit = obj as UnitType;
        objects.push(unit);
      }
      setUnits(objects);
    }

    fetchUnits();
  }, []);

  useEffect(() => {
    async function fetchMerReports() {
      const objects: MerReportDate[] = [];

      for await (const obj of client(MerReportDate).asyncIter()) {
        // @ts-expect-error
          objects.push(obj);
      }
      setMerReports(objects);
    }
    fetchMerReports();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', { center: [19.5, -155.5], zoom: 8 }); // Centered on the Big Island
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
      }).addTo(mapRef.current);
    } else {
      mapRef.current.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          mapRef.current?.removeLayer(layer);
        }
      });
    }

    // console.log(merReports)

    // Add MER report markers and store them
    merReports.forEach((report: MerReportDate) => {
        // @ts-expect-error
        if (!report.unitAssigned) {
            // @ts-expect-error
          const lat = parseFloat(report.lat);
            // @ts-expect-error
          const long = parseFloat(report.long);


      // Check if the report is within the circular area
      const distance = mapRef.current?.distance(L.latLng(lat, long), L.latLng(center.lat, center.long));
      if (distance !== undefined && distance <= radius) {
        const marker = L.marker([lat, long], {icon: EmergencyMapIcon}).addTo(mapRef.current!);

          // @ts-expect-error
        marker.bindPopup(`Fatalities: ${report.fatalities}, Injured: ${report.injured}`);

        // Store the MER report marker for later use
        merReportMarkers.current.push(marker);

        // On marker click, add a 10-mile radius and show hospitals within the radius
        marker.on('click', () => {
          const clickRadius = 16093.44; // 10 miles in meters
          const circle = L.circle([lat, long], {radius: clickRadius}).addTo(mapRef.current!); // Add the circle to map

          // Hide the radius circle after 3 seconds
          setTimeout(() => {
            mapRef.current?.removeLayer(circle);
          }, 2000);

          // Hide all MER report markers except the clicked one
          merReportMarkers.current.forEach((otherMarker) => {
            if (otherMarker !== marker) {
              mapRef.current?.removeLayer(otherMarker);
            }
          });


          // Show hospitals within the radius
          const nearbyHospitals = hospitals.filter((hospital) => {
            if (!hospital.geopoint?.coordinates) return false;
            const [lon, hospitalLat] = hospital.geopoint.coordinates;

            // Corrected distance calculation using L.latLng
            const distance = mapRef.current?.distance(
              L.latLng(lat, long),
              L.latLng(hospitalLat, lon)
            );

            return distance !== undefined && distance <= clickRadius; // 10 miles
          });

          // Display nearby hospitals with circle markers
          nearbyHospitals.forEach((hospital) => {
            const [lon, lat] = hospital.geopoint!.coordinates;
            L.marker([lat, lon], {icon: HospitalMapIcon})
              .addTo(mapRef.current!)
              .bindPopup(`${hospital.name} - Beds: ${hospital.beds}`);
          });

          // Show units within the radius
          const nearbyUnits = units.filter(() => {
            const distance = mapRef.current?.distance(
              L.latLng(lat, long),
              L.latLng(19.733991, -156.042004)
            );
            return distance !== undefined && distance <= radius; // 10 miles
          });

          // Display nearby units with circle markers
          nearbyUnits.forEach((unit) => {
            L.circleMarker([19.733991, -156.042004], {
              radius: 8,
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.5,
              weight: 2,
            })
              .addTo(mapRef.current!)
              .bindPopup(`
              UIC: ${unit.uicName}<br>
              Equipment: ${unit.equipmentFamily} - ${unit.equipmentDescription}<br>
              Total On Hand: ${unit.totalOnHand}`);
          });

          // Re-add other MER report markers after the timeout expires
          setTimeout(() => {
            merReportMarkers.current.forEach((otherMarker) => {
              if (otherMarker !== marker) {
                otherMarker.addTo(mapRef.current!); // Re-add the marker
              }
            });
          }, 2000); // Delay for reappearing
        });
      }
    }});
  }, [merReports, hospitals, units, center.lat, center.long]);

  return (
    <div>
      <div id="map" className={css.map}></div>
    </div>
  );
}

export default Reports;
