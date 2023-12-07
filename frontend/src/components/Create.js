import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import axios from 'axios';
import { useNavigate } from 'react-router';

const Create = () => {
  const cat = ['travel', 'lifestyle', 'fashion', 'fitness', 'health', 'technology', 'gaming', 'sport', 'food',
    'family', 'education', 'craft', 'business', 'enterpreneurship', 'music', 'animal', 'pet', 'science',
    'motivation', 'enterntainment', 'environment', 'art', 'dance', 'social issue', 'coding', 'wedding',
    'car', 'bike', 'hip-hop', 'product']
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('travel')
  const [selectedImage, setSelectedImage] = useState(null);
  let userID = useSelector(state => state.userId)
  const navigate = useNavigate()
  if (userID === undefined)
    userID = ''

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': ['Arial', 'Helvetica', 'Verdana', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT', 'Roboto', 'Open Sans'] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background',
    'link',
  ];

  const handleTextChange = (value) => {
    setContent(value);
  };

  const addPhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setFile(file)
  }

  const create = async () => {
    console.log(file, title, content, category)
    if (file !== null && title !== '' && content !== '' && category !== '') {
      await axios.post(`http://localhost:5000/api/vlogs/${userID}/create`, {
        photo: file,
        title: title,
        story: content,
        category: category
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }
    navigate('/')
  }

  console.log(file)

  return (
    <div className='w-[1270px] flex mt-10 mb-10 flex-col gap-6 items-center'>
      <input type="text" placeholder='Title...' onChange={(e) => setTitle(e.target.value)} className='rounded-md px-2 text-xl border-[2px] border-gray-300 p-1 w-[1200px] outline-none h-11' />
      <div>
        <select onChange={(e) => setCategory(e.target.value)} className='text-white w-96 text-xl px-2 rounded-2xl capitalize bg-gray-400 h-10 outline-none'>
          {
            cat.map(item => (
              <option value={item}>{item}</option>
            ))
          }
        </select>
      </div>
      <div className='flex gap-5 text-white flex-col items-center'>
        <p>Select Image : </p>
        <input type="file" className='' onChange={(e) => addPhoto(e)} />
        {
          file &&
          <div className='w-80 h-52  rounded-2xl overflow-hidden'>
            <img src={selectedImage} alt="pic" className='rounded-2xl object-fill'/>
          </div>

        }
      </div>
      <ReactQuill
        theme="snow" // or 'bubble' for a different theme
        modules={modules}
        formats={formats}
        value={content}
        onChange={handleTextChange}
        className='w-[1200px] h-[500px]'
      />
      {/* <div>
        <p className='text-white'>Preview:</p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div> */}

      <button onClick={() => create()} className='text-white w-[200px] h-11 text-xl font-semibold bg-green-500 rounded-md mt-10'>Create</button>

    </div>
  );
};

export default Create;
