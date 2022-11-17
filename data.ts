export type Id = number | string;
export type GroupType = 'button' | 'color';

export interface IGroup {
  id: Id;
  title: string;
  type: GroupType;
}

export interface ITag {
  id: Id;
  groupId: Id;
  value: string;
}

export interface ISku {
  id: Id;
  tags: Id[];
}

export const groups: IGroup[] = [
  { id: 'group-1', title: 'Size', type: 'button' },
  { id: 'group-2', title: 'Color', type: 'button' },
  { id: 'group-3', title: 'Pack', type: 'button' },
  { id: 'group-4', title: 'Title', type: 'button' },
];

export const tags: ITag[] = [
  { id: 'tag-id-0', groupId: 'group-1', value: 'tag0' },
  { id: 'tag-id-1', groupId: 'group-1', value: 'tag1' },
  { id: 'tag-id-2', groupId: 'group-1', value: 'tag2' },

  // for two groups
  { id: 'tag-id-3', groupId: 'group-2', value: 'tag3' },
  { id: 'tag-id-4', groupId: 'group-2', value: 'tag4' },
  { id: 'tag-id-5', groupId: 'group-2', value: 'tag5' },
  { id: 'tag-id-6', groupId: 'group-2', value: 'tag6' },

  // for three groups
  { id: 'tag-id-7', groupId: 'group-3', value: 'tag7' },
  { id: 'tag-id-8', groupId: 'group-3', value: 'tag8' },

  // for four groups
  { id: 'tag-id-9', groupId: 'group-4', value: 'tag9' },
  { id: 'tag-id-10', groupId: 'group-4', value: 'tag10' },
  { id: 'tag-id-11', groupId: 'group-4', value: 'tag11' },
];

export const skus: ISku[] = [
  // UNCOMMENT ONLY ONE SECTION

  // for one group
  // {id: 'sku-id-1', tags: ['tag-id-0']},
  // {id: 'sku-id-2', tags: ['tag-id-1']},
  // {id: 'sku-id-3', tags: ['tag-id-2']},

  // for two groups
  // {id: 'sku-id-1', tags: ['tag-id-0', 'tag-id-3']},
  // {id: 'sku-id-2', tags: ['tag-id-1', 'tag-id-4']},
  // {id: 'sku-id-3', tags: ['tag-id-2', 'tag-id-5']},
  //
  // {id: 'sku-id-4', tags: ['tag-id-0', 'tag-id-5']},
  // {id: 'sku-id-5', tags: ['tag-id-1', 'tag-id-6']},
  // {id: 'sku-id-6', tags: ['tag-id-2', 'tag-id-3']},
  //
  // {id: 'sku-id-7', tags: ['tag-id-0', 'tag-id-4']},
  // {id: 'sku-id-8', tags: ['tag-id-1', 'tag-id-5']},
  // {id: 'sku-id-9', tags: ['tag-id-2', 'tag-id-6']},

  // for three groups
  // {id: 'sku-id-1', tags: ['tag-id-0', 'tag-id-3', 'tag-id-7']},
  // {id: 'sku-id-2', tags: ['tag-id-1', 'tag-id-4', 'tag-id-7']},
  // {id: 'sku-id-3', tags: ['tag-id-2', 'tag-id-5', 'tag-id-8']},
  //
  // {id: 'sku-id-4', tags: ['tag-id-0', 'tag-id-5', 'tag-id-7']},
  // {id: 'sku-id-5', tags: ['tag-id-1', 'tag-id-6', 'tag-id-7']},
  // {id: 'sku-id-6', tags: ['tag-id-2', 'tag-id-3', 'tag-id-7']},
  //
  // {id: 'sku-id-7', tags: ['tag-id-0', 'tag-id-4', 'tag-id-7']},
  // {id: 'sku-id-8', tags: ['tag-id-1', 'tag-id-5', 'tag-id-7']},
  // {id: 'sku-id-9', tags: ['tag-id-2', 'tag-id-6', 'tag-id-8']},

  // for four groups
  { id: 'sku-id-1', tags: ['tag-id-0', 'tag-id-3', 'tag-id-7', 'tag-id-9'] },
  { id: 'sku-id-2', tags: ['tag-id-1', 'tag-id-4', 'tag-id-7', 'tag-id-9'] },
  { id: 'sku-id-3', tags: ['tag-id-2', 'tag-id-5', 'tag-id-8', 'tag-id-11'] },

  { id: 'sku-id-4', tags: ['tag-id-0', 'tag-id-5', 'tag-id-7', 'tag-id-9'] },
  { id: 'sku-id-5', tags: ['tag-id-1', 'tag-id-6', 'tag-id-7', 'tag-id-9'] },
  { id: 'sku-id-6', tags: ['tag-id-2', 'tag-id-3', 'tag-id-7', 'tag-id-9'] },

  { id: 'sku-id-7', tags: ['tag-id-0', 'tag-id-4', 'tag-id-7', 'tag-id-10'] },
  { id: 'sku-id-8', tags: ['tag-id-1', 'tag-id-5', 'tag-id-7', 'tag-id-10'] },
  { id: 'sku-id-9', tags: ['tag-id-2', 'tag-id-6', 'tag-id-8', 'tag-id-10'] },

  { id: 'sku-id-10', tags: ['tag-id-0', 'tag-id-4', 'tag-id-7', 'tag-id-11'] },
  { id: 'sku-id-11', tags: ['tag-id-1', 'tag-id-5', 'tag-id-7', 'tag-id-11'] },
  { id: 'sku-id-12', tags: ['tag-id-2', 'tag-id-6', 'tag-id-8', 'tag-id-11'] },
];
