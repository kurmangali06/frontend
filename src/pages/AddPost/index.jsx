import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from '../../axios'

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slice/auth";
import { Navigate, useNavigate , useParams } from "react-router";
import { useRef } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const inputFile = useRef(null)

  const isEditing = Boolean(id)
  
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузки файла")
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
   };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        text
      }

      const { data } = isEditing 
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`)
    } catch (error) {
      console.warn(error)
      alert("Ошибка при загрузки файла")
    }
  }
  useEffect(()=> {
    if(id) {
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl)
      }).catch(err => {
        console.warn(err);
        alert("Ошибка при получения статьй")
      })
    }
  }, [])
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFile.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" onChange={handleChangeFile} hidden ref={inputFile} />
      {imageUrl && (
        <><Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button><img
            className={styles.image}
            src={`http://localhost:5000${imageUrl}`}
            alt="Uploaded" /></>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
         {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
