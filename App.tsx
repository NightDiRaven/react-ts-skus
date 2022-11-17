import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { groups, Id, skus, tags } from './data';
import { SkuGraph } from './Graph';

interface IChosenEntry {
  groupId: Id;
  tagId: Id;
}
const allTagIds = tags.map((tag) => tag.id);

interface Selected {
  [key: Id]: { tagId: Id; disabled?: Set<Id> };
}

function App() {
  const groupsPopulatedWithTags = useMemo(() => {
    return groups.map((group) => {
      return {
        group,
        tags: tags.filter((tag) => tag.groupId === group.id),
      };
    });
  }, []);

  const [selected, setSelected] = useState<Selected>({});

  const getDisabled = (selected) =>
    Object.values(selected)
      .map((value) => Array.from(value.disabled || []))
      .flat();

  const graph = new SkuGraph();

  graph.setUp({ groups: groupsPopulatedWithTags, skus, tags });

  useEffect(() => {
    graph.setUp({ groups: groupsPopulatedWithTags, skus, tags });
  }, [groupsPopulatedWithTags, skus, tags]);

  const selectItem = ({ groupId, tagId }) => {
    if (selected[groupId] && selected[groupId]?.tagId === tagId) {
      delete selected[groupId];
      const disabled = getDisabled(selected);

      const otherTag = Object.keys(selected).at(0)?.tagId;
      if (otherTag) {
        graph.handleSelect(tagId, (v, a) => {}, disabled);
      } else {
        console.log('need remove all disabled if needed');
      }
    } else {
      selected[groupId] = { tagId };
      const disabled = getDisabled(selected);

      const disabledSet = new Set([...allTagIds]);

      console.log('in peredacha', disabled);
      graph.handleSelect(
        tagId,
        (v) => {
          disabledSet.delete(v);
        },
        disabled
      );

      selected[groupId] = { tagId, disabled: disabledSet };
    }

    setSelected({ ...selected });
  };

  const isTagDisabled = (tagId) =>
    Object.values(selected).some(({ disabled }) => disabled?.has(tagId));

  const isTagSelected = ({ tagId, groupId }) =>
    selected?.[groupId]?.tagId === tagId;

  console.log(
    Object.values(selected).map(
      ({ tagId, disabled }) =>
        `${tagId} запрещает ${Array.from(disabled).join(', ')}`
    )
  );
  // selectItem({ tagId: tags[0].id, groupId: tags[0].groupId });

  const areAllOptionsChosen = Object.keys(selected).length === groups.length;
  const currentSku = skus.find(
    (sku) =>
      sku.tags.sort().join('-') ===
      Object.values(selected)
        .map(({ tagId }) => tagId)
        .sort()
        .join('-')
  )?.id;

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
                  onClick={() => selectItem(tagInfo)}
                  className={isTagSelected(tagInfo) ? 'active' : ''}
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
