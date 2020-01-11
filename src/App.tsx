import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const POINT_SIZE = 10
const POINT = {
  width: POINT_SIZE,
  height: POINT_SIZE
}

const App: React.FC = () => {
  // const [file, setFile] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [click1, setClick1] = useState({x:0,y:0})
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

  const clickImage = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    setClick1({x: e.clientX, y:e.clientY})
    console.log(e)
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
          {imagePreviewUrl && <img onClick={clickImage} src={imagePreviewUrl} alt="map" />}
        </div>
        {click1.x > 0 && <div className="point-click" style={{...POINT,
          top: click1.y-POINT_SIZE/2,
          left: click1.x-POINT_SIZE/2,
        }}></div>}
      </main>
    </div>
  );
}

export default App;
