import React, { useState } from "react";

interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

const add_stock = () => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]); // Typed state
  const [stockName, setStockName] = useState<string>(""); // Stock name input
  const [stockSymbol, setStockSymbol] = useState<string>(""); // Stock symbol input

  const addToPortfolio = () => {
    if (stockName && stockSymbol) {
      const newStock: Stock = {
        id: Math.random().toString(36).substr(2, 9), // Unique ID
        name: stockName,
        symbol: stockSymbol.toUpperCase(),
        price: Math.random() * 100 + 100,
      };

      setPortfolio([...portfolio, newStock]); // Update portfolio
      setStockName(""); // Clear input
      setStockSymbol(""); // Clear input
    }
  };

  return (
    <div>
      <h1>Add Stocks to Portfolio</h1>
      <input
        type="text"
        value={stockName}
        onChange={(e) => setStockName(e.target.value)}
        placeholder="Stock Name"
      />
      <input
        type="text"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value)}
        placeholder="Stock Symbol"
      />
      <button onClick={addToPortfolio}>Add to Portfolio</button>

      <h2>Your Portfolio</h2>
      <ul>
        {portfolio.map((stock) => (
          <li key={stock.id}>
            {stock.name} ({stock.symbol}) - ${stock.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default add_stock;
