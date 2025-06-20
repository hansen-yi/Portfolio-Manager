'use client'

import { useState, useContext, createContext, useEffect } from 'react';
import { Saving } from './components/Saving';
import { AiOutlineHome, AiFillHome, AiOutlinePlus } from 'react-icons/ai';

// Context for Global State
export const PortfolioContext = createContext();

// Upload Component
function UploadForm({ onClose }) {
  const { addItem } = useContext(PortfolioContext);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ file: false, category: false });

  const handleUpload = async () => {
    const newErrors = {
      file: !file,
      category: category.trim() === '',
    };
    setErrors(newErrors);

  if (newErrors.file || newErrors.category) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();

      console.log(data);

      // const mediaItem = {
      //   id: uuidv4(),
      //   filename: file.filename,
      //   media_type: file.type.startsWith('image') ? 'image' : 'video',
      //   title,
      //   description,
      //   category,
      //   url: data.url, //not in meia item
      // };

      addItem(category, {
        id: crypto.randomUUID(),
        filename: file.name,
        media_type: file.type.startsWith('image') ? 'image' : 'video',
        title,
        description,
        category,
        url: 'http://127.0.0.1:8000/' + data.url,
      });

      if (onClose) onClose();

    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setErrors({file: false, category: errors.category});

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4">
    {/* // <div> */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ✖
      </button>
      <h2 className="text-xl font-semibold text-teal-700">Add New Portfolio Item</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-teal-600">Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {preview && (
        <div>
          {file?.type.startsWith("image") ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-md"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full max-h-64 rounded-md border"
            />
          )}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-teal-600">
          Upload Image or Video <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
            errors.file ? 'border border-red-500' : ''
          }`}
        />
        {errors.file && <p className="text-sm text-red-500">File is required.</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-teal-600">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Photography"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setErrors(prev => ({ ...prev, category: false }));
          }}
          className={`w-full border ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          } rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        {errors.category && (
          <p className="text-sm text-red-500">Category is required.</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-teal-600">Description</label>
        <textarea
          placeholder="Describe the work"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
      </div>

      <button
        onClick={handleUpload}
        className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition"
      >
        Add to Portfolio
      </button>
    </div>
  );

}

import CategoryGroup from './components/CategoryGroup';
import { LoadForm } from './components/LoadForm';

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
          {/* <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowLoadForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-black"
            >
              ✖
            </button> */}
            <LoadForm onClose={() => setShowLoadForm(false)} />
          {/* </div> */}
        </div>
      )}
    </div>
  );  
}

function App() {
  // const [mediaData, setMediaData] = useState({});
  // const [portfolioData, setPortfolioData] = useState({});
  // const [showHome, setShowHome] = useState(true);
  const { showHome, setShowHome, editing, setEditing, portfolioData, setPortfolioData } = useContext(PortfolioContext)
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);
  const handleGoHome = () => {
    setEditing(false);
    setShowHome(true);
  }

  return (
    // <div className="py-10 px-16 bg-teal-500">
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
      
      {/* <h1>Portfolio Manager: Enter Name: My Portfolio</h1>
      <button>View Portfolio</button> */}
      

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
          {/* <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-black"
            >
              ✖
            </button> */}
            <UploadForm onClose={() => setShowForm(false)} />
          {/* </div> */}
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
          {/* <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSaving(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-black"
            >
              ✖
            </button> */}
            <Saving onClose={() => setSaving(false)} />
          {/* </div> */}
        </div>
      )}

    </div>
  );
}

// // Wrap app in provider
export default function PortfolioAppWrapper() {
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
    // <PortfolioProvider>
    <PortfolioContext value={contextValue}>
      <App />
    </PortfolioContext>
    // {/* </PortfolioProvider> */}
  );
}


