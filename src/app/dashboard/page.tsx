"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, SetStateAction } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  TrendingUp,
  Plus,
  ChevronRight,
  BarChart2,
  PieChart,
  DollarSign,
  Activity,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  BookOpen,
  Gift,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const notifications = 3;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1); // For keyboard navigation
  const [recentSelections, setRecentSelections] = useState<string[]>([]); // Recent items
  const [selectedStock, setSelectedStock] = useState<string | null>(null); // Selected stock

  const sampleData = [
    "Reliance Industries Ltd.",
    "TCS Ltd.",
    "Infosys",
    "SBI",
    "Hindustan Unilever Ltd.",
    "Bajaj Finance",
    "Larsen & Turbo",
    "Maruti Suzuki India Ltd.",
    "Wipro Ltd.",
    "Oil and Natural Gas Corporation Ltd.",
  ];

  useEffect(() => {
    // Load last opened stock and recent selections from localStorage
    const storedStock = localStorage.getItem("selectedStock");
    const storedSelections = JSON.parse(
      localStorage.getItem("recentSelections") || "[]"
    );

    if (storedStock) setSelectedStock(storedStock);
    if (storedSelections.length) setRecentSelections(storedSelections);
  }, []);

  const handleChange = (e: { target: { value: any } }) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter results based on the search query
    if (query) {
      const filteredResults = sampleData.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
    setActiveIndex(-1);
  };

  const handleSelection = (selectedStock: string) => {
    setSearchQuery(selectedStock);
    setSearchResults([]);
    setSelectedStock(selectedStock); // Update selected stock state
    localStorage.setItem("selectedStock", selectedStock); // store in localStorage

    // Add to recent selections (keep last 5)
    setRecentSelections((prev) => {
      const updatedSelections = [
        selectedStock,
        ...prev.filter((item) => item !== selectedStock),
      ];
      localStorage.setItem(
        "recentSelections",
        JSON.stringify(updatedSelections.slice(0, 5))
      );
      return updatedSelections.slice(0, 5);
    });

    router.push(`/dashboard/${encodeURIComponent(selectedStock)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      // Navigate down
      setActiveIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      // Navigate up
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      // Navigate to the selected item
      e.preventDefault(); // Prevent default behavior
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        const selectedStock = searchResults[activeIndex];
        setSearchQuery(selectedStock);
        setSearchResults([]);
        router.push(`/dashboard/${encodeURIComponent(selectedStock)}`);
      }
    }
  };

  const handleResultClick = (result: any) => {
    setSearchQuery(result); // Set the search query to the clicked result
    setSearchResults([]); // Clear the dropdown
    router.push(`/dashboard/${encodeURIComponent(result)}`); // Navigate to the stock's details page
  };

  return (
    <motion.header
      {...fadeInUp}
      className="flex justify-between items-center p-4 bg-gray-900 text-white"
    >
      <div className="flex items-center space-x-8">
        <motion.span
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="text-blue-500 font-semibold flex items-center"
              >
                <Zap className="mr-1" size={16} />
                Explore
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <Globe className="mr-1" size={16} />
                Investments
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BookOpen className="mr-1" size={16} />
                Learn
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/*Here the search options allows user to search fromthe list of given assests/stocks and display based on user choice */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Attach keydown handler
            placeholder="What are you looking for today?"
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/*onClick={() => handleResultClick(result); */}
          {/* Dropdown menu */}
          {searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onClick={() => handleSelection(result)}
                  className={`px-4 py-2 cursor-pointer text-white transition-all ${
                    index === activeIndex
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                  }`}
                  //onClick={() => router.push(`/dashboard/${result}`)}
                >
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="text-gray-300 hover:text-blue-500 transition-colors" />
          {notifications > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
      </div>
      <div className="md:hidden">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 p-4 z-50"
          >
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X />
            </motion.button>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-blue-500 font-semibold flex items-center"
                  >
                    <Zap className="mr-2" size={16} />
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <Globe className="mr-2" size={16} />
                    Investments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BookOpen className="mr-2" size={16} />
                    Learn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <Gift className="mr-2" size={16} />
                    Rewards
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <HelpCircle className="mr-2" size={16} />
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <Settings className="mr-2" size={16} />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const TabSection = () => {
  const [activeTab, setActiveTab] = useState("Stocks");
  return (
    <motion.div {...fadeInUp} className="border-b border-gray-700">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 overflow-x-auto">
          {["Stocks", "Mutual Funds", "ETFs", "Options", "Futures"].map(
            (tab) => (
              <motion.li
                key={tab}
                className={`py-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-300 hover:text-blue-500 transition-colors"
                }`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.li>
            )
          )}
        </ul>
      </div>
    </motion.div>
  );
};

const generateRandomChange = (value: number) => {
  const change = (Math.random() * 2 - 1) * 100;
  const percentChange = (change / value) * 100;
  return { change, percentChange };
};

const MarketIndices = () => {
  const router = useRouter();
  const [marketData, setMarketData] = useState([
    { name: "NIFTY50", value: 18245.32, change: 0, percentChange: 0 },
    { name: "SENSEX", value: 61002.57, change: 0, percentChange: 0 },
    { name: "BANKNIFTY", value: 43123.45, change: 0, percentChange: 0 },
  ]);

  const [recentStocks, setRecentStocks] = useState<
    { name: string; value: number; change: number; percentChange: number }[]
  >([]);

  useEffect(() => {
    // Load recent selections from localStorage
    const storedStocks = JSON.parse(
      localStorage.getItem("recentSelections") || "[]"
    );
    if (storedStocks.length) {
      setRecentStocks(storedStocks);
    }

    // Live market value update every 1 sec
    const interval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((index) => {
          const { change, percentChange } = generateRandomChange(index.value);
          return {
            ...index,
            value: index.value + change,
            change,
            percentChange,
          };
        })
      );

      setRecentStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const { change, percentChange } = generateRandomChange(stock.value);
          return {
            ...stock,
            value: stock.value + change,
            change,
            percentChange,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4"
    >
      {marketData.map((index) => (
        <motion.div
          key={index.name}
          className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/dashboard/${index.name}`)}
        >
          <h3 className="font-semibold text-gray-300">{index.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg text-white">
              {index.value.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            <motion.span
              key={index.change}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm flex items-center ${
                index.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {index.change >= 0 ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {index.change.toFixed(2)} ({index.percentChange.toFixed(2)}%)
            </motion.span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const StockCard = ({
  name,
  initialPrice,
}: {
  name: string;
  initialPrice: number;
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const { change: randomChange, percentChange: randomPercentChange } =
        generateRandomChange(price);
      setPrice((prevPrice) => prevPrice + randomChange);
      setChange(randomChange);
      setPercentChange(randomPercentChange);
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/dashboard/${name}`)}
    >
      <h3 className="font-semibold text-white mb-2">{name}</h3>
      <StockCard name={name} initialPrice={0} />
      <div className="flex items-center justify-between">
        <span className="text-lg text-white">
          {price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </span>
        <motion.span
          key={change}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm flex items-center ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {change >= 0 ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          {change.toFixed(2)} ({percentChange.toFixed(2)}%)
        </motion.span>
      </div>
    </motion.div>
  );
};

const MostBought = () => (
  <motion.div {...fadeInUp} className="my-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">
        Most Bought on TradePro
      </h2>
      <motion.a
        href="#"
        className="text-blue-500 text-sm hover:underline flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View all
        <ChevronRight size={16} className="ml-1" />
      </motion.a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StockCard name="Reliance" initialPrice={2345.6} />
      <StockCard name="Tata Motors" initialPrice={456.75} />
      <StockCard name="Suzlon Energy" initialPrice={18.45} />
      <StockCard name="Zomato" initialPrice={82.3} />
    </div>
  </motion.div>
);

const ProductsAndTools = () => {
  const products = [
    { name: "F&O", icon: BarChart2 },
    { name: "IPO", icon: DollarSign },
    { name: "ETFs", icon: PieChart },
    { name: "FDs", icon: TrendingUp },
    { name: "US Stocks", icon: Activity },
  ];

  return (
    <motion.div {...fadeInUp} className="my-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Products & tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.name}
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: "#2D3748" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <product.icon className="text-white" />
            </motion.div>
            <span className="text-gray-300">{product.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TopGainers = () => (
  <motion.div {...fadeInUp} className="my-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">Top Gainers</h2>
      <motion.a
        href="#"
        className="text-blue-500 text-sm hover:underline flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        See more
        <ChevronRight size={16} className="ml-1" />
      </motion.a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StockCard name="TCS" initialPrice={845.6} />
      <StockCard name="HDFC" initialPrice={135.6} />
      <StockCard name="ICICI" initialPrice={345.6} />
      <StockCard name="Airtel" initialPrice={535.6} />
    </div>
  </motion.div>
);

export default function EnhancedTradeProDashboard() {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Header />
      <main className="container mx-auto px-4">
        <TabSection />
        <StockCard name={""} initialPrice={0}/>
        <MarketIndices />
        <MostBought />
        <ProductsAndTools />
        <TopGainers />
      </main>
    </div>
  );
}
