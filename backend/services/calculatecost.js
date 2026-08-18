const DELIVERY_TYPE_CHARGE = {
  sameDay: 100,
  overnight: 50,
  standard: 0,
};

const NATIONAL_CATEGORY_CHARGES = {
  documents: -100,
  electronics: 150,
  fragile: 250,
  clothing: 0,
  food: 120,
  medicine: 150,
  cosmetics: 100,
  books: -20,
  small_package: 100,
  large_package: 250,
};

const INTERNATIONAL_CATEGORY_CHARGES = {
  documents: 700,
  electronics: 2000,
  fragile: 3500,
  clothing: 500,
  food: 1500,
  medicine: 1800,
  cosmetics: 1000,
  books: 500,
  small_package: 700,
  large_package: 3500,
};

export const calculatecost = ({
  originCity,
  destinationCity,
  shipmentType,
  parcelCategory,
  weight,
  deliveryType,
}) => {
  const isSameCity =
    originCity.trim().toLowerCase() === destinationCity.trim().toLowerCase();

  const deliveryTypeCharge = DELIVERY_TYPE_CHARGE[deliveryType] || 0;

  // National Shipment
  if (shipmentType === "national") {
    const categoryCharge = NATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;
    // For same city
    if (isSameCity) {
      const basePrice = 50;
      const weightPrice = weight * 500;
      const price =
        basePrice + weightPrice + categoryCharge + deliveryTypeCharge;

      return {
        type: "national",
        price: price,
        parcelCategory,
      };
    }
    //Out of City
    const basePrice = 100;
    const weightPrice = weight * 500;
    const price = basePrice + weightPrice + categoryCharge + deliveryTypeCharge;

    return {
      type: "national",
      price: price,
      parcelCategory,
    };
  }

  if (shipmentType === "international") {
    const categoryCharge = INTERNATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;
    if (weight < 0) {
      throw new Error("Weight must be greater than 0");
    }
    let price;
    if (weight <= 0.5) {
      price = 7500;
    } else if (weight <= 1) {
      price = 13500;
    } else {
      const extraKG = Math.ceil(weight - 1);
      price = 13500 + extraKG * 7500;
    }
    price += categoryCharge;
    return {
      type: "international",
      price: price,
      parcelCategory,
    };
  }

  throw new Error("Invalid shipment configration");
};
