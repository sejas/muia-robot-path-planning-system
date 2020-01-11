import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const POINT_SIZE = 10
const POINT = {
  width: POINT_SIZE,
  height: POINT_SIZE
}

const App: React.FC = () => {
  // const [file, setFile] = useState('')
  const [imageFile, setImageFile] = useState<File|null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Labirinto_003.svg/860px-Labirinto_003.svg.png')
  const [imageData, setImageData] = useState<Uint8ClampedArray>()
  const [click1, setClick1] = useState({x:0,y:0})

  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    // READ IMAGE AND SHOW IT IN CANVAS
    const canvas = canvasRef.current
    if( canvas && imagePreviewUrl){
      const ctx = canvas.getContext("2d")
      img.src = imagePreviewUrl
      if(ctx && img){
        setTimeout(()=>{
          const scale = canvas.width / img.width;
          canvas.height = scale*img.height
          ctx.clearRect(0,0, canvas.width, canvas.height)
          ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          setImageData(imgData)
        }, 500)
      }
    }
  }, [imagePreviewUrl, img])

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader()
    const {files} = e.target
    const file = files && files[0]
    reader.onloadend = () => {
      // setFile(file)
      if('string' === typeof reader.result)
        setImagePreviewUrl(reader.result)
        setImageFile(file)
    }
    file && reader.readAsDataURL(file)
  }

  const clickImage = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    const canvas = canvasRef.current
    if (canvas){
      setClick1({
        x: e.clientX - canvas.offsetLeft,
        y:e.clientY - canvas.offsetLeft
      })
    }
    console.log(click1)
  }

  return (
    <div className="App">
      <header className="App-header">

      </header>
      <main>
      <form>
          <input className="fileInput" 
            type="file" 
            onChange={handleImageChange}
            accept = "image/*"
            />
        </form>
        <canvas onClick={clickImage} ref={canvasRef} id="image-canvas"></canvas>
        {/* {click1.x > 0 && <div className="point-click" style={{...POINT,
          top: click1.y-POINT_SIZE/2,
          left: click1.x-POINT_SIZE/2,
        }}></div>} */}
      </main>
    </div>
  );
}

export default App;
