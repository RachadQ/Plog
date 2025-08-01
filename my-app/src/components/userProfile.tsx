import React, { useEffect, useState,useRef,useCallback } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ProfileWithEntriesResponse } from '../types';
import JournalEntryProp from "../interface/JournalEntryProp";
import '../styles/profile.css';
import UserJournalSection from "./UserJournalSection";
import { useAuth } from "../components/Default/AuthProvider";
import GoogleAd from "./GoogleAd";
import FileUpload from "./FileUpload";
import { Console } from "console";

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileWithEntriesResponse | null>(null);
  
  const { username: loggedInUsername ,loginUserUserId,error, apiUrl} = useAuth();
 
  const [entries, setEntries] = useState<JournalEntryProp[]>([]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryProp[]>(entries);
 


  /** Fetch Profile & Entries */
  const fetchProfile = useCallback(async () => {
    if (!username || loading || !hasMoreEntries) return;
    
    //setLoading(true);
    try {
      
      
      // Fetch Profile and Journal Entries
      const response = await axios.get(
        `${apiUrl}/user/${username}/profile`
      );
      
      
      setProfile(response.data);
      
   
        
    } catch (err) {
      console.error("Error fetching profile:", err);
      //error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl,username]);

  /** Fetch Tags */
  const fetchAllTags = useCallback(async () => {
    try {
      
      const tagResponse = await axios.get(`${apiUrl}/get/${username}/tags`);
      console.log();
      setTags(tagResponse.data.map((tag: { name: string }) => tag.name));

    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }, [username]);

    /** Fetch Entries with Pagination + Tag */
  const fetchEntries = useCallback(async (pageToFetch = page) => {
    if (!username || loading || !hasMoreEntries) return;

    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/user/${username}/entries`, {
        params: {
          page: pageToFetch,
          limit: 5,
         // tag: selectedTag
          ...(selectedTag !== 'All' && { tag: selectedTag })
        }
      });

      

      
      const newEntries = response.data.journalEntries;
    const totalEntries = response.data.totalEntries;

    console.log(`Fetched page ${pageToFetch}:`, {
      received: newEntries.length,
      total: totalEntries,
      hasMore: newEntries.length > 0 && (pageToFetch * 5 < totalEntries)
    });

    if (pageToFetch > 1 && newEntries.length === 0) {
      setHasMoreEntries(false);
      return;
    }

    if (pageToFetch === 1) {
      setEntries(newEntries); // RESET
      console.log(entries);
    } else {
      setEntries(prevEntries => [...prevEntries, ...newEntries]);
      console.log(entries);
    }

    
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, username, page, selectedTag,entries]);

    /** Fetch Profile & Tags on Mount or Page Change */
    useEffect(() => {
      console.log("fetching profile")
     
      fetchProfile();
     // fetchAllTags();
      
    }, [fetchProfile]);
    //only on mount:  }, [fetchProfile, fetchAllTags]);

    useEffect(() => {
      console.log("fetching Tags")
     
   
      fetchAllTags();
      
    }, [ username,apiUrl,fetchAllTags]);
    useEffect(() => {
      const resetAndFetch = async () => {
        console.log("resetting ");
        setEntries([]);
        setPage(1);
        setHasMoreEntries(true);
     //  fetchEntries(); // force fetch page 1
      await fetchEntries(1);
      };
    
      resetAndFetch();
    }, [selectedTag]);
   
   useEffect(() => {
    if(!loading && hasMoreEntries){
    console.log("fetching entries")
    fetchEntries();
    }
  }, [page]);
    
  /** Infinite Scroll Observer */
 useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMoreEntries && !loading) {
        console.log("Intersection observed, loading next page...");
        setPage(prev => prev + 1);
      }
    },
    { threshold: 1 }
  );

  const loader = loaderRef.current;
  if (loader) {
    observer.observe(loader);
  }

  return () => {
    if (loader) {
      observer.unobserve(loader);
    }
  };
}, [hasMoreEntries, loading]);

  useEffect(() => {
    if (!entries || !tags) return;
    
    console.log("Entries to filter:", entries);
    
  
    // Only apply filtering when entries and tags are available
    if (entries.length > 0) {
      if (tags.length > 0) {
        setFilteredEntries(
          entries.filter((entry) =>
            tags.some((tag) =>
              entry.tags.some((entryTag) => entryTag.name === tag) // If entry.tags is an array of TagProp with name field
            )
          )
        );
      } else {
        setFilteredEntries(entries); // If no tags selected, show all entries
      }
    }
  }, [entries,tags ]); 
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return <div className="p-6">Loading profile...</div>;

  const handleAddEntry = (newEntry: JournalEntryProp) => {
    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const deleteEntry = (entryId: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== entryId));
  };

  const editEntry = (entry: JournalEntryProp) => {
    setEntries((prevEntries) =>
     
      prevEntries.map((e) => (e._id === entry._id ? entry : e
        
      ))
    );
  };

 
 
  const downloadResume = async () => {
   // const googleDriveLink = "https://drive.google.com/uc?export=download&id=1UsBGAJXyWdA9WQxzJeGj85fsSDKZFEVI";
  //window.location.href = googleDriveLink;

     alert('Integrating a safe privacy protected resume upload, please come back later.');
  };

 

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
  {/* User Profile Section */}
  <section className="py-6 md:py-2 bg-white rounded-lg shadow-md mb-3">
    <div className="container max-w-screen-xl mx-auto px-4">
      <nav className="flex items-center justify-between mb-8 md:mb-16">
        <div className="px-5 py-2 md:px-7 md:py-3 bg-white font-medium md:font-semibold text-gray-700 text-sm md:text-md rounded-md hover:bg-gray-700 hover:text-white transition ease-linear duration-500">
          <button id="downloadBtn" onClick={downloadResume} value="download">
            Get my CV
          </button>
        </div>
      </nav>
      <div className="text-center">
     {/* File Upload Section */}
  <section className="py-4">
        <FileUpload userId={profile.id} profilePicture={profile.profilePicture}/> {/* Using FileUpload Component here */}
      </section>

        <h6 className="font-medium text-gray-600 text-lg md:text-2xl uppercase mb-0 md:mb-0">
          {profile.firstName} {profile.lastName}
        </h6>
      </div>
    </div>
  </section>

  {/*Google ad Section*/}
  <section className="py-4">
            <GoogleAd/>
  </section>

  
  {/* Journal Entries Section */}
  <section className="py-6 md:py-4 mb-3">
    <UserJournalSection
          entries={entries}
          //filteredEntries={filteredEntries}
          // setFilteredEntries={setFilteredEntries}
          handleAddEntry={handleAddEntry}
          authenticatedUserId={loginUserUserId || ''}
          userName={profile.firstName + " " + profile.lastName}
          deleteEntry={deleteEntry}
          editEntry={editEntry}
          profileUserId={profile.id}
          allTags={tags}
          setSelectedTag={setSelectedTag}
          hasEntries={entries.length > 0} filteredEntries={[]} setFilteredEntries={function (entries: JournalEntryProp[]): void {
            throw new Error("Function not implemented.");
          } } selectedTag={selectedTag}
    />
  </section>
  {/* Loader Element */}

  <div ref={loaderRef} className="loader"  style={{ height: '50px' }}>
        {loading ? <p>Loading...</p> : hasMoreEntries ? null : <p>No more entries</p>}
      </div>
</div>

    
  );
};

export default UserProfile;