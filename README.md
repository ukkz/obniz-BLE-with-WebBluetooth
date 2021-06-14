# obniz BLE with WebBluetooth

ブラウザから、Web Bluetooth APIを用いてobnizのBLEと通信をするデモコードです。

## obniz側（ペリフェラル）

1. このリポジトリをクローンまたはZIPダウンロードしてください。
2. [ble.js](ble.js) の3行目に自身のobniz IDを入力して保存してください。
3. `npm i` で依存パッケージをインストールしてください。（obniz, random-words）
4. `node ble.js` でobnizをBLEデバイスとして動作させておきます。

## ブラウザ側（セントラル）

1. 自分のPCがBluetoothに対応しているかどうか確認します。
  - 対応していればBluetoothオンにしてください。
  - ブラウザはChromeまたはChromium互換ブラウザを利用するようにしてください。
2. PCが非対応、もしくは対応してるのに接続できない（バージョンが古いなど）場合はスマートフォン（Android）で実施します。
  - こちらもBluetoothオンにしておいてください。
  - Chromeブラウザを利用するようにしてください。
  - **iOSでは利用できません**（ごめんなさい）。
3. ブラウザで [index.html](index.html) を表示させます。
  - GitHub Pagesにホスティングしていますので以下にアクセスしてください。  
    [BLE Central](https://ukkz.github.io/obniz-BLE-with-WebBluetooth/)
  - または、ローカルでデプロイする場合: npmの `serve` やVSCodeのLive Server機能を使い、localhostから始まるアドレスを開きます。

### 使い方

1. `ペリフェラルのスキャン` ボタンをクリックし、ダイアログが表示されたら「obniz BLE」を選択します。
2. `GATT接続` ボタンをクリックし、指定のサービスとキャラクタリスティックが取得できるまで少し待ちます。
3. 接続が完了すると「キャラクタリスティック操作」の下部に入力欄と `Read` ・ `Write` の各ボタンが現れます。  
  そのまま `Read` をクリックするとobniz内のデータが読み取られ入力欄に表示されます。また、入力欄を書き換えるなどしてから `Write` ボタンをクリックすると、obnizにその文字列が書き込まれます。

## 仕様メモ

### UUID類

- サービスUUIDとキャラクタリスティックUUIDは固定にしています。
- obniz側とブラウザ側で揃える必要があります。
- 本来は以下のようなページで新しく取得して書き換えることが望ましいです。（基本的に世の中で重複してはいけないため）  
  [Online UUID Generator Tool](https://www.uuidgenerator.net/)

### obniz

- キャラクタリスティックは `read` と `write` のみできるようにしています。
- キャラクタリスティックは1つですが、読み取り専用変数と、書き込み専用変数の2つの値を持っています。
  - 読み取り専用変数は、obnizのスイッチを押すたびに内容が更新され、ブラウザ側で `read` をクリックするとその中身が読み取られます。
  - 書き込み専用変数は、ブラウザから書き込まれた値をそのまま保持しています。
  - いずれの変数もobnizの画面で確認することができます。
- 応用として、センサーデータを送る（読み取り専用変数を置き換え）ことや、アクチュエータを動かす（書き込み専用変数に反応させる）などの可能性が考えられます。

## 参考

- [BLE \- obniz Docs](https://obniz.com/ja/doc/reference/common/ble/)