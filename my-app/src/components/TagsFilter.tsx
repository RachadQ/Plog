
  import React, { useState, useEffect,useCallback,useRef } from "react";
 
  import TagsFilterProps from "../interface/TagFIlterProps";


  const TagsFilter: React.FC<TagsFilterProps> = ({ selectedTag, setSelectedTag, allTags }) => {
    const [activeTag, setActiveTag] = useState<string>("All");
    const handleTagClick = (tag: string) => {
      setSelectedTag(tag);
    };
    const initialized = useRef(false); // Prevents multiple initial calls

      return (
        
        <div className="tags-filter flex justify-center items-center w-full">
        <div className="flex flex-wrap gap-2 justify-center">
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium border 
                ${selectedTag === tag
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-200 text-gray-700 border-gray-300"
                } hover:bg-blue-500 hover:text-white transition`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      );
  };
  
  export default TagsFilter;