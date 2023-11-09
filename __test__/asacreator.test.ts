import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { AsacreatorClient } from '../contracts/clients/AsacreatorClient';

const fixture = algorandFixture();

let appClient: AsacreatorClient;

describe('Asacreator', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount } = fixture.context;

    appClient = new AsacreatorClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({});
  });

  test('create', async () => {
    const name = 'HH Coin';
    const unitName = 'HHC';
    const decimals = 1;
    const supply = 1000000;

    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));

    const asset = await appClient.createAsset(
      { name, decimals, supply, unitName },
      {
        sendParams: {
          fee: algokit.microAlgos(2_000),
        },
      }
    );
    expect(asset.return?.valueOf()).toBeGreaterThan(BigInt(1000));
  });
});
