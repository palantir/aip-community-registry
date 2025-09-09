import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DivIcon } from "leaflet";
import { useEffect, useState } from "react";
import client from "./client.ts";
import SupplyTable from "./SupplyTable.tsx";
import {
  NodeRedGeoType,
  TfLocationType,
  DestinationShelterType,
  SuppliesType,
} from "./types.ts";
import {
  HackathonNodeRedEvent,
  HackathonDestinationAndShelterLocation,
  TfLocations,
  SuppliesDataset,
} from "@hadr-aid/sdk";
import {
  floodIcon,
  medicalIcon,
  powerIcon,
  fuelIcon,
  waterIcon,
  markerIcon,
  environmentalIcon,
  taskForceIcon,
  shelterIcon,
} from "./leaflet_icons.tsx";

const eventIconMap = new Map<string, DivIcon>([
  ["medical", medicalIcon],
  ["power", powerIcon],
  ["fuel", fuelIcon],
  ["water", waterIcon],
  ["flood", floodIcon],
  ["environmental", environmentalIcon],
  ["none", markerIcon],
]);

const MapComponent = () => {
  const [nodeRedGeoObjects, setNodeRedGeoObjects] = useState<NodeRedGeoType[]>(
    []
  );
  const [tfLocations, setTfLocations] = useState<TfLocationType[]>([]);
  const [destinationShelterLocations, setDestinationShelterLocations] =
    useState<DestinationShelterType[]>([]);
  const [supplies, setSupplies] = useState<SuppliesType[]>([]);

  useEffect(() => {
    async function fetchNodeRedGeoObjects() {
      const objects: NodeRedGeoType[] = [];
      for await (const obj of client(HackathonNodeRedEvent).asyncIter()) {
        objects.push(obj as NodeRedGeoType);
      }
      setNodeRedGeoObjects(objects);
    }
    async function fetchTfLocations() {
      const objects: TfLocationType[] = [];
      for await (const obj of client(TfLocations).asyncIter()) {
        objects.push(obj as TfLocationType);
      }
      setTfLocations(objects);
    }
    async function fetchDestinationShelterLocations() {
      const objects: DestinationShelterType[] = [];
      for await (const obj of client(
        HackathonDestinationAndShelterLocation
      ).asyncIter()) {
        objects.push(obj as DestinationShelterType);
      }
      setDestinationShelterLocations(objects);
    }
    async function fetchSupplies() {
      const objects: SuppliesType[] = [];
      for await (const obj of client(SuppliesDataset).asyncIter()) {
        objects.push(obj as SuppliesType);
      }
      setSupplies(objects);
    }
    fetchNodeRedGeoObjects();
    fetchTfLocations();
    fetchDestinationShelterLocations();
    fetchSupplies();
  }, []);

  return (
    <div
      className={"h-full w-full flex flex-col items-center justify-center p-4"}
    >
      <MapContainer
        center={[20.3987, -157.6659]}
        zoom={7}
        className={"h-full w-full"}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodeRedGeoObjects.map((nrgo) => {
          return (
            <Marker
              position={[Number(nrgo.lat), Number(nrgo.lon)]}
              icon={
                eventIconMap.get(nrgo.eventType) || eventIconMap.get("none")
              }
            >
              <Popup>
                <div className="text-center">
                  {nrgo.detail}
                  <br />
                  <br />
                  {nrgo.time}
                </div>
              </Popup>
            </Marker>
          );
        })}
        {tfLocations.map((tf) => {
          return (
            <Marker
              position={[Number(tf.lat), Number(tf.long)]}
              icon={taskForceIcon}
            >
              <Popup>
                <div className="text-center">{tf.tfName}</div>
              </Popup>
            </Marker>
          );
        })}
        {destinationShelterLocations.map((dsl) => {
          return (
            <>
              <Marker
                position={[Number(dsl.lat), Number(dsl.long)]}
                icon={shelterIcon}
              >
                <Popup className="w-fit min-w-fit">
                  <SupplyTable
                    supplies={supplies}
                    destinationShelterLocation={dsl}
                  />
                </Popup>
              </Marker>
            </>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
