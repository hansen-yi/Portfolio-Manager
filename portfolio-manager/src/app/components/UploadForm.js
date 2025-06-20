import { PortfolioContext } from "../page";
import { useContext, useState } from "react";

export function UploadForm({ onClose }) {
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
      //   url: data.url, //not in media item
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