import React, {useState} from 'react'
import axios from 'axios';
import '../styles/entry.css'
import { formatDistanceToNow } from 'date-fns';

import JournalEntryProps from '../interface/JournalEntryProps';
import { ImageMetadata } from '../interface/JournalEntryProp';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./JournalEntryLayout/card";
import { Avatar, AvatarFallback, AvatarImage } from "./JournalEntryLayout/avatar"
import { Badge } from "./JournalEntryLayout/badge"
import { Switch } from "./JournalEntryLayout/switch"
import { Label } from "./JournalEntryLayout/label"
import { MessageCircleIcon as ChatBubbleIcon, HeartIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "./JournalEntryLayout/button"

import EditJournalEntryForm from './EditJournalEntryForm';
import { useAuth } from './Default/AuthProvider';

const JournalEntry: React.FC<JournalEntryProps> = ({entry,isOwner,ownerName,onDelete,onEdit}) =>{
   const { authToken,login, username: loggedInUsername ,loginUserUserId,error,apiUrl } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [openSolutions, setOpenSolutions] = useState<number[]>([]); // Not currently used, but available for future expansion

  const [isIssuesVisible, setIsIssuesVisible] = useState(false); // Not currently used, but available for future expansion
  const handleDeleteEntry = async (entryId: string) => {

    // Ask the user for confirmation before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');

    if (confirmDelete ) {
     try {
       // Make the API call to delete the journal entry
       const response = await axios.delete(`${apiUrl}/delete/${entryId}`,
        {
          headers:{
              Authorization: `Bearer ${authToken}`,
          },
          withCredentials:true,
      }
       )

       console.log("This is sent in edit" + response.data.message); // You can log the success message

       // Call the onDelete function passed via props to update the state
       onDelete(entryId); // Update state in the parent component
       alert('Post Deleted.');
     } catch (error) {
       console.error('Error deleting the entry:', error);
       alert('Failed to delete the entry.');
     }
 }
}

const toggleSolution = (index: number) => {
  // Currently not in use, but kept for consistency with the design example
  setOpenSolutions((prev) => (prev.includes(index)? prev.filter((i) => i!== index) : [...prev, index]));
};

return (
  <Card className="max-w-2xl mx-auto my-8 border border-gray-300 hover:border-gray-400">
    <CardHeader className="border-b border-gray-300 py-2 px-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={''} alt={entry.user|| 'User'} />
          <AvatarFallback>{entry.user.slice(0, 2).toUpperCase() || 'NA'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{ownerName || 'Unknown User'}</h2>
          <p className="text-sm text-gray-500">
            {/*entry.user?.JobTitle*/  'Unknown Job Title'} at {/*entry.user?.company*/ 'Unknown Company'}
          </p>
        </div>
        <span className="ml-auto text-sm text-gray-400">{entry.createdAt ? formatDistanceToNow(new Date(entry.createdAt)) + ' ago' : 'Unknown Date'}</span>
      </div>
    </CardHeader>
    <CardContent>
  {isEditing ? (
    <EditJournalEntryForm
      initialValues={{
        _id: entry._id || '',
        title: entry.title || 'Untitled',
        content: entry.content || 'No Content',
        tags: entry.tags || [],
        user: entry.user,
        createdAt: entry.createdAt || '',
        updatedAt: entry.updatedAt || '',
      }}
      onSubmit={()=>setIsEditing(true)}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <>
      <div className="prose max-w-none text-left">
        <h3 className="text-xl font-bold mb-2">{entry.title || 'No Title'}</h3>
        <p className="mb-4">{entry.content || 'No Content'}</p>

        {/* Images Display */}
        {entry.images && entry.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entry.images
                .sort((a, b) => a.order - b.order)
                .map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => window.open(image.url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                        Click to view full size
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 mb-4 text-left">
          <Switch
            id={`show-issues-${'unknown'}-${entry.createdAt || 'unknown'}`}
            checked={isIssuesVisible}
            onCheckedChange={setIsIssuesVisible}
          />
          <Label htmlFor={`show-issues-${'unknown'}-${entry.createdAt || 'unknown'}`}>
            {isIssuesVisible ? 'Hide Issues' : 'Show Issues'}
          </Label>
        </div>
        {/*isIssuesVisible && entry.content?.issues?.length > 0 && (
          <div className="space-y-2">
            {entry.content.issues.map((issue, index) => (
              <Collapsible key={index} className="border rounded-md">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex justify-between w-full p-2 text-left"
                    onClick={() => toggleSolution(index)}
                  >
                    <span>{issue.problem || 'No problem'}</span>
                    {openSolutions.includes(index) ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 bg-muted">
                  <p className="text-sm">{issue.solution || 'No solution available'}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )*/}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {entry.tags?.length > 0 ? (
          entry.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag.name || 'No Name'}
            </Badge>
          ))
        ) : (
          <span className="text-gray-500">No tags</span>
        )}
      </div>
    </>
  )}
</CardContent>
<CardFooter className="border-t border-gray-300 pt-4">
  <div className="flex justify-between w-full">
    <span className="text-gray-600 flex items-center">
      <HeartIcon className="w-5 h-5 mr-1" />
      <span>{/*entry.likes*/  0}</span>
      <span className="ml-1">Likes</span>
    </span>

    {/* Comment Button */}
    <span className="text-gray-600 flex items-center cursor-pointer" /*onClick={handleCommentClick}*/>
      <ChatBubbleIcon className="w-5 h-5 mr-1" />
      <span>{/*entry.comments*/  0}</span>
      <span className="ml-1">Comments</span>
    </span>

    {isOwner && (
      <div className="flex justify-end space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600"
          onClick={() => setIsEditing(true)}
        >
          <ChevronUpIcon className="w-5 h-5 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600"
          onClick={() => handleDeleteEntry(entry._id || '')}
        >
          <ChevronDownIcon className="w-5 h-5 mr-1" />
          Delete
        </Button>
      </div>
    )}
  </div>
</CardFooter>
  </Card>
);
}

export default JournalEntry;
