import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  // const [file, setFile] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let reader = new FileReader()
    const {files} = e.target
    const file = files && files[0]
    reader.onloadend = () => {
      // setFile(file)
      if('string' === typeof reader.result)
        setImagePreviewUrl(reader.result)
    }
    file && reader.readAsDataURL(file)
  }

  return (
    <div className="App">
      <header className="App-header">

      </header>
      <main>
      <form>
          <input className="fileInput" 
            type="file" 
            onChange={handleImageChange} />
        </form>
        <div className="imgPreview">
          {imagePreviewUrl && <img src={imagePreviewUrl} alt="map" />}
        </div>
      </main>
    </div>
  );
}

export default App;
