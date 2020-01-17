export default class SizeMap {
    private static instance: SizeMap;
    a = 0
    b = 0
    private constructor() {}
    
    public static getInstance(): SizeMap {
        if (!SizeMap.instance) {
            SizeMap.instance = new SizeMap();
        }

        return SizeMap.instance;
    }

    setSize(a:number,b:number){
        SizeMap.instance.a = a
        SizeMap.instance.b = b
    }
}