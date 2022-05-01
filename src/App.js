import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

import './App.css';

function App() {
  const storage = getStorage();
  const [images, setImages] = useState([]);
  const imagesStorageRef = ref(storage, "images-mil");
  const [imageSelected, setImageSelected] = useState('');

  useEffect(() => {
    listAll(imagesStorageRef).then(function(result) {
      result.items.forEach(function(imageRef) {
        getDownloadURL(imageRef).then(function(url) {
          setImages(image => [...image, url]);
        }).catch(function(error) {
          console.log('error', error);
        });
      });
    }).catch(function(error) {
      console.log('error', error);
    });
  }, []);

  const handleFileInput = (blob) => {
    if(blob.type === 'image/jpeg' && blob.size < 1000000) {
      const storageRef = ref(storage, `images-mil/${blob.name}`);
      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(ref(storage, snapshot.metadata.fullPath))
        .then((url) => {
          if(images.length < 1000){
            setImages(images => [...images, url]);
          }
        })
      });
    } else {
      alert('Formato de imagen incorrecto o muy grande, solo ,se admiten .jpg menores a 1MB');
    }
  }

  const showImageSelected = (url) => {
    setImageSelected(url);
  }

  return (
    <div className="App">
      <div className="header-title">
        <h1>Agrega tu foto</h1>
        <p>Vamos a crear una obra de arte conformada con mil fotos de las personas mas guapas del planeta. :)</p>
        <form>
          <input
            type="file"
            onChange={(e) => handleFileInput(e.target.files[0])}
          />
        </form>
      </div>
      <div className="image-selected">
          {imageSelected &&
            <img src={imageSelected} alt="thumbnail of photos"/>
          }
      </div>
      <div className="box-images">
        {images.map((image, index) => {
          return (
            <div key={index}>
              <img src={image} onClick={() => showImageSelected(image)} alt="mini photos"/>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
