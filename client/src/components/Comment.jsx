import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import moment from 'moment';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContnet, setEditedContent] = useState(comment.content);
  const [user, setUser] = useState({});

  console.log("comment=======",comment);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.creatorId}`);
        const data = await res.json(res);
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getUser();
  }, [comment])


  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "ContentType": "applicatioan/json"
        },
        body: JSON.stringify({
          Content: editedContnet
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment,editedContnet);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {
          isEditing ? (
            <>
              <Textarea className='mb-2' value={editedContnet} onChange={(e) => setEditedContent(e.target.value)} />
              <div className='flex justify-end gap-2 text-xs'>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>Save</Button>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <p className='text-gray-500 pb-2'>{comment.content}</p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button type='button'
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes && '!text-blue-500'}`}
                >
                  <FaThumbsUp className='text-sm' />
                </button>
                <p className='text-gray-400'>
                  {comment.likes > 0 && comment.likes + ' ' +
                    (comment.likes === 1 ? 'like' : 'likes')
                  }
                </p>
                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin)
                  && (
                    <>
                      <button type='button' onClick={handleEdit}
                        className='text-gray-400 hover:text-red-500'>
                        Edit
                      </button>
                      <button type='button' onClick={() => onDelete(comment._id)}
                        className='text-gray-400 hover:text-red-500'>
                        Delete
                      </button>
                    </>
                  )
                }
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Comment;