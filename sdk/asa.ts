import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';

async function main() {
  const creator = algosdk.generateAccount();

  const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'));

  // obtener información de la cuenta

  // agregar ALGOS a la cuenta

  const kmd = algokit.getAlgoKmdClient(algokit.getDefaultLocalNetConfig('kmd'));

  await algokit.ensureFunded(
    {
      accountToFund: creator.addr,
      minSpendingBalance: algokit.algos(10),
    },
    algod,
    kmd
  );

  // obtener informacion de la cuenta
  // eslint-disable-next-line no-console
  console.log(await algod.accountInformation(creator.addr).do());

  // ASA === Crear un algorand standard asset

  const asaCreation = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    assetName: 'Hackerhouse coin',
    unitName: 'HHC',
    total: 1000000,
    decimals: 1,
    defaultFrozen: false,
    suggestedParams: await algod.getTransactionParams().do(),
  });

  console.log(asaCreation);

  // enviar la transacción de crear asset
  const createAssetTxn = await algokit.sendTransaction(
    {
      transaction: asaCreation,
      from: creator,
    },
    algod
  );

  console.log(createAssetTxn);

  const assetIndex = Number(createAssetTxn.confirmation!.assetIndex);
  console.log(assetIndex);

  const receiver = algosdk.generateAccount();

  // agregar ALGOS a la cuenta
  await algokit.ensureFunded(
    {
      accountToFund: receiver.addr,
      minSpendingBalance: algokit.algos(10),
    },
    algod,
    kmd
  );

  // transaccion de optin
  const optIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: receiver.addr,
    to: receiver.addr,
    assetIndex,
    amount: 0,
    suggestedParams: await algod.getTransactionParams().do(),
  });

  await algokit.sendTransaction(
    {
      transaction: optIn,
      from: receiver,
    },
    algod
  );

  // transaccion de transferencia del asset
  const asaTranfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    to: receiver.addr,
    assetIndex,
    amount: 10000,
    suggestedParams: await algod.getTransactionParams().do(),
  });

  await algokit.sendTransaction(
    {
      transaction: asaTranfer,
      from: creator,
    },
    algod
  );

  // obtener información de las cuentas
  console.log('===================');
  console.log(await algod.accountInformation(creator.addr).do());
  console.log('===================');
  console.log(await algod.accountInformation(receiver.addr).do());
}

main();
