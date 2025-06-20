import { PortfolioContext } from "../page";
import { useContext, useState } from "react";

export function LoadForm({ onClose }) {
  const { setShowHome, setPortfolioData } = useContext(PortfolioContext);
  const [user_id, setPassword] = useState('');
  const [error, setError] = useState("");

    const handleLoad = async () => {
        setError("");

        try {
            const res = await fetch(`http://127.0.0.1:8000/load-portfolio/${user_id}`);
            const data = await res.json();

            if (!data.items || data.items.length === 0) {
                setError("That portfolio doesn't exist.");
                return;
            }

            const loadedPortfolioData = {};
            data.items.forEach(item => {
                if (!loadedPortfolioData[item.category]) {
                    loadedPortfolioData[item.category] = [];
                }
                loadedPortfolioData[item.category].push({
                    ...item,
                    url: `http://127.0.0.1:8000/uploads/${item.filename}`
                });
            });

            setPortfolioData(loadedPortfolioData);
            setShowHome(false);
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to load portfolio. Try again.");
        }
    }

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold mb-2">Load Portfolio</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use the portfolio-specific password you set before to load a specific portfolio.
      </p>

      <input
        type="text"
        placeholder="Portfolio password"
        value={user_id}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleLoad}
        className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition"
      >
        Load Portfolio
      </button>
    </div>
  );
}