import { Path } from './grass-fire'

// 4 elements of a pixel (RGBA)
type R = number
type G = number
type B = number
type A = number
export type PixelData = [R,G,B,A] | Uint8ClampedArray
// One dimension array where each pixel has 4 values (RGBA).
export type ImageData = Array<R|G|B|A> | Uint8ClampedArray
// One dimension array where each pixel has only 1 value (0|1).
export type MapData = Array<0|1>
// One dimension array where each pixel has only 1 value (0|1|Distance|Infinity).
export type Distance = 0|number
export type DistanceData = Array<Distance>
// It is always true that MapData.length == ImageData.length / 4

/**
 * Extract canvas and context from canvas ref
 */
export const getCanvasCtx = (canvasRef: React.RefObject<HTMLCanvasElement>):[HTMLCanvasElement|null, CanvasRenderingContext2D|null] => {
    const canvas = canvasRef.current
    if( canvas){
      const ctx = canvas.getContext("2d")
      if(ctx){
        return [canvas, ctx]
      }
    }
    return [null, null]
  }

/**
 * Given a click position, extract the PixelData and return if the place is empty or not
 * @param canvas 
 * @param ctx 
 * @param click 
 */
export const clickedInEmptySpace = (canvasRef:React.RefObject<HTMLCanvasElement>, click:{x:number,y:number}):boolean => {
    const [canvas, ctx] = getCanvasCtx(canvasRef)
    if (canvas && ctx && click.x > 0){
        const pixelData = getPixelFromClick(canvas, ctx, click)
        return pixelIsWhite(pixelData)
      }
      return false
}
export const getPixelFromClick = (canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D, click:{x:number,y:number}):PixelData => {
      const startX = click.x - canvas.offsetLeft
      const startY = click.y - canvas.offsetTop
      const pixelData = ctx.getImageData(startX, startY, 1,1).data
      return pixelData
}
export const pixelIsWhite = (pixelData:PixelData=[0,0,0,1]):boolean => {
      const LEVEL = 255/3
      if(
        (pixelData[0] > LEVEL  ||
        pixelData[1] > LEVEL ||
        pixelData[2] > LEVEL) ||
        pixelData[3] < LEVEL
      ){
        return true
      }
      return false
}

/**
 * Change the format from ImageData to MapData
 * ImageData is a sequence of RGBA points, MapData is a simple 0|Ininite sequence to show the walls
 * @param imageData 
 */
export const imageDataToMap = (imageData:ImageData):MapData => {
    const map:MapData = []
    for (let index = 0; index < imageData.length; index = index+4) {
        const emptySpace = pixelIsWhite([
            imageData[index],
            imageData[index+1],
            imageData[index+2],
            imageData[index+3],
        ])
        const mapPixel = emptySpace?0:1
        map.push(mapPixel)
    }
    return map
}

export const drawPath = (path:Path, ctx:CanvasRenderingContext2D) => {
  const WIDTH_STROKE = 4
  const HALF_STROKE = 5/2
  const imageData = ctx.createImageData(WIDTH_STROKE, WIDTH_STROKE);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i+0] = 249 // R
    imageData.data[i+1] = 166 // G
    imageData.data[i+2] = 2 // B
    imageData.data[i+3] = 255 // A 
  }
  
  if (path.length>0){
    path.forEach(p => {
      ctx.putImageData(imageData, p.j-HALF_STROKE, p.i-HALF_STROKE)
      
    });
  }
}

