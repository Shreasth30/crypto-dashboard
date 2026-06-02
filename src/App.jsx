import { useState, useEffect } from 'react';
import { useCurrency, CurrencyProvider } from './context/CurrencyContext';
import { useCryptoData } from './hooks/useCryptoData';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import CoinTable from './components/CoinTable';
import WatchlistPanel from './components/WatchlistPanel';
import CoinDetailModal from './components/CoinDetailModal';
import Login from './components/Login';
import { motion } from 'framer-motion';

function DashboardContent({ user, onLogout, setShowLoginModal }) {
  const { currency } = useCurrency();
  const { data, loading, error } = useCryptoData(currency);
  const [selectedCoinId, setSelectedCoinId] = useState(null);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('crypto_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleCoin = (coinId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setWatchlist((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };

  const isFavorite = (coinId) => watchlist.includes(coinId);

  const handleSelectCoin = (coinId) => {
    setSelectedCoinId(coinId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
      <div className="glowing-orb-1"></div>
      <div className="glowing-orb-2"></div>
      <Header data={data} onSelectCoin={handleSelectCoin} user={user} onLogout={onLogout} onLoginClick={() => setShowLoginModal(true)} />

      {error && (
        <div className="bg-cyan-500/10 text-cyan-500 p-4 rounded-xl mb-6 border border-cyan-500/20">
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
              <CoinTable 
                data={data} 
                onSelectCoin={handleSelectCoin} 
                toggleCoin={toggleCoin}
                isFavorite={isFavorite}
              />
            </div>
            <div className="w-full xl:w-[35%] flex-shrink-0 xl:sticky xl:top-28">
              <WatchlistPanel 
                data={data} 
                watchlist={watchlist}
                toggleCoin={toggleCoin}
              />
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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    return saved === 'true' ? email : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (email) => {
    setUser(email);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('login_prompt_dismissed');
    setUser(null);
  };

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const dismissed = sessionStorage.getItem('login_prompt_dismissed') === 'true';
        if (!loggedIn && !dismissed) {
          setShowLoginModal(true);
        }
      }, 15000); // 15 seconds
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCloseModal = () => {
    sessionStorage.setItem('login_prompt_dismissed', 'true');
    setShowLoginModal(false);
  };

  return (
    <CurrencyProvider>
      <DashboardContent 
        user={user} 
        onLogout={handleLogout} 
        setShowLoginModal={setShowLoginModal} 
      />
      {showLoginModal && (
        <Login 
          onLogin={handleLogin} 
          onClose={handleCloseModal} 
          isModal={true} 
        />
      )}
    </CurrencyProvider>
  );
}
