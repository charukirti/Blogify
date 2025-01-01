import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchPost } from "../store/fetchPostSlice";
import { useDispatch } from "react-redux";
import PostForm from "../ui/postForm/PostForm";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id))
        .then((result) => {
          if (result) {
            setPost(result.payload);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      navigate("/");
    }
  }, [id, dispatch, navigate]);
    
    console.log(post)
    return (
        <>
            {
                post ? (
                    <PostForm post={post} />
                ) : null
        }
        </>
  );
}
