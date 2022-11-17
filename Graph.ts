import { Id, IGroup, ISku, ITag } from './data';

interface AdjacencyList {
  [key: Id]: Set<{ node: Id; weight: number }>;
}

export class Graph {
  adjacencyList: AdjacencyList = {};

  addVertex(vertex: Id) {
    this.adjacencyList[vertex] = new Set();
  }

  addEdge(vertex1: Id, vertex2: Id, weight: number = 1) {
    this.adjacencyList[vertex1].add({ node: vertex2, weight });
    this.adjacencyList[vertex2].add({ node: vertex1, weight });
  }

  addAllEdges(items: Id[], weight: number) {
    for (let i = 0; i <= items.length - 2; i++) {
      for (let j = i + 1; j <= items.length - 1; j++) {
        this.addEdge(items[i], items[j], weight);
      }
    }
  }

  addSiblingEdges(items: Id[]) {
    for (let i = 1; i <= items.length - 1; i++) {
      this.addEdge(items[i], items[i - 1]);
    }
  }

  dfs(startVertex, callback) {
    let list = this.adjacencyList; // список смежности
    let stack = [{ node: startVertex, weight: 0 }]; // стек вершин для перебора
    let visited = { [startVertex]: 1 }; // посещенные вершины

    const handleVertex = (vertex) => {
      // вызываем коллбэк для посещенной вершины
      callback(vertex);

      // получаем список смежных вершин
      let reversedNeighboursList = [...list[vertex.node]].reverse();

      reversedNeighboursList.forEach((neighbour) => {
        if (!visited[neighbour.node]) {
          // отмечаем вершину как посещенную
          visited[neighbour.node] = 1;

          // if (neighbour.weight + vertex.weight < this.maxDFSWeight) {
          // добавляем в стек только то, что ближе чем макс расстояние по весам
          stack.push({
            node: neighbour.node,
            weight: neighbour.weight + vertex.weight,
            prev: vertex,
          });
          // }
        }
      });
    };

    // перебираем вершины из стека, пока он не опустеет
    while (stack.length) {
      let activeVertex = stack.pop();
      handleVertex(activeVertex);
    }
    /*
    // проверка на изолированные фрагменты
    stack = Object.keys(this.adjacencyList);

    while (stack.length) {
      let activeVertex = stack.pop();
      if (!visited[activeVertex]) {
        visited[activeVertex] = 1;
        handleVertex(activeVertex);
      }
    }*/
  }
}

export class SkuGraph extends Graph {
  maxDFSWeight: number;

  setUp({
    groups,
    skus,
  }: {
    groups: { group: IGroup; tags: ITag[] }[];
    skus: ISku[];
  }) {
    this.adjacencyList = {};
    this.maxDFSWeight = groups.length;

    console.log({ groups, skus });

    skus.forEach((sku) => {
      this.addSiblingEdges(sku.tags);
    });

    groups.forEach((group) => {
      this.addAllEdges(
        group.tags.map((tag) => {
          this.addVertex(tag.id);
          return tag.id;
        }),
        this.maxDFSWeight - 1
      );
    });
  }

  handleSelect(tagId: ITag['id'], callback) {
    this.dfs(tagId, (vertex) =>
      callback(vertex.node, vertex.weight < this.maxDFSWeight)
    );
  }
}
