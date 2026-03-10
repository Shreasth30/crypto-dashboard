import { useState } from 'react';
import { useCurrency, CurrencyProvider } from './context/CurrencyContext';
import { useCryptoData } from './hooks/useCryptoData';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import CoinTable from './components/CoinTable';
import WatchlistPanel from './components/WatchlistPanel';
import CoinDetailModal from './components/CoinDetailModal';
import { motion } from 'framer-motion';

function DashboardContent() {
  const { currency } = useCurrency();
  const { data, loading, error } = useCryptoData(currency);
  const [selectedCoinId, setSelectedCoinId] = useState(null);

  const handleSelectCoin = (coinId) => {
    setSelectedCoinId(coinId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Header data={data} onSelectCoin={handleSelectCoin} />

      {error && (
        <div className="bg-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 border border-rose-500/30">
          <p className="font-semibold text-center">{error}</p>
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatsPanel data={data} />

          <div className="flex flex-col xl:flex-row gap-8 items-start">
            <div className="w-full xl:w-[65%] flex-shrink-0">
              <CoinTable data={data} onSelectCoin={handleSelectCoin} />
            </div>
            <div className="w-full xl:w-[35%] flex-shrink-0 xl:sticky xl:top-28">
              <WatchlistPanel data={data} />
            </div>
          </div>

          <CoinDetailModal
            coinId={selectedCoinId}
            data={data}
            onClose={() => setSelectedCoinId(null)}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <DashboardContent />
    </CurrencyProvider>
  );
}
