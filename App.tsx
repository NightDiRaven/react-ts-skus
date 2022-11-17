import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { groups, Id, skus, tags } from './data';
import { Graph, SkuGraph } from './Graph';

interface IChosenEntry {
  groupId: Id;
  tagId: Id;
}

const getArraysIntersection = (arr: Id[][]) => {
  return arr.reduce((p, c) => p.filter((e) => c.includes(e)));
};

function App() {
  const [chosen, setChosen] = useState<IChosenEntry[]>([]);
  const isTagChosen = (props: IChosenEntry) => {
    const { tagId, groupId } = props;
    return chosen.find(
      (entry) => entry.tagId === tagId && entry.groupId === groupId
    );
  };
  const chosenIds = useMemo(() => {
    return chosen.map((el) => el.tagId);
  }, [chosen]);

  const groupsPopulatedWithTags = useMemo(() => {
    return groups.map((group) => {
      return {
        group,
        tags: tags.filter((tag) => tag.groupId === group.id),
      };
    });
  }, []);

  const graph = new SkuGraph();

  graph.setUp({ groups: groupsPopulatedWithTags, skus });

  useEffect(() => {
    graph.setUp({ groups: groupsPopulatedWithTags, skus });
  }, [groupsPopulatedWithTags, skus]);

  const selectItem = (id) => {
    graph.handleSelect(id, (v, a) => console.log(v, a));
  };

  console.log(graph);
  selectItem(tags[0].id);

  const tagIdToSku = useMemo(() => {
    const map: { [key: Id]: Id[] } = {};

    tags.forEach((tag) => {
      map[tag.id] = [];
    });

    skus.forEach((sku) => {
      sku.tags.forEach((tagId) => {
        map[tagId].push(sku.id);
      });
    });
    return map;
  }, []);

  const skuIdToTags = useMemo(() => {
    return Object.fromEntries(skus.map((sku) => [[sku.id], sku.tags]));
  }, []);

  const availableTags = useMemo<Id[]>(() => {
    if (chosen.length === 0) {
      return [];
    }

    const commonTags = chosenIds.map((id) => [...tagsGraph[id]]);

    const tagsIntersection = [
      ...getArraysIntersection(commonTags),
      ...chosenIds,
    ];

    const resultTagsCollection = new Set(tagsIntersection);

    if (chosen.length >= 2) {
      const chosenSkus = [];

      for (
        let i = 0;
        i < chosen.length && i < groupsPopulatedWithTags.length - 1;
        i++
      ) {
        chosenSkus.push(tagIdToSku[chosenIds[i]]);
      }
      const chosenSkusIntersection = getArraysIntersection(chosenSkus);

      chosenSkusIntersection.forEach((skuId) => {
        const skuTags = skuIdToTags[skuId];
        skuTags.forEach((tagId: Id) => {
          resultTagsCollection.add(tagId);
        });
      });
    }

    return [...resultTagsCollection];
  }, [
    chosen.length,
    chosenIds,
    groupsPopulatedWithTags.length,
    skuIdToTags,
    tagIdToSku,
    tagsGraph,
  ]);

  const toggleTagSelection = (props: IChosenEntry) => {
    setChosen((prevState) => {
      const { groupId, tagId } = props;
      if (prevState.length === 0) {
        return [{ groupId, tagId }];
      }
      let newState = prevState.map((el) => ({ ...el }));
      const existingEntryIndex = newState.findIndex(
        (item) => item.groupId === groupId
      );
      if (existingEntryIndex === -1) {
        newState.push({ groupId, tagId });
      } else {
        const existingEntry = newState[existingEntryIndex];
        if (existingEntry.tagId === tagId) {
          newState = newState.filter((entry) => entry.tagId !== tagId);
        } else {
          newState.splice(existingEntryIndex, 1, {
            groupId: groupId,
            tagId: tagId,
          });
        }
      }
      return newState;
    });
  };
  const isTagDisabled = (id: Id) => {
    if (chosen.length === 0) {
      return false;
    }
    if (tagIdToSku[id].length === 0) {
      return false;
    }
    return !availableTags.includes(id);
  };

  const areAllOptionsChosen = useMemo(() => {
    return groupsPopulatedWithTags.length === chosen.length;
  }, [chosen.length, groupsPopulatedWithTags.length]);

  const currentSku = useMemo(() => {
    if (!areAllOptionsChosen) {
      return null;
    }

    const chosen = chosenIds.map((id) => tagIdToSku[id]);
    const intersection = [...new Set(getArraysIntersection(chosen))];
    if (intersection.length === 0) {
      console.error('There should be at least one sku for chosen items');
    }
    if (intersection.length !== 1) {
      console.error('Only one sku for chosen items should exist');
    }
    return intersection[0];
  }, [areAllOptionsChosen, chosenIds, tagIdToSku]);

  return (
    <div className={'app'}>
      {groupsPopulatedWithTags.map((entry) => (
        <div key={entry.group.id}>
          <span>{entry.group.title}</span>
          <div className={'group'}>
            {entry.tags.map((tag) => {
              const tagInfo: IChosenEntry = {
                groupId: entry.group.id,
                tagId: tag.id,
              };
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTagSelection(tagInfo)}
                  className={isTagChosen(tagInfo) ? 'active' : ''}
                  disabled={isTagDisabled(tag.id)}
                >
                  {tag.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className={'message'}>
        {!areAllOptionsChosen && (
          <div className={'alert'}>Chose all options!</div>
        )}
        {areAllOptionsChosen && <div>Current Sku: {currentSku}</div>}
      </div>
    </div>
  );
}

export default App;
