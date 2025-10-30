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
    'mens footware': {
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
    'womens footware': {
      Size: ['size', 'fit'],
      Material: ['material', 'leather', 'synthetic'],
      Color: ['color', 'pattern'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    footware: {
      Size: ['size', 'fit'],
      Material: ['material', 'leather', 'synthetic'],
      Color: ['color', 'pattern'],
      Brand: ['brand', 'designer'],
      Others: []
    },
    furniture: {
      Material: ['wood', 'metal', 'glass'],
      Dimensions: ['width', 'height', 'depth'],
      Weight: ['weight'],
      Color: ['color', 'finish'],
      Others: []
    },
    mobile: {
      Display: ['screen', 'resolution', 'size'],
      Platform: ['os', 'chipset', 'cpu', 'gpu'],
      Battery: ['battery', 'capacity', 'charging'],
      Connectivity: ['bluetooth', 'wifi', 'nfc'],
      Sound: ['speaker', '3.5mm jack'],
      Camera: ['camera', 'main', 'selfie'],
      Memory: ['ram', 'internal', 'card slot'],
      Others: []
    },
    speaker: {
      Power: ['power', 'wattage'],
      Connectivity: ['connectivity', 'bluetooth', 'wifi', 'aux', 'usb'],
      Sound: ['frequencyResponse', 'bass', 'treble'],
      Battery: ['battery', 'capacity', 'charging'],
      Color: ['color', 'finish'],
      Others: []
    },
    jewellery: {
      Material: ['material', 'metal', 'alloy', 'gold', 'silver'],
      Gemstone: ['gemstone', 'diamond', 'ruby', 'sapphire'],
      Weight: ['weight', 'carat'],
      Size: ['size', 'ring size', 'length'],
      Design: ['design', 'pattern', 'style'],
      Others: []
    },
    watch: {
      Material: ['material', 'strap', 'case'],
      Color: ['color', 'dial color', 'strap color'],
      Dial: ['dialShape', 'shape', 'size'],
      Features: ['water resistance', 'style', 'chronograph', 'complications'],
      Others: []
    },
    
  };

  private categoryFeatureMap: Record<string, string[]> = {
    mobile: ['ram', 'internal', 'card sloat', 'os', 'chipset', 'cpu', 'gpu', 'screen', 'resolution', 'size', 'camera', 'main', 'selfie', 'speaker', '3.5mm jack', 'bluetooth', 'wifi', 'nfc', 'battery', 'capacity', 'charging'],
    speaker: ['power', 'wattage', 'connectivity', 'frequencyResponse', 'bass', 'treble', 'bluetooth', 'wifi', 'aux', 'usb', 'capacity', 'charging', 'battery', 'color', 'finish'],
    furniture: ['wood', 'metal', 'glass', 'width', 'height', 'depth', 'weight', 'color', 'finish'],
    'mens clothing': ['size', 'color', 'material', 'brand'],
    'mens footware': ['size', 'color', 'material', 'brand'],
    'womens clothing': ['size', 'color', 'material', 'brand'],
    'womens footware': ['size', 'color', 'material', 'brand'],
    jewellery: ['material', 'metal', 'alloy', 'gold', 'silver', 'gemstone', 'diamond', 'ruby', 'sapphire', 'weight', 'carat', 'size', 'ring size', 'length', 'design', 'pattern', 'style'],
    watch: ['strap', 'case','dial color', 'strap color', 'shape', 'size', 'water resistance', 'style', 'chronograph', 'complications'],
    grocery: ['weight', 'expiryDate', 'brand', 'ingredients']
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
