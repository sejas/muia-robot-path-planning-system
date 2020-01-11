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
  const [click1, setClick1] = useState({x:-1,y:-1})
  const [click2, setClick2] = useState({x:-1,y:-1})
  const [countClicks, setCountClicks] = useState(0)
  const incrementClick = () => setCountClicks(countClicks+1)

  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const getCanvasCtx = ():[HTMLCanvasElement|null, CanvasRenderingContext2D|null] => {
    const canvas = canvasRef.current
    if( canvas){
      const ctx = canvas.getContext("2d")
      if(ctx){
        return [canvas, ctx]
      }
    }
    return [null, null]
  }

  const updateImageCanvas = (imagePreviewUrlParam='') => {
    // READ IMAGE AND SHOW IT IN CANVAS
    const [canvas, ctx] = getCanvasCtx()
    if(canvas && ctx && imagePreviewUrl){
        img.src = imagePreviewUrlParam || imagePreviewUrl
        canvas.width = window.innerWidth*0.9
        setTimeout(()=>{
          const scale = canvas.width / img.width
          canvas.height = scale*img.height
          ctx.clearRect(0,0, canvas.width, canvas.height)
          // ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          setImageData(imageData)
          // console.log(JSON.stringify(imageData))
        }, 500)
    }
  }
  useEffect(updateImageCanvas, [])

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader()
    const {files} = e.target
    const file = files && files[0]
    reader.onloadend = () => {
      // setFile(file)
      if('string' === typeof reader.result){
        // const imagePreviewUrl = reader.result
        setImagePreviewUrl(reader.result)
        setImageFile(file)
        updateImageCanvas(reader.result)
      }
    }
    file && reader.readAsDataURL(file)
  }

  useEffect(()=>{
    console.log(countClicks)
    const [canvas, ctx] = getCanvasCtx()
    if (canvas && ctx && click1.x > 0){
      const startX = click1.x - canvas.offsetLeft
      const startY = click1.y - canvas.offsetTop
      const pixelData = ctx.getImageData(startX, startY, 1,1).data
      // ctx.fillRect(startX-1,startY-1,2,2) // DEBUG
      console.log('pixelData!!', pixelData)
    }
  },[click1, click2])

  const clickImage = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    incrementClick()
    setClick1({
      x: e.clientX,
      y: e.clientY
    })
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
        {click1.x > 0 && <div className="point-click" style={{...POINT,
          top: click1.y-POINT_SIZE/2,
          left: click1.x-POINT_SIZE/2,
        }}></div>}
      </main>
    </div>
  );
}

export default App;
