import { Id, IGroup, ISku, ITag } from './data';

interface Vertex {
  node: Id;
  weight: number;
  prev?: Vertex;
}

interface AdjacencyList {
  [key: Id]: Set<Vertex>;
}

export class Graph {
  adjacencyList: AdjacencyList = {};

  addVertex(vertex: Id) {
    this.adjacencyList[vertex] = new Set();
  }

  addEdge(vertex1: Id, vertex2: Id, payload: string, weight: number = 1) {
    this.adjacencyList[vertex1].add({ node: vertex2, weight, payload });
    this.adjacencyList[vertex2].add({ node: vertex1, weight, payload });
  }

  addAllEdges(items: Id[], payload: string, weight: number) {
    for (let i = 0; i <= items.length - 2; i++) {
      for (let j = i + 1; j <= items.length - 1; j++) {
        this.addEdge(items[i], items[j], payload, weight);
      }
    }
  }

  dfs(startVertex, callback, isValid) {
    let list = this.adjacencyList; // список смежности
    let stack = [{ node: startVertex, weight: 0 }]; // стек вершин для перебора
    let visited = { [startVertex]: 1 }; // посещенные вершины

    const handleVertex = (vertex: Vertex) => {
      // вызываем коллбэк для посещенной вершины
      callback(vertex);

      // получаем список смежных вершин
      let reversedNeighboursList = [...list[vertex.node]].reverse();

      reversedNeighboursList.forEach((neighbour: Vertex) => {
        if (!visited[neighbour.node]) {
          if (isValid({ vertex: neighbour, prev: vertex })) {
            // отмечаем вершину как посещенную
            visited[neighbour.node] = 1;
            // добавляем в стек только то, что проходят валидацию
            stack.push({
              node: neighbour.node,
              weight: neighbour.weight + vertex.weight,
              prev: vertex,
            });
          }
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

  addSiblingEdges(items: Id[], tags: ITag[]) {
    for (let i = 1; i <= items.length - 1; i++) {
      this.addEdge(
        items[i],
        items[i - 1],
        [
          tags.find((tag) => tag.id === items[i]),
          tags.find((tag) => tag.id === items[i - 1]),
        ]
          .sort()
          .join('-')
      );
    }
  }

  setUp({
    groups,
    skus,
    tags,
  }: {
    groups: { group: IGroup; tags: ITag[] }[];
    skus: ISku[];
    tags: ITag[];
  }) {
    this.adjacencyList = {};
    this.maxDFSWeight = groups.length;

    console.log({ groups, skus });

    groups.forEach((group) => {
      this.addAllEdges(
        group.tags.map((tag) => {
          this.addVertex(tag.id);
          return tag.id;
        }),
        'groups',
        this.maxDFSWeight - 1
      );
    });

    skus.forEach((sku) => {
      this.addSiblingEdges(sku.tags, tags);
    });
  }

  handleSelect(tagId: ITag['id'], callback, disabled: Id[]) {
    this.dfs(
      tagId,
      (vertex) => {
        console.log(vertex, vertex.weight < this.maxDFSWeight);
        callback(vertex.node, vertex.weight < this.maxDFSWeight);
      },
      ({ vertex, prev }) => {
        if (vertex.weight + prev.weight >= this.maxDFSWeight) {
          return false;
        }

        if (disabled.includes(vertex.node)) {
          return false;
        }

        return true;
      }
    );
  }
}
