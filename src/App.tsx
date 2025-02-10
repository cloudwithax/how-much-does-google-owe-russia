import { useState, useEffect } from "react";

const INITIAL_AMOUNT = 324000;
const INITIAL_TIMESTAMP = 1619582400 * 1000; // Convert to milliseconds
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const USD_TO_RUB_RATE = 97; // Average exchange rate as of 2025

function calculateDebt() {
  const now = Date.now();
  const timeDiff = now - INITIAL_TIMESTAMP;
  const weeksPassed = Math.floor(timeDiff / WEEK_IN_MS);
  return INITIAL_AMOUNT * Math.pow(2, weeksPassed);
}

function formatLargeNumber(num: number): string {
  return num.toLocaleString("fullwide", { useGrouping: true });
}

function humanizeNumber(num: number): string {
  const units = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
    "decillion",
    "undecillion",
    "duodecillion",
    "tredecillion",
    "quattuordecillion",
    "quindecillion",
    "sexdecillion",
    "septendecillion",
    "octodecillion",
    "novemdecillion",
    "vigintillion",
    "unvigintillion",
    "duovigintillion",
    "trevigintillion",
    "quattuorvigintillion",
    "quinvigintillion",
    "sexvigintillion",
    "septenvigintillion",
    "octovigintillion",
    "novemvigintillion",
    "trigintillion",
    "untrigintillion",
    "duotrigintillion",
    "googol",
    "centillion",
  ];

  // Handle numbers larger than our named units
  if (num >= Math.pow(10, units.length * 3)) {
    const exponent = Math.floor(Math.log10(num));
    return `10^${exponent} (${exponent}-digit number)`;
  }

  let unitIndex = 0;
  let value = num;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // Round to 2 decimal places
  value = Math.round(value * 100) / 100;

  // For very large numbers, add scientific notation
  const scientificNotation = unitIndex > 10 ? ` (10^${unitIndex * 3})` : "";

  return `${value} ${units[unitIndex]}${scientificNotation}`;
}

function getNextDoubleDate(): Date {
  const now = Date.now();
  const weeksSinceStart = Math.floor((now - INITIAL_TIMESTAMP) / WEEK_IN_MS);
  const nextDoubleTimestamp =
    INITIAL_TIMESTAMP + (weeksSinceStart + 1) * WEEK_IN_MS;
  return new Date(nextDoubleTimestamp);
}

function App() {
  const [debt, setDebt] = useState<number>(calculateDebt());
  const [timeUntilDouble, setTimeUntilDouble] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDebt(calculateDebt());

      const nextDouble = getNextDoubleDate();
      const timeLeft = nextDouble.getTime() - Date.now();

      const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

      setTimeUntilDouble(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rubleDebt = debt * USD_TO_RUB_RATE;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100 overflow-hidden relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=3276')] opacity-5 bg-cover bg-center pointer-events-none" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16 ">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 max-w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400 max-w-[800px] mx-auto leading-10">
                How much does Google owe Russia?
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* USD Section */}
              <div className="p-8 md:p-12">
                <h2 className="text-xl text-gray-400 mb-4">
                  Current Debt Amount* (USD):
                </h2>
                <div className="space-y-4">
                  <div className="font-mono text-2xl sm:text-3xl md:text-4xl break-all bg-black/30 p-6 rounded-2xl border border-white/[0.05]">
                    <span className="text-emerald-400">$</span>
                    <span className="text-gray-100">
                      {formatLargeNumber(debt)}
                    </span>
                  </div>
                  <div className="text-lg md:text-xl text-emerald-400/90 font-medium text-center">
                    ≈ {humanizeNumber(debt)} dollars
                  </div>
                </div>
              </div>

              {/* Ruble Section */}
              <div className="border-t border-white/[0.05] bg-black/20">
                <div className="p-8 md:p-12">
                  <h2 className="text-xl text-gray-400 mb-4">
                    Current Debt Amount* (RUB):
                  </h2>
                  <div className="space-y-4">
                    <div className="font-mono text-2xl sm:text-3xl md:text-4xl break-all bg-black/30 p-6 rounded-2xl border border-white/[0.05]">
                      <span className="text-emerald-400">₽</span>
                      <span className="text-gray-100">
                        {formatLargeNumber(rubleDebt)}
                      </span>
                    </div>
                    <div className="text-lg md:text-xl text-emerald-400/90 font-medium text-center">
                      ≈ {humanizeNumber(rubleDebt)} rubles
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      Based on the average exchange rate of 97 RUB per USD as of
                      2025.
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Section */}
              <div className="border-t border-white/[0.05] bg-black/20">
                <div className="p-8 md:p-12">
                  <h3 className="text-xl text-gray-400 mb-4">
                    Next Doubling In:
                  </h3>
                  <div className="font-mono text-2xl md:text-3xl text-blue-400 bg-black/30 p-6 rounded-2xl border border-white/[0.05]">
                    {timeUntilDouble}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="border-t border-white/[0.05] bg-black/40">
                <div className="p-8 md:p-12 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Started on:</span>
                    <span className="text-gray-300">
                      {new Date(INITIAL_TIMESTAMP).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Initial amount:</span>
                    <span className="text-gray-300">
                      ${formatLargeNumber(INITIAL_AMOUNT)} (₽
                      {formatLargeNumber(INITIAL_AMOUNT * USD_TO_RUB_RATE)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Doubles every:</span>
                    <span className="text-gray-300">7 days</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Exchange rate:</span>
                    <span className="text-gray-300">
                      1 USD = {USD_TO_RUB_RATE} RUB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex flex-col gap-4 mt-4 text-center text-sm text-gray-500">
              <p className="text-md mt-8">
                made with ❤️ by{" "}
                <a
                  href="https://github.com/cloudwithax/how-much-does-google-owe-russia"
                  className="text-blue-400"
                >
                  clxud
                </a>
              </p>
              <p>
                This is a satirical website. Numbers are fictional and for
                entertainment purposes only.
              </p>
              <p className="text-xs mt-4">
                * Current amount is calculated based on the amount owed after
                the grace period of nine months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
