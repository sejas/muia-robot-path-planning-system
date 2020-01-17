import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const POINT_SIZE = 14
const POINT = {
  width: POINT_SIZE,
  height: POINT_SIZE
}
const INIT_CLICK = {x:-1,y:-1}

const EXAMPLE_IMAGES = [
  'labyrinth.png',
  'prado.png',
  'dioscuri.png',
  'maze.png',
]

const MAX_CANVAS_WIDTH = 100

const App: React.FC = () => {
  // const [file, setFile] = useState('')
  const [imageFile, setImageFile] = useState<File|null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('img/'+EXAMPLE_IMAGES[0])
  const [imageData, setImageData] = useState<Uint8ClampedArray>()
  const [click1, setClick1] = useState(INIT_CLICK)
  const [click2, setClick2] = useState(INIT_CLICK)
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
        canvas.width = Math.min(window.innerWidth*0.8, MAX_CANVAS_WIDTH)
        setTimeout(()=>{
          const scale = canvas.width / img.width
          canvas.height = scale*img.height
          ctx.clearRect(0,0, canvas.width, canvas.height)
          // ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          setImageData(imageData)
          console.log(JSON.stringify(imageData.length))
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

  const getColorFromClick = (click:{x:number,y:number}):'white'|'black' => {
    const [canvas, ctx] = getCanvasCtx()
    if (canvas && ctx && click.x > 0){
      const startX = click.x - canvas.offsetLeft
      const startY = click.y - canvas.offsetTop
      const pixelData = ctx.getImageData(startX, startY, 1,1).data
      // ctx.fillRect(startX-1,startY-1,2,2) // DEBUG
      console.log('pixelData!!', pixelData)
      if(
        (pixelData[0] > 250 &&
        pixelData[1] > 250 &&
        pixelData[2] > 250) ||
        pixelData[3] === 0
      ){
        return 'white'
      }
    }
    return 'black'
  }

  const clickImage = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    const clickState = ['start', 'end', 'reset'][countClicks % 3] 
    const click = {
      x: e.clientX,
      y: e.clientY
    }
    console.log('getColorFromClick(click)', getColorFromClick(click))
    if(getColorFromClick(click) !== 'white' && clickState!=='reset') {
      return // skip if you click in the wall
    }
    incrementClick()

    switch (clickState) {
      case 'start':
        setClick1(click)
        break;
      case 'end':
        setClick2(click)
        break;
      case 'reset':
        setClick1(INIT_CLICK)
        setClick2(INIT_CLICK)
        break;
    
      default:
        break;
    }
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
        {click1.x > 0 && <div className="point-click point-start" style={{...POINT,
          top: click1.y-POINT_SIZE/2,
          left: click1.x-POINT_SIZE/2,
        }}></div>}
        {click2.x > 0 && <div className="point-click point-end" style={{...POINT,
          top: click2.y-POINT_SIZE/2,
          left: click2.x-POINT_SIZE/2,
        }}></div>}
      </main>
    </div>
  );
}

export default App;
