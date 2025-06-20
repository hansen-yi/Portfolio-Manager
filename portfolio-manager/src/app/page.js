'use client'

import { useState, useContext, createContext, useEffect } from 'react';
import { Saving } from './components/Saving';
import { AiOutlineHome, AiFillHome, AiOutlinePlus } from 'react-icons/ai';

// Context for Global State
export const PortfolioContext = createContext();

import CategoryGroup from './components/CategoryGroup';
import { LoadForm } from './components/LoadForm';
import { UploadForm } from './components/UploadForm';

function Home() {
  const { setShowHome, setEditing } = useContext(PortfolioContext)
  const [showLoadForm, setShowLoadForm] = useState(false);

  const handleCreate = () => {
    setEditing(true); 
    setShowHome(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center text-gray-800">
      <h1 className="text-8xl font-extralight mb-2">
        Portfolio Manager
      </h1>
      <p className="text-xl text-gray-600 mb-8 md:whitespace-nowrap">
        A portfolio manager for all your personal and business needs
      </p>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto justify-center">
        <button
          className="bg-blue-400 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-500 transition"
          onClick={handleCreate}
        >
          Create New Portfolio
        </button>
        <button 
          className="bg-teal-400 text-white py-2 px-4 rounded-xl shadow hover:bg-teal-500 transition"
          onClick={()=>setShowLoadForm(true)}
        >
          Load Previous Portfolio
        </button>
      </div>
      
      {showLoadForm && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
            <LoadForm onClose={() => setShowLoadForm(false)} />
        </div>
      )}
    </div>
  );  
}

function App() {
  const { showHome, setShowHome, editing, setEditing, portfolioData, setPortfolioData } = useContext(PortfolioContext)
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);
  const handleGoHome = () => {
    setEditing(false);
    setShowHome(true);
  }

  return (
    <div className='bg-gray-100 min-h-screen' >
      {/* <CategoryGroup
        title="Photography"
        items={[
          { id: '1', type: 'image', src: '/samples/Baymax.png', description: 'Sunset' },
          { id: '2', type: 'image', src: '/samples/DSC_0763.jpg', description: 'Mountains' },
          { id: '3', type: 'image', src: '/samples/Hansen_Yi_DataPotrait.jpg'},
          { id: '4', type: 'image', src: '/samples/Invisible Cities-03.png'},
          { id: '5', type: 'image', src: '/samples/DSC_0660.jpg', description: 'Mountains' },
          { id: '6', type: 'image', src: '/samples/hungryBunnies.jpg' },
          { id: '7', type: 'image', src: '/samples/UpdatedMachine.jpg'},
        ]}
      /> */}
      {showHome && <Home />}
      
      {/* <h1>Portfolio Manager: Enter Name: My Portfolio</h1> */}

      {!showHome && (
        <div className="w-full flex items-center gap-3 px-6 py-4 shadow bg-white sticky top-0 z-50">
          <button
            onClick={handleGoHome}
            onMouseEnter={() => setHomeHovered(true)}
            onMouseLeave={() => setHomeHovered(false)}
            className="text-blue-400 hover:text-blue-500 transition"
            aria-label="Go Home"
          >
            {homeHovered ? <AiFillHome size={24} /> : <AiOutlineHome size={24} />}
          </button>
        {editing && <h1 className="text-xl font-medium text-gray-600">Portfolio Manager</h1>}
      </div>)}

      {!showHome && Object.entries(portfolioData).map(([title, items]) => (
        <CategoryGroup key={title} title={title} items={items} />
      ))}
      
      {editing && (
        <button
          onClick={() => setSaving(true)}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-400 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition"
        >
          Save Portfolio
        </button>
      )}
      {editing && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-10 right-10 bg-blue-400 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition flex items-center justify-center"
          aria-label="Add Media"
        >
          <AiOutlinePlus size={24} />
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
            <UploadForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
            <Saving onClose={() => setSaving(false)} />
        </div>
      )}

    </div>
  );
}

export default function PortfolioApp() {
  const [showHome, setShowHome] = useState(true);
  const [editing, setEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState({});
  const addItem = (categoryTitle, item) => {
    setPortfolioData((prev) => {
      const existingItems = prev[categoryTitle] || [];
      return {
        ...prev,
        [categoryTitle]: [...existingItems, item],
      }
    });
  };

  const contextValue = {
    showHome,
    setShowHome,
    editing, 
    setEditing,
    portfolioData,
    addItem,
    setPortfolioData,
  };
  return (
    <PortfolioContext value={contextValue}>
      <App />
    </PortfolioContext>
  );
}


