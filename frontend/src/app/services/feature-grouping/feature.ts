import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Feature {

  private subcategoryMaps: Record<string, Record<string, string[]>> = {

    'mens clothing': {
      Size: ['size', 'fit', 'length'],
      Material: ['material', 'fabric', 'cotton', 'wool'],
      Color: ['color', 'pattern', 'print'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    'mens footwar': {
      Size: ['size', 'fit'],
      Material: ['material', 'leather', 'synthetic'],
      Color: ['color', 'pattern'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    'womens clothing': {
      Size: ['size', 'fit', 'length'],
      Material: ['material', 'fabric', 'cotton', 'wool'],
      Color: ['color', 'pattern', 'print'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    'womens footwar': {
      Size: ['size', 'fit'],
      Material: ['material', 'leather', 'synthetic'],
      Color: ['color', 'pattern'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    footwars: {
      Size: ['size', 'fit'],
      Material: ['material', 'leather', 'synthetic'],
      Color: ['color', 'pattern'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    furnitures: {
      Material: ['wood', 'metal', 'glass'],
      Dimensions: ['width', 'height', 'depth'],
      Weight: ['weight'],
      Color: ['color', 'finish'],
      Others: []
    },
    mobiles: {
      Display: ['screen', 'resolution', 'size'],
      Platform: ['os', 'chipset', 'cpu', 'gpu'],
      Battery: ['capacity', 'charging speed', 'charging type'],
      Connectivity: ['bluetooth', 'wifi', 'nfc', '5g'],
      Sound: ['speaker type', 'dolby', '3.5mm jack'],
      'Main Camera': ['camera type', 'wide', 'ultrawide', 'telephoto', 'periscope', '8k video', '4k video', '1080p video'],
      'Selfie Camera': ['selfie wide', 'selfie video', 'hdr selfie'],
      Memory: ['ram', 'internal', 'expandable storage'],
      Sensors: ['fingerprint', 'accelerometer', 'gyro', 'proximity', 'compass', 'barometer'],
      Build: ['weight', 'dimensions', 'material'],
      Others: []
    },
    speakers: {
      Power: ['power', 'wattage'],
      Connectivity: ['connectivity', 'bluetooth', 'wifi', 'aux', 'usb'],
      Sound: ['frequencyResponse', 'bass', 'treble'],
      Battery: ['capacity', 'charging', 'playback time'],
      Color: ['color', 'finish'],
      Features: ['water resistance', 'smart assistant support'],
      Others: []
    },
    jewellerys: {
      Material: ['material', 'metal', 'alloy', 'gold', 'silver'],
      Gemstone: ['gemstone', 'diamond', 'ruby', 'sapphire'],
      Weight: ['weight', 'carat'],
      Size: ['size', 'ring size', 'length'],
      Design: ['design', 'pattern', 'style'],
      Certification: ['BIS hallmarked', 'IGI certified'],
      Others: []
    },
    watches: {
      Material: ['case material', 'strap material'],
      Color: ['dial color', 'strap color'],
      Dial: ['shape', 'size'],
      Features: ['water resistance', 'chronograph', 'complications'],
      Others: []
    },
    grocerys: {
      Quantity: ['weight', 'volume'],
      ShelfLife: ['expiry date', 'best before'],
      Ingredients: ['ingredients'],
      Diet: ['vegan', 'gluten-free', 'organic'],
      Others: []
    }

  };


  private categoryFeaturesList: { [category: string]: { [group: string]: string[]; }; } = {

    mobiles: {
      ram: ['8 GB', '12 GB', '16 GB'],
      internal: ['128 GB', '256 GB', '512 GB', '1 TB'],
      'expandable storage': ['No', 'Up to 256 GB', 'Up to 512 GB', 'Up to 1 TB'],

      os: ['Android', 'iOS'],
      chipset: ['Snapdragon', 'MediaTek', 'Apple Bionic', 'Exynos'],
      cpu: ['Octa-core', 'Hexa-core'],
      gpu: ['Adreno', 'Mali', 'Apple GPU'],

      screen: ['AMOLED', 'Super AMOLED', 'OLED', 'IPS LCD'],
      resolution: ['HD+', 'FHD+', 'QHD+'],
      size: ['5.8 Inches', '6.1 Inches', '6.5 Inches', '6.7 Inches'],

      'camera type': ['Single', 'Dual', 'Triple', 'Quad'],
      wide: ['12 MP', '48 MP', '50 MP', '64 MP', '108 MP'],
      ultrawide: ['8 MP', '12 MP', '16 MP', '50 MP', '64 MP'],
      telephoto: ['8 MP', '12 MP'],
      periscope: ['Yes', 'No'],

      '8k video': ['Yes', 'No'],
      '4k video': ['30 FPS', '60 FPS'],
      '1080p video': ['30 FPS', '60 FPS', '120 FPS'],

      'selfie wide': ['8 MP', '12 MP', '16 MP', '32 MP'],
      'selfie video': ['1080p', '4K'],
      'hdr selfie': ['Yes', 'No'],

      capacity: ['4000 mAh', '4500 mAh', '5000 mAh', '6000 mAh'],
      'charging speed': ['18W', '25W', '33W', '45W', '65W', '120W'],
      'charging type': ['USB Type-C', 'Wireless', 'Reverse Charging'],

      'speaker type': ['Mono', 'Stereo'],
      dolby: ['Yes', 'No'],
      '3.5mm jack': ['Yes', 'No'],

      fingerprint: ['Side-mounted', 'In-display', 'Rear-mounted', 'No'],
      accelerometer: ['Yes', 'No'],
      gyro: ['Yes', 'No'],
      proximity: ['Yes', 'No'],
      compass: ['Yes', 'No'],
      barometer: ['Yes', 'No'],

      bluetooth: ['5.0', '5.1', '5.2', '5.3', '6.0'],
      wifi: ['Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7', 'Wi-Fi 8'],
      nfc: ['Yes', 'No'],
      '5g': ['Yes', 'No'],

      weight: ['150 g', '170 g', '190 g', '210 g'],
      dimensions: ['Compact', 'Medium', 'Large'],
      material: ['Glass', 'Plastic', 'Metal']
    },

    speakers: {
      power: ['5W', '10W', '20W', '40W', '100W'],
      wattage: ['5W', '10W', '20W', '40W'],
      connectivity: ['Bluetooth', 'WiFi', 'AUX', 'USB'],
      frequencyResponse: ['20Hz–20kHz', '40Hz–20kHz'],
      bass: ['Low', 'Medium', 'High'],
      treble: ['Low', 'Medium', 'High'],
      bluetooth: ['Yes', 'No'],
      wifi: ['Yes', 'No'],
      aux: ['Yes', 'No'],
      usb: ['Yes', 'No'],
      capacity: ['2000 mAh', '4000 mAh', '6000 mAh'],
      charging: ['USB-C', 'Micro USB'],
      battery: ['Yes', 'No'],
      color: ['Black', 'White', 'Blue', 'Red'],
      finish: ['Matte', 'Glossy'],
      'water resistance': ['None', 'IPX4', 'IPX7'],
      'smart assistant support': ['Yes', 'No']
    },

    furnitures: {
      wood: ['Teak', 'Oak', 'Plywood'],
      metal: ['Steel', 'Iron', 'Aluminium'],
      glass: ['Tempered', 'Frosted'],
      width: ['40 cm', '60 cm', '80 cm'],
      height: ['40 cm', '75 cm', '100 cm'],
      depth: ['30 cm', '45 cm', '60 cm'],
      weight: ['10 kg', '20 kg', '40 kg'],
      color: ['Brown', 'Black', 'White'],
      finish: ['Matte', 'Glossy', 'Polished']
    },

    'mens clothing': {
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      fit: ['Slim', 'Regular', 'Loose'],
      length: ['Short', 'Regular', 'Long'],
      material: ['Cotton', 'Polyester', 'Linen'],
      fabric: ['Woven', 'Knitted'],
      cotton: ['100%', '80%', '60%'],
      wool: ['Yes', 'No'],
      color: ['Black', 'White', 'Blue', 'Green'],
      pattern: ['Solid', 'Striped', 'Checked'],
      print: ['Printed', 'Plain'],
      brand: ['Nike', 'Adidas', 'Puma'],
      designer: ['Yes', 'No']
    },

    'mens footware': {
      size: ['6', '7', '8', '9', '10', '11'],
      fit: ['Regular', 'Wide'],
      material: ['Leather', 'Synthetic'],
      leather: ['Genuine', 'Artificial'],
      synthetic: ['PU', 'PVC'],
      color: ['Black', 'Brown', 'White'],
      pattern: ['Solid', 'Textured'],
      brand: ['Nike', 'Puma', 'Reebok'],
      designer: ['Yes', 'No']
    },

    'womens clothing': {
      size: ['XS', 'S', 'M', 'L', 'XL'],
      fit: ['Slim', 'Regular'],
      length: ['Short', 'Midi', 'Long'],
      material: ['Cotton', 'Silk', 'Rayon'],
      fabric: ['Woven', 'Knitted'],
      cotton: ['100%', '80%'],
      wool: ['Yes', 'No'],
      color: ['Red', 'Pink', 'Black'],
      pattern: ['Floral', 'Solid'],
      print: ['Printed', 'Plain'],
      brand: ['Zara', 'H&M'],
      designer: ['Yes', 'No']
    },

    'womens footware': {
      size: ['5', '6', '7', '8', '9'],
      fit: ['Regular', 'Wide'],
      material: ['Leather', 'Synthetic'],
      leather: ['Genuine', 'Artificial'],
      synthetic: ['PU', 'PVC'],
      color: ['Black', 'Beige'],
      pattern: ['Solid', 'Textured'],
      brand: ['Bata', 'Metro'],
      designer: ['Yes', 'No']
    },

    jewellerys: {
      material: ['Gold', 'Silver', 'Platinum'],
      metal: ['18K', '22K', '24K'],
      alloy: ['Copper', 'Nickel'],
      gold: ['Yellow', 'Rose', 'White'],
      silver: ['Sterling', 'Pure'],
      gemstone: ['Diamond', 'Ruby', 'Sapphire'],
      diamond: ['VVS', 'VS', 'SI'],
      ruby: ['Natural', 'Synthetic'],
      sapphire: ['Blue', 'Yellow'],
      weight: ['2 g', '5 g', '10 g'],
      carat: ['0.5', '1', '2'],
      size: ['Small', 'Medium', 'Large'],
      'ring size': ['6', '7', '8', '9'],
      length: ['16 cm', '18 cm', '20 cm'],
      design: ['Classic', 'Modern'],
      pattern: ['Plain', 'Designer'],
      style: ['Traditional', 'Contemporary'],
      'BIS hallmarked': ['Yes', 'No'],
      'IGI certified': ['Yes', 'No']
    },

    watchs: {
      'case material': ['Steel', 'Titanium'],
      'strap material': ['Leather', 'Metal', 'Silicone'],
      'dial color': ['Black', 'Blue', 'White'],
      'strap color': ['Black', 'Brown'],
      shape: ['Round', 'Square'],
      size: ['38 mm', '42 mm', '46 mm'],
      'water resistance': ['30 m', '50 m', '100 m'],
      style: ['Casual', 'Formal', 'Sport'],
      chronograph: ['Yes', 'No'],
      complications: ['Date', 'Moonphase', 'GMT']
    },

    grocerys: {
      weight: ['250 g', '500 g', '1 kg', '2 kg'],
      volume: ['250 ml', '500 ml', '1 L'],
      'expiry date': ['6 Months', '1 Year'],
      'best before': ['3 Months', '6 Months'],
      ingredients: ['Natural', 'Mixed'],
      vegan: ['Yes', 'No'],
      'gluten-free': ['Yes', 'No'],
      organic: ['Yes', 'No']
    }

  };


  groupFeatures(categoryType: string, features: Record<string, any>) {

    const subMap = this.subcategoryMaps[categoryType?.toLowerCase()];

    if (!subMap) {
      return [{
        name: 'Features',
        features: Object.entries(features).map(([k, v]) => ({ key: k, value: v }))
      }];
    }

    const grouped: Record<string, { key: string; value: any }[]> = {};

    for (const [key, value] of Object.entries(features)) {

      const featureKey = key.toLowerCase();
      let matched = false;

      for (const sub in subMap) {
        const keys = subMap[sub].map(k => k.toLowerCase());

        if (keys.includes(featureKey)) {
          grouped[sub] = grouped[sub] || [];
          grouped[sub].push({ key, value });
          matched = true;
          break;
        }
      }

      if (matched) continue;

      for (const sub in subMap) {
        const keys = subMap[sub].map(k => k.toLowerCase());

        for (const k of keys) {
          if (
            featureKey.startsWith(k + ' ') ||
            featureKey.endsWith(' ' + k)
          ) {
            grouped[sub] = grouped[sub] || [];
            grouped[sub].push({ key, value });
            matched = true;
            break;
          }
        }

        if (matched) break;
      }

      if (!matched) {
        grouped['Others'] = grouped['Others'] || [];
        grouped['Others'].push({ key, value });
      }
    }

    return Object.entries(grouped).map(([name, features]) => ({ name, features }));
  }


  getFeatureOptionsMap() {
    return this.categoryFeaturesList;
  }


}
