import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import cloneDeep from 'lodash.clonedeep'
import { nanoid } from "nanoid";
import { arrayMove } from '@dnd-kit/sortable'
import { ComponentPropsType } from "../../components/QuestionComponents";
import { getNextSelectedId, insertNewComponent } from "./utils";

export type ComponentInfoType = {
  fe_id: string; // 前端生成的 id ，服务端 Mongodb 不认这种格式，所以自定义一个 fe_id
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: ComponentPropsType;
};

export type ComponentsStateType = {
  selectedId: string;
  componentList: Array<ComponentInfoType>;
  copiedComponent: ComponentInfoType | null;
};

const INIT_STATE: ComponentsStateType = {
  selectedId: "",
  componentList: [],
  copiedComponent: null,
};

export const componentsSlice = createSlice({
  name: "components",
  initialState: INIT_STATE,
  reducers: {
    // 重置所有组件
    resetComponents: (
      state: ComponentsStateType,
      action: PayloadAction<ComponentsStateType>
    ) => {
      return action.payload;
    },

    // 修改 selectedId
    changeSelectedId: (
      state: ComponentsStateType,
      action: PayloadAction<string>
    ) => {
      return { ...state, selectedId: action.payload };
    },
    // changeSelectedId: produce((draft: ComponentsStateType, action: PayloadAction<string>) => {
    //   // console.log("看看action.payload", action.payload);
    //   // console.log("这是draft1", draft.selectedId);

    //   draft.selectedId = action.payload
    //   // console.log("这是draft2", draft.selectedId);
    //   // initialState

    // }),

    // 添加新组件
    addComponent: (
      state: ComponentsStateType,
      action: PayloadAction<ComponentInfoType>
    ) => {
      const newComponent = action.payload;
      // console.log(state.componentList);
      insertNewComponent(state, newComponent);
    },
    // 修改组件属性
    changeComponentProps: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>
    ) => {
      const { fe_id, newProps } = action.payload;
      // 当前要修改属性的这个组件
      const curComp = state.componentList.find((c) => c.fe_id === fe_id);
      if (curComp) {
        console.log(curComp.props, "props");

        curComp.props = {
          ...curComp.props,
          ...newProps,
        };
      }
    },
    // 删除选中的组件
    removeSelectedComponent: (state: ComponentsStateType) => {
      const { componentList = [], selectedId: removedId } = state;

      // 重新计算 selectedId
      const newSelectedId = getNextSelectedId(removedId, componentList);
      state.selectedId = newSelectedId;

      const index = componentList.findIndex((c) => c.fe_id === removedId);
      componentList.splice(index, 1);
    },

    // 隐藏/显示 组件
    changeComponentHidden: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string; isHidden: boolean }>
    ) => {
      const { componentList = [] } = state;
      const { fe_id, isHidden } = action.payload;

      // 重新计算 selectedId
      let newSelectedId = "";
      if (isHidden) {
        // 要隐藏
        newSelectedId = getNextSelectedId(fe_id, componentList);
      } else {
        // 要显示
        newSelectedId = fe_id;
      }
      state.selectedId = newSelectedId;
      const curComp = componentList.find((c) => c.fe_id === fe_id);
      if (curComp) {
        curComp.isHidden = isHidden;
      }
    },
    // 锁定/解锁 组件
    toggleComponentLocked: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string }>
    ) => {
      const { fe_id } = action.payload;

      const curComp = state.componentList.find((c) => c.fe_id === fe_id);
      if (curComp) {
        curComp.isLocked = !curComp.isLocked;
      }
    },
    // 拷贝当前选中的组件
    copySelectedComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList = [] } = state;
      const selectedComponent = componentList.find(
        (c) => c.fe_id === selectedId
      );
      if (selectedComponent == null) return;
      state.copiedComponent = cloneDeep(selectedComponent) // 深拷贝
    },

    // 粘贴组件
    pasteCopiedComponent: (draft: ComponentsStateType) => {
      const { copiedComponent } = draft;
      if (copiedComponent == null) return;

      // 要把 fe_id 给修改了，重要！！
      copiedComponent.fe_id = nanoid()

      // 插入 copiedComponent
      insertNewComponent(draft, copiedComponent);
    },

    // 选中上一个
    selectPrevComponent: (draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft;
      const selectedIndex = componentList.findIndex(
        (c) => c.fe_id === selectedId
      );

      if (selectedIndex < 0) return; // 未选中组件
      if (selectedIndex <= 0) return; // 已经选中了第一个，无法在向上选中

      draft.selectedId = componentList[selectedIndex - 1].fe_id;
    },

    // 选中下一个
    selectNextComponent: (draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft;
      const selectedIndex = componentList.findIndex(
        (c) => c.fe_id === selectedId
      );

      if (selectedIndex < 0) return; // 未选中组件
      if (selectedIndex + 1 === componentList.length) return; // 已经选中了最后一个，无法再向下选中

      draft.selectedId = componentList[selectedIndex + 1].fe_id;
    },

    // 修改组件标题
    changeComponentTitle: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ fe_id: string; title: string }>
      ) => {
        const { title, fe_id } = action.payload;
        const curComp = draft.componentList.find((c) => c.fe_id === fe_id);
        if (curComp) curComp.title = title;
      }
    ),

    // 移动组件位置
    moveComponent: 
      (
        state: ComponentsStateType,
        action: PayloadAction<{ oldIndex: number; newIndex: number }>
      ) => {
        const { componentList: curComponentList } = state;
        const { oldIndex, newIndex } = action.payload;

        state.componentList = arrayMove(curComponentList, oldIndex, newIndex)
      }
    ,
  },
});

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectNextComponent,
  changeComponentTitle,
  moveComponent,
} = componentsSlice.actions;

export default componentsSlice.reducer;
