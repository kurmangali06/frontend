import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'
import { useParams } from "react-router-dom"
import { Post } from "../components/Post";

import axios from "../axios"

export const FullPost = () => {
  const [data, setData ] = useState()
  const [isLoading, setLoading ] = useState(true)
  const {id} = useParams()
  
  useEffect(()=> {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setLoading(false)
    }).catch(err => {
      console.warn(err);
      alert("Ошибка получении статьи")
    })
  }, [])


  if(isLoading) {
    return <Post isLoading={isLoading}  isFullPost/>
  }

  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:5000${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        isFullPost
      >
        <ReactMarkdown children ={data.text} />
      </Post>
    </>
  );
};
