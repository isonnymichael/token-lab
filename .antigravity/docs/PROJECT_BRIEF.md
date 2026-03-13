# TokenLab

TokenLab adalah platform visual tokenomics builder berbasis **Blockly** yang menggunakan antarmuka puzzle (Scratch-style) untuk merancang, mensimulasikan, dan mendeploy smart contract ERC-20 dengan mekanisme tokenomics yang kompleks.

## Project Vision
Menyediakan no-code platform yang simple, powerful, dan "smart contract friendly" melalui visual builder terbatas pada 10 block utama untuk menjaga kualitas dan keamanan kode.

## Layout Interface
1. **Top Bar**: Konfigurasi Token (Name, Symbol, Supply, Network) & Button Deploy.
2. **Left Panel (Blocks)**: Library berisi 10 block puzzle.
3. **Center Panel (Workspace)**: Area menyusun logika tokenomics.
4. **Right Panel (Preview)**: Real-time Pie Chart, Flow Diagram, dan Token Stats.

## Final Block List (10 Blocks)

| Category | Block Name | Color | Function |
| :--- | :--- | :--- | :--- |
| **Event** | WHEN BUY | Blue | Trigger saat pembelian (from == pair) |
| **Event** | WHEN SELL | Blue | Trigger saat penjualan (to == pair) |
| **Event** | WHEN TRANSFER | Blue | Trigger saat transfer antar wallet |
| **Tax** | TAX % | Orange | Menentukan total potongan pajak |
| **Structure** | SPLIT | Yellow | Wadah untuk distribusi hasil pajak |
| **Action** | LIQUIDITY % | Green | Alokasi untuk auto-liquidity |
| **Action** | SEND WALLET % | Purple | Kirim ke marketing/treasury wallet |
| **Action** | BURN % | Red | Alokasi untuk pembakaran token |
| **Limits** | MAX WALLET % | Gray | Batasan maksimal token per wallet |
| **Limits** | MAX TX % | Gray | Batasan maksimal jumlah per transaksi |

## Block Hierarchy & Logic Rules
Untuk menjaga validitas smart contract, builder menerapkan aturan hierarki:
**EVENT** → **TAX** → **SPLIT** → **DISTRIBUTION (Liquidity/Wallet/Burn)**

### Aturan Penting UX:
- **EVENT** harus ada di paling atas.
- **TAX** harus berada di bawah EVENT.
- **SPLIT** harus berada di dalam TAX untuk membagi alokasi.
- **DISTRIBUTION** (Liquidity, Wallet, Burn) harus berada di bawah SPLIT.
- **LIMITS** (Max Wallet/Tx) berdiri sendiri sebagai aturan global di dalam EVENT atau sebagai block terpisah (global config).
- **Larangan**: `EVENT` langsung ke `BURN` (tidak sah karena harus ada total TAX terlebih dahulu).

## Smart Contract Logic
Builder akan menghasilkan konfigurasi JSON untuk dideploy:
```json
{
 "buyTax": 10,
 "buyDistribution": {
  "liquidity": 4,
  "marketing": 3,
  "burn": 3
 },
 "sellTax": 12,
 "sellDistribution": {
  "liquidity": 5,
  "marketing": 4,
  "burn": 3
 }
}
```
Kontrak Solidity (OpenZeppelin base) akan mendeteksi tipe transaksi (`buy`, `sell`, `transfer`) di fungsi `_transfer`, menghitung `totalTax`, dan memproses distribusi sesuai hasil `SPLIT`.

## Preview Panel
1. **Pie Chart**: Visualisasi alokasi fee (Liquidity vs Marketing vs Burn).
2. **Flow Diagram**: Visual alur transaksi dari masuk hingga terdistribusi.
3. **Token Stats**: Ringkasan real-time (Total Supply, Circulating, Tax Rates).

## Development Strategy
- **Simplicity**: Batasi maksimal 10 blocks untuk mencegah kebingungan user.
- **Validation**: Feedback instan jika user menyusun block yang tidak logis.
- **Real-time update**: Preview berubah setiap kali block di-snap atau diedit nilainya.
