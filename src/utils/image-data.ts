// 4 elements of a pixel (RGBA)
type R = number
type G = number
type B = number
type A = number
type PixelData = [R,G,B,A] | Uint8ClampedArray
// One dimension array where each pixel has 4 values (RGBA).
type ImageData = Array<R|G|B|A> | Uint8ClampedArray
// One dimension array where each pixel has only 1 value (0|1).
type MapData = Array<0|1>
// One dimension array where each pixel has only 1 value (0|1|Distance|Infinity).
type Distance = 0|number
type DistanceData = Array<Distance>
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
      if(
        (pixelData[0] > 245 &&
        pixelData[1] > 245 &&
        pixelData[2] > 245) ||
        pixelData[3] === 0
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