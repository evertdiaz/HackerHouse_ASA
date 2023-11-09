import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class Asacreator extends Contract {
  createAsset(name: string, decimals: number, supply: number, unitName: string): Asset {
    const resultASA = sendAssetCreation({
      configAssetTotal: supply,
      configAssetName: name,
      configAssetUnitName: unitName,
      configAssetDecimals: decimals,
    });
    return resultASA;
  }
}
