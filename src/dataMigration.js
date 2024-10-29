// dataMigration.js

import { db } from "./firebase"; // Asegúrate de ajustar la ruta
import { collection, addDoc, getDocs } from "firebase/firestore";

export const migrateDataToFirebase = async () => {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  const vehiclesCollection = collection(db, "vehicles");
  const existingVehiclesSnapshot = await getDocs(vehiclesCollection);
  const existingVehicles = existingVehiclesSnapshot.docs.map((doc) =>
    doc.data()
  );

  const newVehicles = vehicles.filter(
    (vehicle) =>
      !existingVehicles.some((existing) => existing.id === vehicle.id) // Asegúrate de tener una propiedad 'id' única
  );

  for (const vehicle of newVehicles) {
    try {
      await addDoc(vehiclesCollection, vehicle);
      console.log("Vehículo agregado:", vehicle);
    } catch (e) {
      console.error("Error al agregar vehículo:", e);
    }
  }

  // Limpiar localStorage si es necesario
  localStorage.removeItem("vehicles"); // O puedes vaciarlo si prefieres
};
