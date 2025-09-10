import React, { useEffect, useState } from 'react';
import JournalEntryProp, { ImageMetadata } from '../interface/JournalEntryProp';
import { TagProp } from '../interface/TagProp';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { EditJournalEntryFormProps } from '../interface/EditJournalEntryFormProps';
import { useAuth } from './Default/AuthProvider';


const EditJournalEntryForm: React.FC<EditJournalEntryFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [entry, setEntry] = useState<JournalEntryProp>({
    _id: initialValues?._id || '', // Ensure _id is defined, even if initialValues is not provided
    title: initialValues?.title || '',
    content: initialValues?.content || '',
    tags: initialValues?.tags || [],
    ownerName:initialValues?.ownerName|| '',
    user: initialValues?.user || '', // Ensure user is defined
    createdAt: initialValues?.createdAt || '', // Set createdAt as needed
    updatedAt: initialValues?.updatedAt || '', // Set updatedAt as needed
    images: (initialValues as any)?.images || [], // Include images - cast to any to handle type mismatch
  });

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() ?? null; // Return null if no token found
    }
    return null;
  }

 const { authToken,loginUserUserId} = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<TagProp[]>(initialValues?.tags || []);
  const [tagSuggestions, setTagSuggestions] = useState<TagProp[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const {apiUrl} = useAuth();
 
  
  // Synchronize tags with the entry object
  useEffect(() => {
    
    if (tags !== entry.tags) {
      setEntry((prevEntry) => ({ ...prevEntry, tags }));
    }
  }, [tags, entry.tags]);
  const fetchTagSuggestions = async (query: string) => {
    try {
      const response = await axios.get(`${apiUrl}/tags/search?query=${query}`);
    
      setTagSuggestions(response.data || []);
    } catch (error) {
      let msg = 'Unknown server error';
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      }
      alert(`Failed to update: ${msg}`);
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.trim();
    setQuery(newQuery);

    if (newQuery) {
      fetchTagSuggestions(newQuery);
    } else {
      setTagSuggestions([]);
    }
  };

  const handleAddTag = (tag: TagProp) => {
    if (!tags.find((t) => t._id === tag._id)) {
      setTags((prevTags) => [...prevTags, tag]);
    }
    setQuery('');
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setImagesToRemove(prev => [...prev, index]);
  };

  const handleRestoreImage = (index: number) => {
    setImagesToRemove(prev => prev.filter(i => i !== index));
  };

  const handleChange = (field: string, value: string | string[]) => {
    setEntry((prevEntry) => ({ ...prevEntry, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let storedToken = getCookie('authToken'); // Get the token from cookies
  //  console.log("Authorization Token:", storedToken);
    const refreshToken = getCookie('refreshToken');
    console.log("refreshing " +  refreshToken);
    console.log("token " +  token);
    // Refresh the token if it doesn't exist
    if (!storedToken && refreshToken) {
    
      const tokenResponse = await axios.post(`${apiUrl}/refresh-token`, { authToken });
   
      storedToken = tokenResponse.data.accessToken;
      console.log("This stored: " + JSON.stringify(storedToken));
      Cookies.set('authToken', storedToken);
    }
    if (authToken) {
    // Validate required fields
    if (!entry.title.trim() || !entry.content.trim()) {
      alert("Title and content are required.");
      return;
    }
    try {
      // Prepare form data for multipart upload
      const formData = new FormData();
      formData.append('title', entry.title);
      formData.append('content', entry.content);
      formData.append('tags', JSON.stringify(tags.map((tag) => tag.name)));
      formData.append('updatedAt', entry.updatedAt);
      formData.append('user', entry.user);
      
      // Add images to remove
      if (imagesToRemove.length > 0) {
        formData.append('removeImages', JSON.stringify(imagesToRemove));
      }
      
      // Add new images
      newImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.put(`${apiUrl}/edit/${entry._id}`, formData, {
      

        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  console.log(response.data);
      console.log("Journal entry updated successfully:", response.data);
      onSubmit(response.data.entry); // Notify parent component of successful submission
    } catch (err) {
      if (axios.isAxiosError(err)) {  // Check if it's an Axios error
        const axiosError = err as AxiosError; // Cast to AxiosError
        if (axiosError.response) {
          // If the response exists, log and display the error
          console.error("Error updating journal entry:", axiosError.response.data);
          //alert("Error updating journal entry: " + axiosError.response.data.message);
        } else {
          console.error("Axios error with no response:", axiosError.message);
          alert("Error updating journal entry: " + axiosError.message);
        }
      } else {
        // In case the error is not an Axios error
        console.error("Unexpected error:", err);
        alert("Unexpected error occurred. Please try again.");
      }
    }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        {initialValues ? 'Edit Journal Entry' : 'Create New Journal Entry'}
      </h2>
      <input
        type="text"
        value={entry.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Title"
        className="text-2xl font-semibold w-full mb-4"
      />
      <textarea
        value={entry.content}
        onChange={(e) => handleChange('content', e.target.value)}
        placeholder="Content"
        className="mt-4 text-lg text-gray-700 w-full p-2 border rounded"
      />
       <div className="mt-4 relative">
      <label htmlFor="tags" className="block font-semibold">
        Tags:
      </label>
      <input
        type="text"
        id="tags"
        value={query}
        onChange={handleTagChange}
        placeholder="Type to search for tags"
        className="w-full p-2 border rounded"
      />
      {/* Floating tag suggestions dropdown */}
      {tagSuggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {tagSuggestions.map((tag) => (
            <div
              key={tag._id}
              onClick={() => handleAddTag(tag)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
        <div className="flex flex-wrap mt-2">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-blue-500 text-white py-1 px-3 rounded-full m-1 flex items-center"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag._id)}
                className="ml-2 text-white font-bold hover:text-gray-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      
      {/* Images Section */}
      <div className="mt-4">
        <label className="block font-semibold mb-2">Images:</label>
        
        {/* Existing Images */}
        {entry.images && entry.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current Images:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {entry.images.map((image, index) => {
                const isMarkedForRemoval = imagesToRemove.includes(index);
                return (
                  <div key={index} className={`relative group ${isMarkedForRemoval ? 'opacity-50' : ''}`}>
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => isMarkedForRemoval ? handleRestoreImage(index) : handleRemoveExistingImage(index)}
                      className={`absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors ${
                        isMarkedForRemoval 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {isMarkedForRemoval ? '↶' : '×'}
                    </button>
                    {isMarkedForRemoval && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 text-xs font-medium">Will be removed</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* New Images Upload */}
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        {/* New Images Preview */}
        {newImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">New Images ({newImages.length}):</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {newImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`new-${index}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

  


export default EditJournalEntryForm;


