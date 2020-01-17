import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { getCanvasCtx, clickedInEmptySpace, imageDataToMap, DistanceData, drawPath } from './utils/image-data';
import { grassFire, searchPath } from './utils/grass-fire';
import { Point } from './utils/point';
import SizeMap from './utils/size-map';

const POINT_SIZE = 14
const POINT_STYLE = {
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

const MAX_CANVAS_WIDTH = 900

const App: React.FC = () => {
  // const [file, setFile] = useState('')
  const [imageFile, setImageFile] = useState<File|null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('img/'+EXAMPLE_IMAGES[0])
  const [imageData, setImageData] = useState<Uint8ClampedArray>()
  const [grassFireMap, setGrassFireMap] = useState<DistanceData>()
  const [click1, setClick1] = useState(INIT_CLICK)
  const [click2, setClick2] = useState(INIT_CLICK)
  const [countClicks, setCountClicks] = useState(0)
  const incrementClick = () => setCountClicks(countClicks+1)

  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const updateImageCanvas = (imagePreviewUrlParam='') => {
    // READ IMAGE AND SHOW IT IN CANVAS
    const [canvas, ctx] = getCanvasCtx(canvasRef)
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
          // console.log(JSON.stringify(imageData))
          SizeMap.getInstance().setSize(canvas.width, canvas.height)
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

  const clickImage = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    const clickState = ['start', 'end', 'reset'][countClicks % 3] 
    const click = {
      x: e.clientX,
      y: e.clientY
    }
    console.log('clickedInEmptySpace(click)', clickedInEmptySpace(canvasRef, click))
    if(!clickedInEmptySpace(canvasRef, click) && clickState!=='reset') {
      return // skip if you click in the wall
    }
    incrementClick()

    switch (clickState) {
      case 'start':
        setClick1(click)
        break;
      case 'end':
        setClick2(click)
        if(imageData){
          const mapData = imageDataToMap(imageData)
          // console.log('mapData',JSON.stringify(mapData))
          // const grassFireMap = grassFire(mapData, new Point(0,0))
          const goalPoint = Point.FROM_CLICK(click, canvasRef.current as HTMLCanvasElement)
          const grassFireMap = grassFire(mapData, goalPoint)
          setGrassFireMap(grassFireMap)

          console.log('grassFireMap', grassFireMap)
          // CALCULATE PATH
          const startPoint = Point.FROM_CLICK(click1, canvasRef.current as HTMLCanvasElement)
          const pathPoints = searchPath(grassFireMap, startPoint, goalPoint)
          console.log('pathPoints', pathPoints)
          const [, ctx] = getCanvasCtx(canvasRef)
          if (ctx){
            drawPath(pathPoints, ctx)
          }
        }
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
        {click1.x > 0 && <div className="point-click point-start" style={{...POINT_STYLE,
          top: click1.y-POINT_SIZE/2,
          left: click1.x-POINT_SIZE/2,
        }}></div>}
        {click2.x > 0 && <div className="point-click point-end" style={{...POINT_STYLE,
          top: click2.y-POINT_SIZE/2,
          left: click2.x-POINT_SIZE/2,
        }}></div>}
      </main>
    </div>
  );
}

export default App;
