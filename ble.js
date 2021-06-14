const randomWords = require('random-words');
const Obniz = require('obniz');
const obniz = new Obniz('obnizIDを入力してください');
const SERVICE_UUID = '2fb65514-1a38-4597-bf63-590e175a262f';
const CHARACTERISTIC_UUID = '1b68902e-da10-40d8-a58f-c68da82c3021';
let readableData = randomWords(); // このデータをBLE経由で発信します
let writableData = ''; // このデータはBLE経由で書き換えられます

// データが変更されたときに画面更新する用の関数
const refresh = () => {
  obniz.display.clear();
  obniz.display.print("BLE Ready\n");
  obniz.display.print(`R:${readableData}\n`);
  obniz.display.print(`W:${writableData}\n`);
};

obniz.onconnect = async () => {
  // BLE準備（画面表示切り替え）
  await obniz.ble.initWait();
  refresh();

  // 接続状態が変化したときにコンソール表示
  obniz.ble.peripheral.onconnectionupdates = (data) => {
    if (data.status === 'connected') console.log(data.address, 'に 接続されました');
    if (data.status === 'disconnected') console.log(data.address, 'から 切断されました');
  };

  // サービスとキャラクタリスティックを用意
  const service = new obniz.ble.service({ uuid: SERVICE_UUID });
  const characteristic = new obniz.ble.characteristic({
    uuid: CHARACTERISTIC_UUID,
    properties: ['read', 'write'],
    data: new TextEncoder().encode(readableData), // 値は文字列ではなく「バイト列」で入れる必要があります
  });

  // サービスにキャラクタリスティックを追加し、さらにそのサービスをペリフェラルに追加する
  service.addCharacteristic(characteristic);
  obniz.ble.peripheral.addService(service);

  // アドバタイズデータをセントラルで扱う場合（ビーコンデバイス）
  // https://googlechrome.github.io/samples/web-bluetooth/scan.html
  // ブラウザ側で navigator.bluetooth.requestLEScan() を使えるようにする必要がある
  obniz.ble.advertisement.setAdvData(service.advData);
  // BLEデバイスとしての名前はここで設定し周囲に発信する
  obniz.ble.advertisement.setScanRespData({ localName: 'obniz BLE' });
  await obniz.ble.advertisement.startWait();

  // ---------------------------------------------------------------------------

  // スイッチが押されると読み取りデータを変更する
  obniz.switch.onchange = async (state) => {
    if (state === 'push') {
      readableData = randomWords(); // ランダム単語にする
      await characteristic.writeWait(new TextEncoder().encode(readableData));
      refresh();
    }
  }

  // セントラル側から書き込みデータが変更された場合
  characteristic.onwritefromremote = (address, value) => {
    writableData = String.fromCharCode.apply('', new Uint8Array(value));
    refresh();
  };
}