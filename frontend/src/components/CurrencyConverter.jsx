import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowUpDown, 
  DollarSign, 
  TrendingUp,
  RefreshCw,
  X,
  Calculator
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CurrencyConverter = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('DZD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Currencies with flags and names
  const currencies = {
    DZD: { name: 'Dinar Algérien', flag: '🇩🇿', symbol: 'DZD' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    USD: { name: 'Dollar Américain', flag: '🇺🇸', symbol: '$' },
    GBP: { name: 'Livre Sterling', flag: '🇬🇧', symbol: '£' },
    KRW: { name: 'Won Coréen', flag: '🇰🇷', symbol: '₩' },
    JPY: { name: 'Yen Japonais', flag: '🇯🇵', symbol: '¥' },
    CAD: { name: 'Dollar Canadien', flag: '🇨🇦', symbol: 'C$' },
    CHF: { name: 'Franc Suisse', flag: '🇨🇭', symbol: 'CHF' },
    CNY: { name: 'Yuan Chinois', flag: '🇨🇳', symbol: '¥' },
    MAD: { name: 'Dirham Marocain', flag: '🇲🇦', symbol: 'MAD' },
    TND: { name: 'Dinar Tunisien', flag: '🇹🇳', symbol: 'TND' }
  };

  // Mock exchange rates (in production, use a real API like exchangerate-api.com)
  const mockRates = {
    DZD: {
      EUR: 0.0067,
      USD: 0.0073,
      GBP: 0.0058,
      KRW: 10.12,
      JPY: 1.08,
      CAD: 0.0102,
      CHF: 0.0065,
      CNY: 0.0528,
      MAD: 0.073,
      TND: 0.0225
    },
    EUR: {
      DZD: 149.25,
      USD: 1.09,
      GBP: 0.86,
      KRW: 1511.23,
      JPY: 161.45,
      CAD: 1.52,
      CHF: 0.97,
      CNY: 7.88,
      MAD: 10.89,
      TND: 3.36
    },
    USD: {
      DZD: 137.12,
      EUR: 0.92,
      GBP: 0.79,
      KRW: 1387.55,
      JPY: 148.25,
      CAD: 1.39,
      CHF: 0.89,
      CNY: 7.24,
      MAD: 10.01,
      TND: 3.09
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExchangeRates();
    }
  }, [isOpen]);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      // Simulate API call - in production, use real exchange rate API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRates(mockRates);
      setLastUpdated(new Date());
      calculateConversion();
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversion = () => {
    if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
      const rate = rates[fromCurrency][toCurrency];
      const convertedAmount = amount * rate;
      setResult({
        amount: convertedAmount,
        rate: rate,
        inverse: 1 / rate
      });
    } else if (fromCurrency === toCurrency) {
      setResult({
        amount: amount,
        rate: 1,
        inverse: 1
      });
    }
  };

  useEffect(() => {
    if (rates[fromCurrency]) {
      calculateConversion();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(number);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span>Convertisseur de Devises</span>
            </CardTitle>
            <CardDescription>
              Taux de change en temps réel pour vos voyages
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant à convertir
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="text-lg"
              placeholder="Entrez le montant"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                De
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(currencies).map(([code, currency]) => (
                  <option key={code} value={code}>
                    {currency.flag} {code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vers
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(currencies).map(([code, currency]) => (
                  <option key={code} value={code}>
                    {currency.flag} {code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={swapCurrencies}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Inverser</span>
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {currencies[fromCurrency].flag} {formatNumber(amount)} {fromCurrency}
                </div>
                <div className="text-lg text-gray-600 mb-2">=</div>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {currencies[toCurrency].flag} {formatNumber(result.amount)} {toCurrency}
                </div>
                
                {/* Exchange Rate Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium">Taux de change</div>
                    <div>1 {fromCurrency} = {formatNumber(result.rate)} {toCurrency}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium">Taux inverse</div>
                    <div>1 {toCurrency} = {formatNumber(result.inverse)} {fromCurrency}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Conversions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Conversions populaires</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { from: 'DZD', to: 'EUR', amount: 1000 },
                { from: 'DZD', to: 'USD', amount: 1000 },
                { from: 'EUR', to: 'DZD', amount: 100 },
                { from: 'USD', to: 'DZD', amount: 100 }
              ].map((conversion, index) => {
                const rate = rates[conversion.from]?.[conversion.to] || 0;
                const converted = conversion.amount * rate;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setAmount(conversion.amount);
                      setFromCurrency(conversion.from);
                      setToCurrency(conversion.to);
                    }}
                    className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {conversion.amount} {conversion.from} → {formatNumber(converted)} {conversion.to}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>
                {lastUpdated ? `Mis à jour: ${lastUpdated.toLocaleTimeString('fr-FR')}` : 'Chargement...'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExchangeRates}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;