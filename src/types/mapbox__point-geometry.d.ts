// 临时类型声明，解决编译时找不到 mapbox__point-geometry 类型定义的问题
declare module "mapbox__point-geometry" {
  interface Point {
    x: number;
    y: number;
  }
  const Point: {
    new (x?: number, y?: number): Point;
  };
  export = Point;
}
