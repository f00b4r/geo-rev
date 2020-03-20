declare module 'static-kdtree' {
  function createKDTree(points: number[][]): KDTree;
  export = createKDTree;
}

interface KDTree {
  nn(point: number[]): number;
}


