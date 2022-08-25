import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '@mui/material/Tabs';

import Grid from '@mui/material/Grid';


import { Post } from '../components/Post';
import { fetchPost } from '../redux/slice/post';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts } = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading'

  useEffect(() => {
    dispatch(fetchPost())
  }, [])


  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
      </Tabs>
      <Grid container>
        <Grid xs={8} item>
          {( isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
          isPostsLoading ? ( <Post key={index} isLoading={true} /> ) :
            (<Post
              id={obj._id}
              title={obj.title}
              imageUrl={ obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              isEditable={userData?._id === obj.user?._id}
            />)
          )}
        </Grid>
      </Grid>
    </>
  )
 
 
};
