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
      'Main Camera': ['camera type', 'wide', 'ultrawide', 'telephoto', 'periscope', 'ois', '8k video', '4k video', '1080p video'],
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

  private categoryFeatureMap: Record<string, string[]> = {
    mobiles: ['ram', 'internal', 'expandable storage', 'os', 'chipset', 'cpu', 'gpu', 'screen', 'resolution', 'size', 'camera type', 'wide', 'ultrawide', 'telephoto', 'periscope', 'ois', '8k video', '4k video', '1080p video', 'selfie wide', 'selfie video', 'hdr selfie', 'capacity', 'charging speed', 'charging type', 'speaker type', 'dolby', '3.5mm jack', 'fingerprint', 'accelerometer', 'gyro', 'proximity', 'compass', 'barometer', 'bluetooth', 'wifi', 'nfc', '5g', 'weight', 'dimensions', 'material'],
    speakers: ['power', 'wattage', 'connectivity', 'frequencyResponse', 'bass', 'treble', 'bluetooth', 'wifi', 'aux', 'usb', 'capacity', 'charging', 'battery', 'color', 'finish', 'water resistance', 'smart assistant support'],
    furnitures: ['wood', 'metal', 'glass', 'width', 'height', 'depth', 'weight', 'color', 'finish'],
    'mens clothing': ['size', 'fit', 'length', 'material', 'fabric', 'cotton', 'wool', 'color', 'pattern', 'print', 'brand', 'designer'],
    'mens footware': ['size', 'fit', 'material', 'leather', 'synthetic', 'color', 'pattern', 'brand', 'designer'],
    'womens clothing': ['size', 'fit', 'length', 'material', 'fabric', 'cotton', 'wool', 'color', 'pattern', 'print', 'brand', 'designer'],
    'womens footware': ['size', 'fit', 'material', 'leather', 'synthetic', 'color', 'pattern', 'brand', 'designer'],
    jewellerys: ['material', 'metal', 'alloy', 'gold', 'silver', 'gemstone', 'diamond', 'ruby', 'sapphire', 'weight', 'carat', 'size', 'ring size', 'length', 'design', 'pattern', 'style', 'BIS hallmarked', 'IGI certified'],
    watchs: ['case material', 'strap material', 'dial color', 'strap color', 'shape', 'size', 'water resistance', 'style', 'chronograph', 'complications'],
    grocerys: ['weight', 'volume', 'expiry date', 'best before', 'ingredients', 'vegan', 'gluten-free', 'organic']
  };

  groupFeatures(categoryType: string, features: Record<string, any>) {
    const subMap = this.subcategoryMaps[categoryType?.toLowerCase()];
    if (!subMap) return [{ name: 'Features', features: Object.entries(features).map(([k, v]) => ({ key: k, value: v })) }];

    const grouped: Record<string, { key: string, value: any }[]> = {};

    Object.entries(features).forEach(([key, value]) => {
      let matched = false;
      for (const [sub, keys] of Object.entries(subMap)) {
        if (keys.some(k => key.toLowerCase().includes(k))) {
          grouped[sub] = grouped[sub] || [];
          grouped[sub].push({ key, value });
          matched = true;
          break;
        }
      }
      if (!matched) {
        grouped['Others'] = grouped['Others'] || [];
        grouped['Others'].push({ key, value });
      }
    });

    return Object.entries(grouped).map(([name, features]) => ({ name, features }));
  }

  categoryFeature() {
    return this.categoryFeatureMap
  }

}
