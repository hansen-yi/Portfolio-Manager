import { PortfolioContext } from "../page";
import { useContext, useState } from "react";

export function Saving({ onClose }) {
  const { setShowHome, setEditing, portfolioData, setPortfolioData } = useContext(PortfolioContext);
  const [user_id, setPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (user_id == '') return;

    const formData = new FormData();
    formData.append("user_id", user_id);

    const formattedItems = Object.entries(portfolioData).flatMap(([category, items]) =>
        items.map(item => ({
            id: item.id,
            filename: item.filename,
            media_type: item.media_type,
            title: item.title,
            description: item.description || "",
            category: category
        }))
    );

    const portfolio = {
        user_id: user_id,
        items: formattedItems
    };

    try {
      const result = await fetch('http://127.0.0.1:8000/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolio)
      });

      const data = await result.json();

      console.log(data);

      setSaved(data.status === 'success');

    } catch (error) {
      console.error(error);
    }
  };

  const handleView = () => {
    setEditing(false);

    if (onClose) onClose();
  }

  const handleHome = () => {
    setPortfolioData({});
    setShowHome(true);

    setEditing(false);

    if (onClose) onClose();
  }

  return (
    <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
        {/* Close button in top-right */}
        <button
        onClick={() => {
            onClose(); 
            if (saved) {
                setPortfolioData({});
            }
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        >
        ✖
        </button>

        {!saved && (
        <>
            <p className="mb-4 text-sm text-gray-600">
            Choose a password to access this specific portfolio again later.
            </p>
            <input
            type="text"
            placeholder="Enter password"
            value={user_id}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 block w-full rounded"
            />
            <button
            onClick={handleSave}
            className="bg-blue-400 text-white px-4 py-2 mt-4 rounded w-full hover:bg-blue-500"
            >
            Save Portfolio
            </button>
        </>
        )}

        {saved && (
        <>
            <p className="text-green-500 font-medium mb-4">
            Successfully saved the portfolio.
            </p>
            <div className="flex justify-center gap-4">
            <button
                onClick={handleView}
                className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500"
            >
                View Portfolio
            </button>
            <button
                onClick={handleHome}
                className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
                Go Home
            </button>
            </div>
        </>
        )}
    </div>
    // {!saved && (<div className="p-4 border rounded">
    //   <input type="text" placeholder="Password" value={user_id} onChange={(e) => setPassword(e.target.value)} className="border p-1 mt-2 block w-full" />
    //   <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Save</button>
    // </div>)}
    // {saved && (<div className="p-4 border rounded">
    //   <p>Successfully saved the portfolio.</p>
    //   <button onClick={handleView} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">View Porfolio</button>
    //   <button onClick={handleHome} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Go Home</button>
    // </div>)}
    // </>
  );
}